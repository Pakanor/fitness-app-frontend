import { useEffect, useState, useCallback } from 'react';
import ProductItem from '../features/products/ProductItem';
import ProductForm from '../features/products/ProductForm';
import { getRecentLogs, deleteProductLog } from '../api/productAPI';
import TotalsSummary from '../components/TotalsSummary';
import { toast } from '../components/common/Toast';
import Header from '../components/layout/Header';

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
      if (Array.isArray(data)) {
        setLogs([...data]);
        if (data.length > 0) {
          const t = data.reduce(
            (acc, log) => ({
              energy: acc.energy + (log.energy || 0),
              proteins: acc.proteins + (log.proteins || 0),
              fat: acc.fat + (log.fat || 0),
              sugars: acc.sugars + (log.sugars || 0),
            }),
            { energy: 0, proteins: 0, fat: 0, sugars: 0 }
          );
          setTotals(t);
        } else {
          setTotals(null);
        }
      } else if (data && Array.isArray(data.logs)) {
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
  }, [selectedDate]);

  const handleDelete = async (id) => {
    try {
      await deleteProductLog(id);
      toast('Usunięto produkt.');
      fetchLogs(selectedDate);
    } catch (err) {
      console.error(err);
      toast('Nie udało się usunąć produktu.');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0d0d0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #1e1e22', borderTopColor: '#c8f542', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

return (
    <div style={{ height: '94vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d0d0f' }}>
      <Header />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {showAddForm ? (
          <ProductForm
            mode="add"
            onSuccess={() => { fetchLogs(selectedDate); setShowAddForm(false); }}
          />
        ) : (
          <ProductItem
            logs={logs}
            onDelete={handleDelete}
            onProductUpdated={() => fetchLogs(selectedDate)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </div>
      <TotalsSummary totals={totals} />
    </div>
  );
 
};

export default CalorieTracer;