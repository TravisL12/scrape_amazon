// query - paste into the Search Results page console
function getIds() {
  const links = document.querySelectorAll("a.a-link-normal");
  const ids = [...links]
    .filter((link) => link.textContent === "Order details")
    .map((link) => new URLSearchParams(link.href).get("search"));
  const uniqIds = [...new Set(ids)];
  return uniqIds.join(",");
}

function getOtherIds() {
  const orderIds = document.querySelectorAll(".a-color-secondary.value bdi");
  return Array.from(orderIds).map((order) => order.innerText);
}

const url = `https://www.amazon.com/gp/css/summary/print.html?orderID=112-3742623-3439412`;

module.exports = {
  getIds,
  getOtherIds,
};
