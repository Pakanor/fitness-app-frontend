import React, { useState } from "react";
import AddExerciseModal from "./AddExerciseModal";

export default function AddExerciseButton({ exercise }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px',
          background: '#c8f542',
          color: '#0d0d0f',
          border: 'none',
          borderRadius: 10,
          fontFamily: 'Syne, sans-serif',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        Dodaj ćwiczenie
      </button>
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