import React from "react";

const Search = ({ searchItems }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={(event) => {
          searchItems(event.target.value);
        }}
      />
    </div>
  );
};

export default Search;
