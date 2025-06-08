import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/RegisterPage'; 
import CalorieTracer from './pages/CalorieTracer';



function App() {
  return (
     <Router>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
                <Route path="/calorie-tracker" element={<CalorieTracer />} />



      
      </Routes>
    </Router>
  );
}

export default App;
