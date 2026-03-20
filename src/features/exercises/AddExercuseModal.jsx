import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import { addUserExercise } from "../../api/exerciseAPI";

export default function AddExerciseModal({ open, onClose, exercise }) {
  const { user } = useAuth(); 
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user?.id) {
      alert("Brak UserId w tokenie!");
      return;
    }

    const payload = {
      userId: user.id,
      exerciseId: exercise.id,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight),
      date: date,
    };

    try {
        addUserExercise(payload);
      
      
      alert("Ćwiczenie dodane!");
      onClose(); 
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania ćwiczenia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dodaj ćwiczenie: {exercise?.name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Serie"
          type="number"
          fullWidth
          margin="normal"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
        <TextField
          label="Powtórzenia"
          type="number"
          fullWidth
          margin="normal"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <TextField
          label="Waga (kg)"
          type="number"
          fullWidth
          margin="normal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <TextField
          label="Data"
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Anuluj</Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained">
          {loading ? "Dodawanie..." : "Dodaj"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}