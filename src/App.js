import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/RegisterPage'; 
import CalorieTracer from './pages/CalorieTracer';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage';
import ExerciseStartPage from './pages/ExerciseStartPage';
import ExerciseListPage from './pages/ExerciseListPage';
import LoginForm from './pages/LoginPage';
import ProtectedRoute from './pages/ProtectedRoute';





function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
                <Route path="/calorie-tracker" element={ <ProtectedRoute><CalorieTracer /></ProtectedRoute>} />
                  <Route path="/verify" element={<VerifyPage />} />
        <Route path="/exercise-start" element={<ExerciseStartPage />} />
              <Route path="/exercise/:bodyPart" element={<ExerciseListPage />} />





      
      </Routes>
    </Router>
  );
}

export default App;
