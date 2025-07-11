import React, { useEffect, useState } from 'react';
import { getExerciseCategory } from '../../API/exerciseAPI'; 
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';

export function ExerciseCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getExerciseCategory()
      .then(data => setCategories(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <Alert severity="error">Błąd: {error}</Alert>;
  if (categories.length === 0) return <CircularProgress />;

  return (
    <Grid container spacing={3} padding={3}>
      {categories.map(categoryName => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={categoryName}>
          <Card>
            <CardActionArea component={Link} to={`/exercise/${encodeURIComponent(categoryName)}`}>
              <CardContent>
                <Typography variant="h6" align="center">
                  {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ExerciseCategories;
