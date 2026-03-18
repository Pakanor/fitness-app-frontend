import React from "react";
import { TextField, Box } from "@mui/material";

export default function DateSearch({ selectedDate, onSearch }) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        type="date"
        value={selectedDate}
        onChange={(e) => onSearch(e.target.value)}
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