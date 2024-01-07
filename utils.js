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

module.export = { getCookies };
