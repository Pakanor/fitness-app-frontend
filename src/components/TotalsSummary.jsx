import React from 'react';

function TotalsSummary({ totals }) {
  if (!totals) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ts-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #16161a;
          border-top: 1px solid #1e1e22;
          z-index: 1000;
          padding: 14px 24px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 12px;
        }

        .ts-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .ts-value {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #c8f542;
          line-height: 1;
        }

        .ts-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="ts-bar">
        <div className="ts-item">
          <span className="ts-value">{parseFloat(totals.energy).toFixed(0)} kcal</span>
          <span className="ts-label">Kalorie</span>
        </div>
        <div className="ts-item">
          <span className="ts-value">{parseFloat(totals.proteins).toFixed(1)} g</span>
          <span className="ts-label">Białko</span>
        </div>
        <div className="ts-item">
          <span className="ts-value">{parseFloat(totals.fat).toFixed(1)} g</span>
          <span className="ts-label">Tłuszcz</span>
        </div>
        <div className="ts-item">
          <span className="ts-value">{parseFloat(totals.sugars).toFixed(1)} g</span>
          <span className="ts-label">Węglowodany</span>
        </div>
      </div>
    </>
  );
}

export default TotalsSummary;