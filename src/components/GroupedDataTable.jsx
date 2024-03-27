import React from "react";
import { formatCurrency, sortColumns } from "../utils/dataUtils";
import { useSort } from "../hooks/useSort";

const groupColumns = [
  { name: "Name", sort: "name" },
  { name: "Item Count", sort: "items" },
  { name: "Avg Cost", sort: "avgCost" },
  { name: "Total", sort: "total" },
];

const GroupedDataTable = ({ data }) => {
  const { sortCol, sortAsc, updateSort } = useSort("name");

  return (
    <table>
      <thead>
        <tr>
          {groupColumns.map((col) => (
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
            d["name"] ? (
              <tr key={`${d["name"]}-${idx}`}>
                <td style={{ width: "60%" }}>{d["name"]}</td>
                <td>{d["items"].length}</td>
                <td>{formatCurrency(d["avgCost"])}</td>
                <td>{formatCurrency(d["total"])}</td>
              </tr>
            ) : null
          )}
      </tbody>
    </table>
  );
};

export default GroupedDataTable;
