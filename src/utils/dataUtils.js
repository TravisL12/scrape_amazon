const priceClean = (item) => {
  if (!item) {
    return item;
  }
  let val = item;
  if (val.match(/\) \$\d+.\d+/)) {
    val = val.match(/\) \$\d+.\d+/)[0];
  }
  const newStr = Number(val.replace(/[^0-9.-]+/g, ""));
  return !newStr || typeof newStr !== "number" ? item : newStr;
};

const nameClean = (item) => {
  if (!item) {
    return item;
  }
  return item.replace(/365 by Whole Foods Market,?/i, "");
};

const nameSlug = (item) => {
  if (!item) {
    return item;
  }
  return item.replace(/[\W()'.,%\/\s]/gi, "").toLowerCase();
};

const groupBy = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.nameSlug]) {
      acc[item.nameSlug] = {
        name: item["item name"],
        slug: item.nameSlug,
        items: [],
        total: 0,
        avgCost: 0,
      };
    }
    acc[item.nameSlug].total += item["item price"];
    acc[item.nameSlug].items.push(item);
    acc[item.nameSlug].avgCost =
      +acc[item.nameSlug].total / acc[item.nameSlug].items.length;
    return acc;
  }, {});
};

export const getData = (orderData) => {
  const headers = orderData[0].slice(1);
  const d = orderData.slice(1).map((row) => {
    try {
      return headers.reduce((acc, header, idx) => {
        // parse list of items idx === 1
        acc[header] =
          header === "List_of_items" ? JSON.parse(row[idx + 1]) : row[idx + 1];
        return acc;
      }, {});
    } catch (err) {
      return;
    }
  });
  const all = d
    .filter((x) => x)
    .map((x) =>
      x["List_of_items"].map((z) => ({
        ...z,
        "item name": nameClean(z["item name"]),
        "item price": priceClean(z["item price"]),
        nameSlug: nameSlug(nameClean(z["item name"])),
        date: new Date(x.order_placed_date),
        orderId: x.order_number,
      }))
    )
    .flat();
  const grouped = groupBy(all);
  console.log(all, "after");
  console.log(
    Object.values(grouped).sort((a, b) =>
      a.items.length > b.items.length ? -1 : 1
    ),
    "GROUPED"
  );
  return { all, grouped: Object.values(grouped) };
};

export const sortColumns = (a, b, sortAsc) => {
  const isDate = a instanceof Date;
  if (isDate) {
    if (sortAsc) {
      return a.getTime() > b.getTime() ? 1 : -1;
    }
    return a.getTime() < b.getTime() ? 1 : -1;
  }
  const isNumber = typeof a === "number" && typeof b === "number";
  if (isNumber) {
    if (sortAsc) {
      return a > b ? 1 : -1;
    }
    return a < b ? 1 : -1;
  }

  return sortAsc ? String(a)?.localeCompare(b) : String(b)?.localeCompare(a);
};

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatCurrency = (price) => {
  return USDollar.format(price);
};
