import React, { useState } from "react";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  return (
    <div>
      <input
        type="text"
        placeholder="Search here..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-[300px] p-2 rounded-lg border border-gray-400"
      />
    </div>
  );
}
