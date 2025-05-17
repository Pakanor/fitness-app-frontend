import React, { useEffect, useState } from 'react';
import { getRecentLogs } from '../API/productAPI';

function ProductList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getRecentLogs(); 
        setLogs(data);
      } catch (error) {
        console.error('Błąd pobierania:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div>
      <h2>Ostatnie produkty</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            {log.productName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
