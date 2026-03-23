import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { useAuth } from "../../hooks/AuthContext";
import { addUserExercise, getExerciseCategory, getExercisesByBodyPart } from "../../api/exerciseAPI";

const STEPS = ["category", "exercise", "details"];

export default function AddExerciseModal({ open, onClose, onAdded }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  // Step 0 — category
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Step 1 — exercise
  const [exercises, setExercises] = useState([]);
  const [exLoading, setExLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [search, setSearch] = useState("");

  // Step 2 — details
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setSelectedCategory(null);
      setSelectedExercise(null);
      setSearch("");
      setSets(""); setReps(""); setWeight("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [open]);

  // Load categories on open
  useEffect(() => {
    if (!open) return;
    setCatLoading(true);
    getExerciseCategory()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setCatLoading(false));
  }, [open]);

  // Load exercises when category selected
  useEffect(() => {
    if (!selectedCategory) return;
    setExLoading(true);
    setExercises([]);
    getExercisesByBodyPart(selectedCategory)
      .then(setExercises)
      .catch(console.error)
      .finally(() => setExLoading(false));
  }, [selectedCategory]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setStep(1);
  };

  const handleSelectExercise = (ex) => {
    setSelectedExercise(ex);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 1) { setStep(0); setSelectedExercise(null); setSearch(""); }
    if (step === 2) { setStep(1); }
  };

  const handleSubmit = async () => {
    if (!user?.id) { alert("Brak UserId w tokenie!"); return; }
    setLoading(true);
    try {
      await addUserExercise({
        userId: user.id,
        exerciseId: selectedExercise.id,
        sets: sets ? parseInt(sets) : null,
        reps: reps ? parseInt(reps) : null,
        weight: weight ? parseFloat(weight) : null,
        date,
      });
      onAdded?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania ćwiczenia.");
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const stepLabel = ["Wybierz kategorię", "Wybierz ćwiczenie", `Dodaj: ${selectedExercise?.name ?? ""}`];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, bgcolor: "#16161a", color: "#f0ede8", minHeight: 420 } }}
    >
      {/* Header */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1, borderBottom: "1px solid #1e1e22" }}>
        {step > 0 && (
          <IconButton onClick={handleBack} size="small" sx={{ color: "#888", mr: 0.5 }}>
            ←
          </IconButton>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, mb: 0.2 }}>
            Krok {step + 1} / 3
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#f0ede8" }}>
            {stepLabel[step]}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#555" }}>✕</IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: 2.5 }}>

        {/* STEP 0 — Categories */}
        {step === 0 && (
          catLoading
            ? <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: "#c8f542" }} /></Box>
            : <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    variant="outlined"
                    sx={{
                      borderColor: "#2a2a30",
                      color: "#ccc",
                      borderRadius: 2,
                      textTransform: "capitalize",
                      fontSize: 13,
                      "&:hover": { borderColor: "#c8f542", color: "#c8f542", bgcolor: "rgba(200,245,66,0.06)" }
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </Box>
        )}

        {/* STEP 1 — Exercises */}
        {step === 1 && (
          <Box>
            <TextField
              placeholder="Szukaj ćwiczenia..."
              fullWidth
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{
                mb: 1.5,
                "& .MuiOutlinedInput-root": {
                  color: "#f0ede8",
                  "& fieldset": { borderColor: "#2a2a30" },
                  "&:hover fieldset": { borderColor: "#444" },
                  "&.Mui-focused fieldset": { borderColor: "#c8f542" },
                },
                "& input::placeholder": { color: "#555" }
              }}
            />
            {exLoading
              ? <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: "#c8f542" }} /></Box>
              : <Box sx={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {filteredExercises.length === 0
                    ? <Typography sx={{ color: "#444", py: 3, textAlign: "center", fontSize: 14 }}>Brak wyników</Typography>
                    : filteredExercises.map(ex => (
                        <Box
                          key={ex.id}
                          onClick={() => handleSelectExercise(ex)}
                          sx={{
                            display: "flex", alignItems: "center", gap: 1.5,
                            p: 1.2, borderRadius: 2, cursor: "pointer",
                            border: "1px solid #1e1e22",
                            "&:hover": { bgcolor: "#1e1e22", borderColor: "#2a2a30" }
                          }}
                        >
                          {ex.gifUrl && (
                            <Box component="img" src={ex.gifUrl} alt={ex.name}
                              sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: "cover", bgcolor: "#1e1e22" }}
                            />
                          )}
                          <Typography sx={{ fontSize: 14, color: "#e0ddd8", textTransform: "capitalize" }}>
                            {ex.name}
                          </Typography>
                        </Box>
                      ))
                  }
                </Box>
            }
          </Box>
        )}

        {/* STEP 2 — Details */}
        {step === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {selectedExercise?.gifUrl && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box component="img" src={selectedExercise.gifUrl} alt={selectedExercise.name}
                  sx={{ width: 80, height: 80, borderRadius: 2, objectFit: "cover" }}
                />
              </Box>
            )}
            {[
              { label: "Serie", value: sets, set: setSets },
              { label: "Powtórzenia", value: reps, set: setReps },
              { label: "Waga (kg)", value: weight, set: setWeight },
            ].map(({ label, value, set }) => (
              <TextField
                key={label}
                label={label}
                type="number"
                fullWidth
                margin="dense"
                value={value}
                onChange={e => set(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#f0ede8",
                    "& fieldset": { borderColor: "#2a2a30" },
                    "&:hover fieldset": { borderColor: "#444" },
                    "&.Mui-focused fieldset": { borderColor: "#c8f542" },
                  },
                  "& .MuiInputLabel-root": { color: "#666" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#c8f542" },
                }}
              />
            ))}
            <TextField
              label="Data"
              type="date"
              fullWidth
              margin="dense"
              value={date}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#f0ede8",
                  "& fieldset": { borderColor: "#2a2a30" },
                  "&:hover fieldset": { borderColor: "#444" },
                  "&.Mui-focused fieldset": { borderColor: "#c8f542" },
                },
                "& .MuiInputLabel-root": { color: "#666" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#c8f542" },
              }}
            />
          </Box>
        )}
      </DialogContent>

      {step === 2 && (
        <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
          <Button onClick={onClose} disabled={loading}
            sx={{ color: "#666", "&:hover": { color: "#aaa" } }}>
            Anuluj
          </Button>
          <Button onClick={handleSubmit} disabled={loading} variant="contained"
            sx={{ bgcolor: "#c8f542", color: "#0d0d0f", fontWeight: 700,
              "&:hover": { bgcolor: "#d4f55a" }, "&:disabled": { bgcolor: "#333", color: "#555" } }}>
            {loading ? "Dodawanie..." : "Dodaj ćwiczenie"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}