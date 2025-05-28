import React from 'react';
import AddProductForm from './components/AddProductForm';
import ProductList from './components/ProductList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/RegisterPage'; // zakładam, że tu jest twój komponent


function App() {
  return (
     <Router>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        {/* możesz dodać więcej tras, np. */}
        {/* <Route path="/login" element={<LoginForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
