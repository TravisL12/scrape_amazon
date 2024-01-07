const puppeteer = require("puppeteer");
const chrome = require("chrome-cookies-secure");
const { getIds } = require("./queryHelpers.js");

const getCookies = (url, cb) => {
  return chrome.getCookies(
    url,
    "puppeteer",
    function (err, cookies) {
      if (err) {
        console.log(err, "error");
        return;
      }

      cb(cookies);
    },
    "Default"
  );
};

// example searches
// `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_1_2_search?ie=UTF8&orderFilter=months-3&search=whole%20foods&startIndex=10`;
// `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_2_3_search?ie=UTF8&orderFilter=months-3&search=whole%20foods&startIndex=20`;
let pageStart = 0; // 0 index, first page is 0, second is 2, etc.
let pageEnd = pageStart + 1;
let startIndex = pageStart * 10;
const searchQuery = "whole+foods";
const searchPages = async (page) => {
  const url = `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_${pageStart}_${pageEnd}_search?search=${encodeURIComponent(
    searchQuery
  )}&startIndex=${startIndex}`;
  await getCookies(url, async (cookies) => {
    await page.setCookie(...cookies);
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    try {
      const data = await page.evaluate(() => {
        const a = getIds();
        console.log(a);
        const links = document.querySelectorAll("a.a-link-normal");
        const ids = [...links]
          .filter((link) => link.textContent === "Order details")
          .map((link) => new URLSearchParams(link.href).get("search"));
        const uniqIds = [...new Set(ids)];
        return uniqIds.join(",");
      });
      console.log(data, "data");
      return data;
    } catch (err) {
      console.log(err, "what?????");
    }
  });
  return;
};

const startSearch = async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await searchPages(page);

  setTimeout(() => {
    console.log("CLOSING");
    browser.close();
  }, 30 * 1000);
};

startSearch();
