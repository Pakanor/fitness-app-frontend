import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";

export default function DateSearch({ selectedDate, onSearch }) {
  const [localDate, setLocalDate] = useState(selectedDate);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(localDate);
    }, 500);

    return () => clearTimeout(timeout);
  }, [localDate]);

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        type="date"
        value={localDate}
        onChange={(e) => setLocalDate(e.target.value)}
        variant="outlined"
        size="small"
        label="Wybierz datę"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
}