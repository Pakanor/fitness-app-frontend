import React from 'react';
import ProductList from './components/ProductList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/RegisterPage'; 
import ProductPage from './pages/ProductPage';
import CalorieTracer from './pages/CalorieTracer';



function App() {
  return (
     <Router>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/add" element={<ProductPage />} />
                <Route path="/calorie-tracker" element={<CalorieTracer />} />



      
      </Routes>
    </Router>
  );
}

export default App;
