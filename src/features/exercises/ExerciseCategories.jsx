import React, { useEffect, useState } from 'react';
import { getExerciseCategory } from '../../api/exerciseAPI';
import { Link } from 'react-router-dom';

export function ExerciseCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getExerciseCategory()
      .then(data => setCategories(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return (
    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#ef4444', fontSize: 14 }}>
      Błąd: {error}
    </div>
  );

  if (categories.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 28, height: 28, border: '2px solid #1e1e22', borderTopColor: '#c8f542', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');

        .ec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          padding: 24px 20px;
          max-width: 960px;
          margin: 0 auto;
        }

        .ec-card {
          background: #16161a;
          border: 1px solid #1e1e22;
          border-radius: 12px;
          padding: 24px 16px;
          text-align: center;
          text-decoration: none;
          color: #f0ede8;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-transform: capitalize;
          transition: border-color 0.15s, background 0.15s, transform 0.1s;
          display: block;
        }

        .ec-card:hover {
          border-color: #c8f542;
          background: #1a1a1f;
          transform: translateY(-2px);
          color: #c8f542;
        }
      `}</style>

      <div className="ec-grid">
        {categories.map(categoryName => (
          <Link
            key={categoryName}
            className="ec-card"
            to={`/exercise/${encodeURIComponent(categoryName)}`}
          >
            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
          </Link>
        ))}
      </div>
    </>
  );
}

export default ExerciseCategories;