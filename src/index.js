import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import DataTable from "./components/DataTable.jsx";
import GroupedDataTable from "./components/GroupedDataTable.jsx";
import order from "./orders/2024_03_24_Amazon.csv";
import "./styles/index.scss";
import Search from "./components/Search.jsx";
import { getData } from "./utils/dataUtils.js";

const root = document.getElementById("root");

const App = () => {
  const [data, setData] = useState([]);

  const resetData = () => {
    const { all, grouped } = getData(order);
    setData(grouped);
  };

  useEffect(() => {
    resetData();
  }, []);

  const searchItems = (query) => {
    if (query === "") {
      console.log("serach empty");
      resetData();
      return;
    }

    const newItems = data.filter(
      ({ name }) => name && name.toLowerCase().includes(query.toLowerCase())
    );
    setData(newItems);
  };

  return (
    <div className="data-table">
      <Search searchItems={searchItems} />
      {/* <DataTable data={data} /> */}
      <GroupedDataTable data={data} />
    </div>
  );
};

createRoot(root).render(<App />);
