import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [measurementStatus, setMeasurementStatus] = useState(null);

  const refreshMeasurementStatus = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/body-measurements/status", { withCredentials: true });
      setMeasurementStatus(data);
      return data;
    } catch {
      setMeasurementStatus({ isComplete: false });
      return { isComplete: false };
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, measurementStatus, hasMeasurements: !!measurementStatus?.isComplete, refreshMeasurementStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
