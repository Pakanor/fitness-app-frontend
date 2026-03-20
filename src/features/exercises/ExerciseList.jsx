import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExercisesByBodyPart } from '../../api/exerciseAPI';
import {
  Grid, Card, CardContent, Typography,
  CircularProgress, Alert, TextField, Container,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import AddExerciseModal from './AddExercuseModal';

export function ExerciseList() {
  const { bodyPart } = useParams();
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    getExercisesByBodyPart(bodyPart)
      .then(data => setExercises(data))
      .catch(err => setError(err.message));
  }, [bodyPart]);

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <Alert severity="error">Błąd: {error}</Alert>;
  if (exercises.length === 0) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Ćwiczenia na: {bodyPart}
      </Typography>

      <TextField
        label="Szukaj ćwiczenia"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Grid container spacing={3}>
        {filteredExercises.map(ex => (
          <Grid item xs={12} sm={6} md={4} key={ex.id}>
            <Card
              onClick={() => setSelectedExercise(ex)}
              sx={{ cursor: 'pointer' }}
            >
              <CardContent>
                <Typography variant="h6">{ex.name}</Typography>
                <Typography variant="body2" color="textSecondary" noWrap>
                  {ex.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedExercise?.name || "Ćwiczenie"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedExercise?.description || "Brak opisu"}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setOpenAddModal(true)}
          >
            Dodaj ćwiczenie
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedExercise(null)}>Zamknij</Button>
        </DialogActions>
      </Dialog>

      {selectedExercise && (
        <AddExerciseModal
          exercise={selectedExercise}
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </Container>
  );
}

export default ExerciseList;