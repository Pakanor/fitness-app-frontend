import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductItem from '../features/products/ProductItem';
import ProductForm from '../features/products/ProductForm';
import { getRecentLogs, deleteProductLog } from '../API/productAPI';
import { Box, CircularProgress } from '@mui/material';

const CalorieTracer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);


  const fetchLogs = async (date = null) => {
  try {
    const data = await getRecentLogs(date); 
    setLogs(Array.isArray(data) ? [...data] : []);
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

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <div>
      <Header />
      <Box sx={{ p: 2 }}>
        {showAddForm ? (
          <ProductForm
            mode="add"
            onSuccess={() => {
              fetchLogs();
              setShowAddForm(false);
            }}
          />
        ) : (
          <>
           
            <ProductItem
              logs={logs}
              onDelete={handleDelete}
              onProductUpdated={fetchLogs}

            />
          </>
        )}
      </Box>
    </div>
  );
};

export default CalorieTracer;
