import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { getAnatomicDashboard } from '../api/exerciseAPI';

function DashboardPage() {
  const [tab, setTab] = useState('fatigue');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getAnatomicDashboard();
        setData(result);
      } catch { }
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0d0f', color: '#f0ede8', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .dash-tabs { display: flex; gap: 0; border-bottom: 1px solid #1e1e22; padding: 0 16px; }
        .dash-tab { padding: 12px 20px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: #555; background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s; }
        .dash-tab.active { color: #c8f542; border-bottom-color: #c8f542; }
        .dash-tab:hover { color: #f0ede8; }
        .dash-content { flex: 1; overflow-y: auto; padding: 20px; }
        .muscle-card { background: #16161a; border: 1px solid #1e1e22; border-radius: 10px; padding: 16px; margin-bottom: 10px; }
        .muscle-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }
        .fatigue-bar { height: 8px; background: #2a2a30; border-radius: 4px; margin: 8px 0; overflow: hidden; }
        .fatigue-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
        .stat-row { display: flex; justify-content: space-between; font-size: 13px; color: #888; margin-top: 4px; }
        .stat-value { color: #f0ede8; font-weight: 500; }
        .progress-up { color: #4caf50; }
        .progress-down { color: #f44336; }
        .warning-box { background: #2a1a1a; border: 1px solid #5a2a2a; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; color: #ff8a80; }
        .loading { display: flex; align-items: center; justify-content: center; height: 100%; color: #555; }
      `}</style>
      <Header />
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e22' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>Panel <span style={{ color: '#c8f542' }}>Analityczny</span></div>
      </div>
      <div className="dash-tabs">
        <button className={`dash-tab ${tab === 'fatigue' ? 'active' : ''}`} onClick={() => setTab('fatigue')}>Stan Regeneracji</button>
        <button className={`dash-tab ${tab === 'progression' ? 'active' : ''}`} onClick={() => setTab('progression')}>Progresja i Balans</button>
      </div>
      <div className="dash-content">
        {loading ? (
          <div className="loading">Ładowanie...</div>
        ) : !data ? (
          <div className="loading">Brak danych. Dodaj treningi, aby zobaczyć statystyki.</div>
        ) : tab === 'fatigue' ? (
          <div>
            {data.muscles && data.muscles.length > 0 ? data.muscles.map((m, i) => (
              <div key={i} className="muscle-card">
                <div className="muscle-name">{m.namePl}</div>
                <div className="fatigue-bar">
                  <div className="fatigue-fill" style={{ width: `${m.fatiguePercentage}%`, background: m.fatiguePercentage > 70 ? '#f44336' : m.fatiguePercentage > 40 ? '#ff9800' : '#4caf50' }} />
                </div>
                <div className="stat-row">
                  <span>Zmęczenie: <span className="stat-value">{m.fatiguePercentage}%</span></span>
                  <span>Objętość: <span className="stat-value">{m.volume} serii</span></span>
                </div>
              </div>
            )) : <div className="loading">Brak danych zmęczenia</div>}
          </div>
        ) : (
          <div>
            {data.balanceWarning && (
              <div className="warning-box">{data.balanceWarning}</div>
            )}
            {data.muscles && data.muscles.length > 0 ? data.muscles.map((m, i) => (
              <div key={i} className="muscle-card">
                <div className="muscle-name">{m.namePl}</div>
                <div className="stat-row">
                  <span>Objętość (bieżący tydz.): <span className="stat-value">{m.currentWeekVolume ?? 0} serii</span></span>
                  <span>Objętość (poprz. tydz.): <span className="stat-value">{m.previousWeekVolume ?? 0} serii</span></span>
                </div>
                {m.weightProgressDeltaPercentage != null && (
                  <div className="stat-row">
                    <span>Progresja ciężaru: <span className={`stat-value ${m.weightProgressDeltaPercentage >= 0 ? 'progress-up' : 'progress-down'}`}>
                      {m.weightProgressDeltaPercentage >= 0 ? '+' : ''}{m.weightProgressDeltaPercentage}%
                    </span></span>
                  </div>
                )}
              </div>
            )) : <div className="loading">Brak danych do porównania</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
