import { useEffect, useMemo, useState } from "react";
import { getData } from "../utils/dataUtils";
import { ALL, ITEM_NAME, NAME } from "../constants";

export const useOrderData = (orderData, type) => {
  const initData = useMemo(() => {
    const parsed = getData(orderData);
    return parsed[type];
  }, [type]);
  const [data, setData] = useState(initData);

  useEffect(() => {
    setData(initData);
  }, [initData]);

  const searchItems = (query) => {
    const nameAttr = type === ALL ? ITEM_NAME : NAME;
    const newItems = initData.filter(
      (item) =>
        item[nameAttr] &&
        item[nameAttr].toLowerCase().includes(query.toLowerCase())
    );
    setData(newItems);
  };

  return { data, searchItems };
};
