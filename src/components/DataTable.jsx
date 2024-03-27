import React, { useEffect, useState } from "react";
import { formatCurrency, getData, sortColumns } from "../utils/dataUtils";
import { useSort } from "../hooks/useSort";

const columns = [
  { name: "Name", sort: "item name" },
  { name: "Price", sort: "item price" },
  { name: "Date", sort: "date" },
  { name: "Order", sort: "orderId" },
];

const DataTable = ({ orderData }) => {
  const [data, setData] = useState([]);
  const { sortCol, sortAsc, updateSort } = useSort("item name");

  useEffect(() => {
    const { all } = getData(orderData);
    setData(all);
  }, [orderData]);

  return (
    <div className="data-table">
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
    </div>
  );
};

export default DataTable;
