import React, { useEffect, useState } from "react";
import { getData, sortColumns } from "../utils/dataUtils";

const columns = [
  { name: "Name", sort: "item name" },
  { name: "Price", sort: "item price" },
  { name: "Date", sort: "date" },
  { name: "Order", sort: "orderId" },
];

const DataTable = ({ orderData }) => {
  const [data, setData] = useState([]);
  const [sortCol, setSortCol] = useState("item name");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const d = getData(orderData);
    setData(d);
  }, [orderData]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.name}
                onClick={() => {
                  setSortCol(col.sort);
                  setSortAsc(!sortAsc);
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
                  <td>{d["item price"]}</td>
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
