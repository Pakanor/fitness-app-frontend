const API_URL = 'http://localhost:5000/api/ExerciseDb/exercise';


export async function getExerciseCategory() {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Błąd pobierania kategorii ćwiczeń');
    return await res.json();
}
