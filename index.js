const puppeteer = require("puppeteer");
const chrome = require("chrome-cookies-secure");
const { ids } = require("./moreIds");

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

async function fetchPdfs(id) {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  const url = `https://www.amazon.com/gp/css/summary/print.html?orderID=${id}`;
  // have to use a callback cause it doesn't use promises (weird right?)
  await getCookies(url, async (cookies) => {
    await page.setCookie(...cookies);
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    await page.setViewport({ width: 1680, height: 1050 });
    await page.pdf({
      path: `pdfs/amazon-receipt-${id}.pdf`,
    });
    await browser.close();
  });
  return;
}

const fetchReceipts = async () => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    console.log(`ID: ${id} - starting`);
    await fetchPdfs(id);
    console.log(`ID: ${id} - complete`);
  }
};
fetchReceipts();

// const page = 4;
// const perPage = 20;
// ids.slice(page * perPage, page * perPage + perPage).forEach(async (id) => {
//   console.log(`ID: ${id} - starting`);
//   await fetchPdfs(id);
//   console.log(`ID: ${id} - complete`);
// });
