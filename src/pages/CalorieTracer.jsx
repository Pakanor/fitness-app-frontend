import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductItem from '../features/products/ProductItem';
import ProductForm from '../features/products/ProductForm';
import { getRecentLogs, deleteProductLog } from '../API/productAPI';
import { Box, CircularProgress } from '@mui/material';
import TotalsSummary from '../components/TotalsSummary';

const CalorieTracer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [totals, setTotals] = useState(null);



const fetchLogs = async (date = selectedDate) => {
  try {
    const data = await getRecentLogs(date);

    if (data && Array.isArray(data.logs)) {
      setLogs([...data.logs]);
    } else {
      setLogs([]);
    }

    setTotals(data.totals || null);

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
    alert('Usunięto produkt.');
    fetchLogs(selectedDate);
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
      <TotalsSummary totals={totals} />

    </div>
  );
};

export default CalorieTracer;
