import React, { useState } from "react";
import DataTable from "../components/DataTable.jsx";
import GroupedDataTable from "./GroupedDataTable.jsx";
import order from "../orders/2024_03_24_Amazon.csv";
import "../styles/index.scss";
import Search from "./Search.jsx";
import { useOrderData } from "../hooks/useOrderData.js";
import { ALL, GROUPED } from "../constants.js";

const App = () => {
  const [type, setType] = useState(GROUPED);
  const { data, searchItems } = useOrderData(order, type);

  return (
    <div className="data-table">
      <div className="flex gap-8">
        <button
          className={type === ALL ? "active" : null}
          onClick={() => setType(ALL)}
        >
          All
        </button>
        <button
          className={type === GROUPED ? "active" : null}
          onClick={() => setType(GROUPED)}
        >
          Grouped
        </button>
      </div>
      <Search searchItems={searchItems} />
      {type === ALL ? (
        <DataTable data={data} />
      ) : (
        <GroupedDataTable data={data} />
      )}
    </div>
  );
};

export default App;
