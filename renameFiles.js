// USE THIS RENAME THE RECEIPT FILES TO INCLUDE A DATE AT THE FRONT
// command: `node renameFiles.js`

const fs = require("fs");
const path = require("path");
const { receipts } = require("./receiptsIdDates");
const { formatDate } = require("./utils");

const sourceDir = path.join(__dirname, "categories", "groceries");
const outputDir = path.join(__dirname, "categories", "renamed");

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
