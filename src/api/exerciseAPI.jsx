import axios from "axios";

const API_URL = 'http://localhost:5185/api/ExerciseDb';


export async function getExerciseCategory() {
    const res = await fetch(`${API_URL}/exercise/categories`);
    if (!res.ok) throw new Error('Błąd pobierania kategorii ćwiczeń');
    return await res.json();
}

export async function getExercisesByBodyPart(bodyPart) {
  const res = await fetch(`${API_URL}/exercise/${encodeURIComponent(bodyPart)}`);
  if (!res.ok) throw new Error(`Błąd pobierania ćwiczeń dla: ${bodyPart}`);
  return await res.json();
}
export const addUserExercise = async (exerciseData) => {
  const token = localStorage.getItem("token"); 

  if (!token) throw new Error("Brak tokena w localStorage");

  const response = await axios.post(`${API_URL}/userexercise/add`, exerciseData, {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });

  return response.data;
};
