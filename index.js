const fs = require("fs");
const puppeteer = require("puppeteer");
const { getCookies, buildSearchUrl, onlyUnique } = require("./utils");
const orderIds = require("./orderIds.json");

const fetchPdfs = async (id, page) => {
  const url = `https://www.amazon.com/gp/css/summary/print.html?orderID=${id}`;

  return new Promise(async (resolve) => {
    console.time(id);
    await getCookies(url, async (cookies) => {
      await page.setCookie(...cookies);
      await page.goto(url, {
        waitUntil: "networkidle2",
      });
      await page.setViewport({ width: 1680, height: 1050 });
      await page.pdf({
        path: `pdfs/amazon-receipt-${id}.pdf`,
      });
      console.timeEnd(id);
      orderIds.push(id);
      fs.writeFile(
        "./orderIds.json",
        JSON.stringify(orderIds.sort()),
        () => {}
      );
      resolve();
    });
  });
};

const crawlPages = async (page, url) => {
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

    console.log(totalIds, "fetching these IDs");
    this.fetchReceipts(totalIds);
  }

  async fetchReceipts(receiptIds) {
    const pdfs = [];
    for (let i = 0; i < receiptIds.length; i++) {
      const page = await this.browser.newPage();
      const id = receiptIds[i];
      pdfs.push(fetchPdfs(id, page));
    }

    await Promise.all(pdfs);

    console.log("CLOSING");
    this.browser.close();
  }
}

const pageCount = 20;
const searchQuery = "whole+foods";
const start = async () => {
  const receipts = new Receipts();
  await receipts.initialize();
  await receipts.startSearch(pageCount, searchQuery);
};

start();
