const fs = require("fs");
const puppeteer = require("puppeteer");
const { getCookies, buildSearchUrl, onlyUnique } = require("./utils");
const orderIds = require("./orderIds.json");

const fetchPdfs = (id, page, saveReceipt) => {
  const url = `https://www.amazon.com/gp/css/summary/print.html?orderID=${id}`;

  return new Promise((resolve) => {
    console.time(id);
    getCookies(url, async (cookies) => {
      await page.setCookie(...cookies);
      await page.goto(url, {
        waitUntil: "networkidle2",
      });
      await page.setViewport({ width: 1680, height: 1050 });
      const failedText = await page.evaluate(() => {
        const doc = document.querySelector("*").outerHTML;
        const badText = [
          "Sign in",
          "Switch accounts",
          "Type the characters you see in this image:",
        ];
        return badText.find((bad) => doc.includes(bad));
      });

      if (failedText) {
        console.log(failedText, id, "isFailed");
      } else {
        await page.pdf({
          path: `pdfs/amazon-receipt-${id}.pdf`,
        });
        console.timeEnd(id);
        if (saveReceipt) {
          orderIds.push(id);
          fs.writeFile(
            "./orderIds.json",
            JSON.stringify(orderIds.sort()),
            () => {}
          );
        }
      }
      resolve();
    });
  });
};

const crawlPages = (page, url) => {
  return new Promise(async (resolve) => {
    await getCookies(url, async (cookies) => {
      await page.setCookie(...cookies);
      await page.goto(url, {
        waitUntil: "networkidle2",
      });
      // can't figure out the passing into context crap so heres the getIds fn
      // await page.exposeFunction("myFunc", getIds);
      const data = await page.evaluate(() => {
        const links = document.querySelectorAll("a.a-link-normal");
        const ids = Array.from(links)
          .filter((link) => link.textContent === "Order details")
          .map((link) => new URLSearchParams(link.href).get("search"));
        return [...new Set(ids)];
      });
      console.log(url, "done!");
      resolve(data);
    });
  });
};

class Receipts {
  constructor(saveReceiptId) {
    this.saveReceiptId = saveReceiptId !== undefined ? saveReceiptId : true;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
  }

  async startSearch(pages, query) {
    const pageResp = [];
    for (let i = 0; i < pages; i++) {
      const url = buildSearchUrl(i, query);
      const page = await this.browser.newPage();
      const resp = crawlPages(page, url);
      pageResp.push(resp);
    }

    const total = await Promise.all(pageResp);
    const totalIds = total
      .flat()
      .filter(onlyUnique)
      .filter((id) => !orderIds.includes(id));

    console.log(totalIds.length, "ID count");
    console.log(totalIds, "fetching these IDs");

    return await this.fetchReceipts(totalIds);
  }

  async fetchReceipts(receiptIds) {
    const pdfs = [];
    for (let i = 0; i < receiptIds.length; i++) {
      const page = await this.browser.newPage();
      const id = receiptIds[i];
      const pdf = fetchPdfs(id, page, this.saveReceiptId);
      pdfs.push(pdf);
    }

    return await Promise.all(pdfs);
  }

  closeSession() {
    this.browser.close();
  }
}

const pageCount = process.argv[2] || 30;
const queries = [process.argv[3]] || ["whole+foods", "fresh"];
let saveReceipt = false;

const start = async () => {
  const receipts = new Receipts(saveReceipt);
  await receipts.initialize();
  for (let i = 0; i < queries.length; i++) {
    const searchQuery = queries[i];
    await receipts.startSearch(pageCount, searchQuery);
    console.log(searchQuery, "COMPLETE");
  }
  receipts.closeSession();
};

start();
