import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductList from '../components/ProductList';
import { getRecentLogs, deleteProductLog } from '../API/productAPI';

const RegisterPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getRecentLogs();
        setLogs(data);
      } catch (err) {
        console.error('Błąd pobierania:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProductLog(id);
      setLogs(prev => prev.filter(log => log.id !== id));
      alert('Usunięto produkt.');
    } catch (err) {
      console.error(err);
      alert('Nie udało się usunąć produktu.');
    }
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div>
      <Header />
      <ProductList logs={logs} onDelete={handleDelete} />
    </div>
  );
};

export default RegisterPage;
