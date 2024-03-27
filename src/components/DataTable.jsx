import React from "react";
import { formatCurrency, sortColumns } from "../utils/dataUtils";
import { useSort } from "../hooks/useSort";

const columns = [
  { name: "Name", sort: "item name" },
  { name: "Price", sort: "item price" },
  { name: "Date", sort: "date" },
  { name: "Order", sort: "orderId" },
];

const DataTable = ({ data }) => {
  const { sortCol, sortAsc, updateSort } = useSort("item name");

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
            d["item name"] ? (
              <tr key={`${d["item name"]}-${d["orderId"]}-${idx}`}>
                <td style={{ width: "60%" }}>{d["item name"]}</td>
                <td>{formatCurrency(d["item price"])}</td>
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
