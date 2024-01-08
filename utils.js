const chrome = require("chrome-cookies-secure");

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
const buildSearchUrl = (pageNum, keyword) => {
  const pageStart = pageNum; // 0 index, first page is 0, second is 1, etc.
  const pageEnd = pageStart + 1;
  const startIndex = pageStart * 10;

  return `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_${pageStart}_${pageEnd}_search?search=${encodeURIComponent(
    keyword
  )}&startIndex=${startIndex}`;
};

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

module.exports = { getCookies, buildSearchUrl, onlyUnique };
