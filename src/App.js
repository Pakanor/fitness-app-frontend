import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/RegisterPage'; 
import CalorieTracer from './pages/CalorieTracer';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage';
import ExerciseStartPage from './pages/ExerciseStartPage';





function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
                <Route path="/calorie-tracker" element={<CalorieTracer />} />
                  <Route path="/verify" element={<VerifyPage />} />
        <Route path="/exercise-start" element={<ExerciseStartPage />} />




      
      </Routes>
    </Router>
  );
}

export default App;
