import React from "react";

const Search = ({ searchItems }) => {
  return (
    <input
      type="text"
      onChange={(event) => {
        searchItems(event.target.value);
      }}
    />
  );
};

export default Search;
