const fs = require("fs");
const puppeteer = require("puppeteer");
const {
  getCookies,
  buildSearchUrl,
  onlyUnique,
  formatDate,
} = require("./utils");
const savedOrderIds = require("./savedOrderIds.json");

let failedCount = 0;
const fetchPdfs = (id, page, saveReceipt, query) => {
  const url = `https://www.amazon.com/gp/css/summary/print.html?orderID=${id}`;

  return new Promise((resolve) => {
    console.time(id);
    getCookies(url, async (cookies) => {
      await page.setCookie(...cookies);
      await page.goto(url, {
        waitUntil: "networkidle2",
      });
      await page.setViewport({ width: 1680, height: 1050 });
      const { shippedDate, failedText } = await page.evaluate(() => {
        const shippedDateEl = document.querySelectorAll("td b.sans center");
        const filtered = Array.from(shippedDateEl).find((td) =>
          td.textContent?.includes("Shipped on")
        );

        const doc = document.querySelector("*").outerHTML;
        const badText = [
          "Email or mobile phone number",
          "Switch accounts",
          "Type the characters you see in this image:",
        ];
        const failedText = badText.find((bad) => doc.includes(bad));
        return {
          shippedDate: filtered?.textContent.trim() || false,
          failedText,
        };
      });

      if (failedText) {
        failedCount++;
        console.log(failedText, id, "isFailed");
      } else {
        const formattedDate = formatDate(
          shippedDate?.replace("Shipped on ", "")
        );

        await page.pdf({
          path: `pdfs/${formattedDate}_amazon-${query}-${id}.pdf`,
        });
        console.timeEnd(id);
        if (saveReceipt) {
          savedOrderIds.push(id);
          fs.writeFile(
            "./savedOrderIds.json",
            JSON.stringify(savedOrderIds.sort()),
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
      headless: "new",
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
  }

  async startSearch(pages, query) {
    failedCount = 0;
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
      .filter((id) => !savedOrderIds.includes(id));

    console.log(totalIds.length, "ID count");
    console.log(totalIds, "fetching these IDs");

    return await this.fetchReceipts(totalIds, query);
  }

  async fetchReceipts(receiptIds, query) {
    const pdfs = [];
    for (let i = 0; i < receiptIds.length; i++) {
      const page = await this.browser.newPage();
      const id = receiptIds[i];
      const pdf = fetchPdfs(id, page, this.saveReceiptId, query);
      pdfs.push(pdf);
    }

    return await Promise.all(pdfs);
  }

  closeSession() {
    this.browser.close();
  }
}

const parseFlags = (args, flag) => {
  let item;
  if (args.includes(flag)) {
    const idx = args.findIndex((a) => a === flag);
    if (idx !== undefined && args[idx + 1] !== undefined) {
      item = args[idx + 1];
    }
  }
  return item;
};

const getFlags = (args) => {
  const queryFlag = parseFlags(args, FLAGS.query);
  const queries = queryFlag ? queryFlag.split(",") : ["whole foods", "fresh"];

  const shouldSave = parseFlags(args, FLAGS.save);
  const saveReceipt = shouldSave !== undefined ? shouldSave === "true" : true;

  const pageCount = parseFlags(args, FLAGS.count) || 30;
  console.log({ queries, saveReceipt, pageCount });
  return { queries, saveReceipt, pageCount };
};

const FLAGS = {
  count: "-c", // number
  save: "-s", // boolean
  query: "-q", // string[]
};

const { queries, saveReceipt, pageCount } = getFlags(process.argv);
const start = async () => {
  const receipts = new Receipts(saveReceipt);
  await receipts.initialize();
  for (let i = 0; i < queries.length; i++) {
    const searchQuery = queries[i];
    await receipts.startSearch(pageCount, searchQuery);
    console.log(searchQuery, "COMPLETE");
    console.log(failedCount, "FAILED");
  }
  receipts.closeSession();
};

start();
