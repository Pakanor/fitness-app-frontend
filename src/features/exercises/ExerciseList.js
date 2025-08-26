import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExercisesByBodyPart } from '../../API/exerciseAPI';
import {
  Grid, Card, CardContent, Typography,
  CircularProgress, Alert, TextField, Container,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';

export function ExerciseList() {
  const { bodyPart } = useParams();
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Do modal:
  const [selectedExercise, setSelectedExercise] = useState(null);

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

      {/* Modal z pustą zawartością */}
      <Dialog
        open={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedExercise?.name || 'Ćwiczenie'}</DialogTitle>
        <DialogContent>
          {/* Tutaj póki co pusto lub placeholder */}
          <Typography variant="body1">
            Szczegóły ćwiczenia pojawią się tutaj.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedExercise(null)}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ExerciseList;
