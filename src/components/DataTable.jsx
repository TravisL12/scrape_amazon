import React, { useEffect, useState } from "react";

const DataTable = ({ orderData }) => {
  const [data, setData] = useState([]);
  const [sortCol, setSortCol] = useState("item name");
  const getData = () => {
    const headers = orderData[0].slice(1);
    const d = orderData.slice(1).map((row) => {
      try {
        return headers.reduce((acc, header, idx) => {
          // parse list of items idx === 1
          acc[header] = idx === 1 ? JSON.parse(row[idx + 1]) : row[idx + 1];
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
          date: x.order_placed_date,
          orderId: x.order_number,
        }))
      )
      .flat();
    console.log(d, all, "orig, convert");
    setData(all);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th
              onClick={() => {
                setSortCol("item name");
              }}
            >
              Name
            </th>
            <th
              onClick={() => {
                setSortCol("item price");
              }}
            >
              Price
            </th>
            <th
              onClick={() => {
                setSortCol("date");
              }}
            >
              Date
            </th>
            <th
              onClick={() => {
                setSortCol("orderId");
              }}
            >
              Order
            </th>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => {
              return a[sortCol] > b[sortCol] ? 1 : -1;
            })
            .map((d, idx) =>
              d["item name"] ? (
                <tr key={idx}>
                  <td style={{ width: "60%" }}>{d["item name"]}</td>
                  <td>{d["item price"]}</td>
                  <td>{d["date"]}</td>
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
