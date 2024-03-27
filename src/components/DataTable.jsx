import React from "react";
import { formatCurrency, sortColumns } from "../utils/dataUtils";
import { useSort } from "../hooks/useSort";
import { ITEM_NAME, ITEM_PRICE } from "../constants";

const columns = [
  { name: "Name", sort: ITEM_NAME },
  { name: "Price", sort: ITEM_PRICE },
  { name: "Date", sort: "date" },
  { name: "Order", sort: "orderId" },
];

const DataTable = ({ data }) => {
  const { sortCol, sortAsc, updateSort } = useSort(ITEM_NAME);

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.name}
              onClick={() => {
                updateSort(col.sort);
              }}
            >
              {col.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data
          .sort((a, b) => sortColumns(a[sortCol], b[sortCol], sortAsc))
          .map((d, idx) =>
            d[ITEM_NAME] ? (
              <tr key={`${d[ITEM_NAME]}-${d["orderId"]}-${idx}`}>
                <td style={{ width: "60%" }}>{d[ITEM_NAME]}</td>
                <td>{formatCurrency(d[ITEM_PRICE])}</td>
                <td>{d["date"].toLocaleDateString()}</td>
                <td>{d["orderId"]}</td>
              </tr>
            ) : null
          )}
      </tbody>
    </table>
  );
};

export default DataTable;
