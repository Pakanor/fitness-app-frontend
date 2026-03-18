import { useEffect, useState, useCallback } from 'react';
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

  const fetchLogs = useCallback(async (date) => {
    setLoading(true);
    try {
      const data = await getRecentLogs(date);
      console.log('Backend response structure:', data);
      
      if (Array.isArray(data)) {
        // Backend zwraca tablicę produktów
        setLogs([...data]);
        
        // Obliczamy totals z produktów
        if (data.length > 0) {
          const totals = data.reduce(
            (acc, log) => ({
              energy: acc.energy + (log.energy || 0),
              proteins: acc.proteins + (log.proteins || 0),
              fat: acc.fat + (log.fat || 0),
              sugars: acc.sugars + (log.sugars || 0),
            }),
            { energy: 0, proteins: 0, fat: 0, sugars: 0 }
          );
          setTotals(totals);
        } else {
          setTotals(null);
        }
      } else if (data && Array.isArray(data.logs)) {
        // Fallback: jeśli backend zwraca obiekt z logs
        setLogs([...data.logs]);
        setTotals(data.totals || null);
      } else {
        setLogs([]);
        setTotals(null);
      }
    } catch (err) {
      console.error('Błąd pobierania:', err);
      setLogs([]);
      setTotals(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

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
    <div style={{ paddingBottom: totals ? '120px' : '0' }}>
      <Header />
      <Box sx={{ p: 2 }}>
        {showAddForm ? (
          <ProductForm
            mode="add"
            onSuccess={() => {
              fetchLogs(selectedDate);
              setShowAddForm(false);
            }}
          />
        ) : (
          <>
            <ProductItem
              logs={logs}
              onDelete={handleDelete}
              onProductUpdated={() => fetchLogs(selectedDate)}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </>
        )}
      </Box>
      <TotalsSummary totals={totals} />
    </div>
  );
};

export default CalorieTracer;
