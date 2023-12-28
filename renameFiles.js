#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const { receipts } = require("./receiptsIdDates");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}_${date.getMonth + 1}_${date.getDate()}`;
};

const sourceDir = path.join(__dirname, "pdfs", "test");
const outputDir = path.join(__dirname, "pdfs", "output");

const directoryFiles = fs.readdirSync(sourceDir);

directoryFiles.forEach((file) => {
  const match = receipts.find((rec) => {
    return file.includes(rec.id);
  });

  if (match) {
    console.log((match.date, formatDate(match.date)));
    fs.rename(
      `${sourceDir}/${file}`,
      `${outputDir}/${formatDate(match.date)}-${file}`,
      (err) => {
        if (err) console.log(err);
      }
    );
  }
});
