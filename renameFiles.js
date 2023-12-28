const fs = require("fs");
const path = require("path");
const { receipts } = require("./receiptsIdDates");

const pad = (val) => {
  return `0${val}`.slice(-2);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}_${pad(date.getMonth() + 1)}_${pad(
    date.getDate()
  )}`;
};

const sourceDir = path.join(__dirname, "pdfs", "test");
const outputDir = path.join(__dirname, "pdfs", "output");

const directoryFiles = fs.readdirSync(sourceDir);

directoryFiles.forEach((file) => {
  const match = receipts.find((rec) => {
    return file.includes(rec.id);
  });

  if (match) {
    fs.copyFile(
      `${sourceDir}/${file}`,
      `${outputDir}/${formatDate(match.date)}-${file}`,
      (err) => {
        if (err) console.log(err);
      }
    );
  }
});
