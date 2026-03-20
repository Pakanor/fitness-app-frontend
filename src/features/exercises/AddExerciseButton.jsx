import React, { useState } from "react";
import AddExerciseModal from "./AddExerciseModal";
import { Button } from "@mui/material";

export default function AddExerciseButton({ exercise }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Dodaj ćwiczenie
      </Button>
      {open && (
        <AddExerciseModal
          exercise={exercise}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}