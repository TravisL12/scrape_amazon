import React from "react";
import { createRoot } from "react-dom/client";
import DataTable from "./components/DataTable.jsx";
import order from "./orders/2024_03_24_Amazon.csv";

const root = document.getElementById("root");

const App = () => {
  return <DataTable orderData={order} />;
};

createRoot(root).render(<App />);
