import { useState } from "react";

export const useSort = (initSort) => {
  const [sortCol, setSortCol] = useState(initSort);
  const [sortAsc, setSortAsc] = useState(true);

  const updateSort = (col) => {
    setSortCol(col);
    setSortAsc(!sortAsc);
  };

  return { sortCol, sortAsc, updateSort };
};
