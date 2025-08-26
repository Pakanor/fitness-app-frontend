import React from 'react';
import { Container, Typography } from '@mui/material';
import ExerciseList from '../features/exercises/ExerciseList';

function ExerciseListPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista ćwiczeń
      </Typography>
      <ExerciseList />
    </Container>
  );
}

export default ExerciseListPage;
