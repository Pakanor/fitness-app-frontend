import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { getRecentLogs, deleteProductLog } from '../API/productAPI';
import { Button, Box } from '@mui/material';

const RegisterPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); // 🔥 kontroluje widoczność formularza

  const fetchLogs = async () => {
    try {
      const data = await getRecentLogs();
      setLogs(data);
    } catch (err) {
      console.error('Błąd pobierania:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProductLog(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
      alert('Usunięto produkt.');
    } catch (err) {
      console.error(err);
      alert('Nie udało się usunąć produktu.');
    }
  };
  

  return (
    <div>
      <Header />

      <Box sx={{ p: 2 }}>
        

        {showAddForm && (
          <ProductForm
            mode="add"
            onSuccess={() => {
              fetchLogs();
              setShowAddForm(false); 
            }}
          />
        )}
      </Box>

      <ProductList logs={logs} onDelete={handleDelete} />
    </div>
  );
};

export default RegisterPage;
