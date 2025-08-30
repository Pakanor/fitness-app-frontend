import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // jeśli nie ma tokena → przekieruj na logowanie
    return <Navigate to="/login" replace />;
  }

  return children; // jeśli token jest → wyświetl stronę
};

export default ProtectedRoute;