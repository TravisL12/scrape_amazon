const puppeteer = require("puppeteer");
const chrome = require("chrome-cookies-secure");

// query - use after searching orders for "whole foods"
function getIds() {
  const links = document.querySelectorAll("a.a-link-normal");
  const ids = [...links]
    .filter((link) => link.textContent === "Order details")
    .map((link) => new URLSearchParams(link.href).get("search"));
  const uniqIds = [...new Set(ids)];
  return uniqIds.join(",");
}

// or do this on the Orders page
function getOrders() {
  const orderEl = document.querySelectorAll(".yohtmlc-order-id");
  const ids = [...orderEl].map((el) => el.querySelector("bdi").textContent); // bdi is element wrapper on the order #
  return JSON.stringify(ids);
}

// const url = `https://www.amazon.com/gp/css/summary/print.html?orderID=112-3742623-3439412`;

const ids = [
  // "112-0258483-3901058",
  // "112-3742623-3439412",
  // "112-7292177-6333040",
  // "112-5475326-6376254",
  // "112-8761296-5609062",
  // "114-2533056-2312226",
  // "112-4534501-6869828",
  // "112-3497485-5723404",
  // "112-3368844-5690635",
  // "112-1005932-4304210",
  // "112-1961786-4172253",
  // "112-4468792-6433854",
  // "112-6295084-1889033",
  // "112-3226783-2420243",
  // "112-7493554-0401864",
  // "112-6508211-3307413",
  // "112-2854277-0222626",
  // "114-3676612-9655414",
  // "114-0640344-0137822",
  // "112-1390443-1370639",
  // "112-6278101-3606667",
  // "112-0319733-6704260",
  // "112-5718881-7006603",
  // "112-0045014-7836259",
  // "112-0552359-9682629",
  // "112-1575111-2212204",
  // "112-8934746-9264242",
  // "114-6149032-4121868",
  // "112-3616838-0783455",
  // "112-5758137-2659463",
  // "112-4867235-3719454",
  // "112-8230732-8695433",
  // "112-1128013-2946637",
  // "114-2954014-4149056",
  // "114-5409099-0741011",
  //new
  "112-3717745-1583462",
  "112-8111902-5411469",
  "112-4973449-7192212",
  "112-7027990-8703435",
  "112-6171618-3339442",
  "112-8639237-9024209",
  "112-2587097-7353042",
  "112-6636098-1324222",
  "112-0030414-0493844",
  "112-6427193-7585856",
];

const getCookies = (url, cb) => {
  chrome.getCookies(
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
  getCookies(url, async (cookies) => {
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
}

// fetchPdfs(ids[0]);
ids.forEach((id) => {
  fetchPdfs(id);
});
