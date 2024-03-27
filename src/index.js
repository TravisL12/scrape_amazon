import React from "react";
import { createRoot } from "react-dom/client";
import DataTable from "./components/DataTable.jsx";
import GroupedDataTable from "./components/GroupedDataTable.jsx";
import order from "./orders/2024_03_24_Amazon.csv";
import "./styles/index.scss";

const root = document.getElementById("root");

const App = () => {
  // return <DataTable orderData={order} />;
  return <GroupedDataTable orderData={order} />;
};

createRoot(root).render(<App />);
