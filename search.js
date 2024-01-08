const puppeteer = require("puppeteer");
const { getCookies } = require("./utils.js");

// example searches
// `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_1_2_search?ie=UTF8&orderFilter=months-3&search=whole%20foods&startIndex=10`;
// `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_2_3_search?ie=UTF8&orderFilter=months-3&search=whole%20foods&startIndex=20`;
const buildUrl = (pageNum) => {
  let pageStart = pageNum; // 0 index, first page is 0, second is 1, etc.
  let pageEnd = pageStart + 1;
  let startIndex = pageStart * 10;
  const searchQuery = "whole+foods";
  return `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_${pageStart}_${pageEnd}_search?search=${encodeURIComponent(
    searchQuery
  )}&startIndex=${startIndex}`;
};

const searchPages = (page, url) => {
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
      resolve(data);
    });
  });
};

let totalIds = [];
const pageCount = 3;
const startSearch = async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  for (let i = 0; i < pageCount; i++) {
    const url = buildUrl(i);
    const page = await browser.newPage();
    const output = await searchPages(page, url);
    totalIds = totalIds.concat(output);
    console.log(totalIds, "totalIds");
  }

  browser.close();
};

startSearch();
