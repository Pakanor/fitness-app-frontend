// DateSearch.js
import React, { useState } from "react";

export default function DateSearch({ onSearch }) {
  const [dateInput, setDateInput] = useState("");

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      const date = dateInput || new Date().toISOString().split("T")[0];
      onSearch(date); 
    }
  };

  return (
    <input
      type="date"
      value={dateInput}
      onChange={(e) => setDateInput(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  );
}
