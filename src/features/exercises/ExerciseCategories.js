import React, { useEffect, useState } from 'react';
import { getExerciseCategory } from '../../API/exerciseAPI'; 

export function ExerciseCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getExerciseCategory()
      .then(data => setCategories(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Błąd: {error}</div>;
  if (categories.length === 0) return <div>Ładowanie kategorii...</div>;

  return (
    <ul>
      {categories.map(categoryName => (
        <li key={categoryName}>{categoryName}</li>
      ))}
    </ul>
  );
}
export default ExerciseCategories;