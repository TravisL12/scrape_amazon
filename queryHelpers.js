// query - paste into the Search Results page console
function getIds(aLinks) {
  const links = aLinks || document.querySelectorAll("a.a-link-normal");
  const ids = Array.from(links)
    .filter((link) => link.textContent === "Order details")
    .map((link) => new URLSearchParams(link.href).get("search"));
  const uniqIds = [...new Set(ids)];
  return uniqIds.join(",");
}

function getOtherIds() {
  const orderIds = document.querySelectorAll(".a-color-secondary.value bdi");
  return Array.from(orderIds).map((order) => order.innerText);
}

module.exports = {
  getIds,
  getOtherIds,
};
