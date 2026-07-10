import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import WorkoutDashboard from '../features/exercises/Workoutdashboard';
import { getAnatomicDashboard } from '../api/exerciseAPI';

function DashboardPanel() {
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

  const muscleImages = {
    chest_main: 'https://i.imgur.com/EqR1L3c.png',
    deltoid_anterior: 'https://i.imgur.com/EqR1L3c.png',
    deltoid_lateral: 'https://i.imgur.com/EqR1L3c.png',
    biceps: 'https://i.imgur.com/EqR1L3c.png',
    forearms: 'https://i.imgur.com/EqR1L3c.png',
    abs: 'https://i.imgur.com/EqR1L3c.png',
    quadriceps: 'https://i.imgur.com/EqR1L3c.png',
    core_stabilizers: 'https://i.imgur.com/EqR1L3c.png',
    lats: 'https://i.imgur.com/EqR1L3c.png',
    lower_back: 'https://i.imgur.com/EqR1L3c.png',
    rhomboids_trapezius: 'https://i.imgur.com/EqR1L3c.png',
    deltoid_posterior: 'https://i.imgur.com/EqR1L3c.png',
    triceps: 'https://i.imgur.com/EqR1L3c.png',
    glutes: 'https://i.imgur.com/EqR1L3c.png',
    hamstrings: 'https://i.imgur.com/EqR1L3c.png',
    calves: 'https://i.imgur.com/EqR1L3c.png',
  };

  if (loading) return <div className="dp-loading">Ładowanie...</div>;

  return (
    <div className="dp-wrap">
      <style>{`
        .dp-wrap { display: flex; flex-direction: column; height: 100%; background: #0d0d0f; }
        .dp-tabs { display: flex; gap: 0; border-bottom: 1px solid #1e1e22; flex-shrink: 0; }
        .dp-tab { padding: 10px 16px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; color: #555; background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s; }
        .dp-tab.active { color: #c8f542; border-bottom-color: #c8f542; }
        .dp-tab:hover { color: #f0ede8; }
        .dp-body { flex: 1; overflow-y: auto; padding: 12px; }
        .dp-loading { display: flex; align-items: center; justify-content: center; height: 100%; color: #555; font-family: 'DM Sans', sans-serif; font-size: 13px; }
        .dp-empty { display: flex; align-items: center; justify-content: center; height: 100%; color: #444; font-family: 'DM Sans', sans-serif; font-size: 13px; text-align: center; padding: 20px; }
        .dp-muscle { display: flex; align-items: center; gap: 10px; background: #16161a; border: 1px solid #1e1e22; border-radius: 8px; padding: 10px 12px; margin-bottom: 6px; }
        .dp-muscle-name { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; color: #f0ede8; min-width: 90px; }
        .dp-bar-wrap { flex: 1; height: 6px; background: #2a2a30; border-radius: 3px; overflow: hidden; }
        .dp-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
        .dp-pct { font-size: 11px; font-weight: 600; min-width: 36px; text-align: right; }
        .dp-stat-row { display: flex; justify-content: space-between; font-size: 11px; color: #666; margin-top: 2px; }
        .dp-warning { background: #2a1a1a; border: 1px solid #5a2a2a; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; font-size: 12px; color: #ff8a80; }
      `}</style>
      <div className="dp-tabs">
        <button className={`dp-tab ${tab === 'fatigue' ? 'active' : ''}`} onClick={() => setTab('fatigue')}>Stan regeneracji</button>
        <button className={`dp-tab ${tab === 'progression' ? 'active' : ''}`} onClick={() => setTab('progression')}>Progresja i balans</button>
      </div>
      <div className="dp-body">
        {!data ? (
          <div className="dp-empty">Dodaj treningi, aby zobaczyć statystyki</div>
        ) : tab === 'fatigue' ? (
          data.muscles && data.muscles.length > 0 ? data.muscles.map((m, i) => (
            <div key={i} className="dp-muscle">
              <div className="dp-muscle-name">{m.namePl}</div>
              <div className="dp-bar-wrap">
                <div className="dp-bar-fill" style={{ width: `${m.fatiguePercentage}%`, background: m.fatiguePercentage > 70 ? '#f44336' : m.fatiguePercentage > 40 ? '#ff9800' : '#4caf50' }} />
              </div>
              <div className="dp-pct" style={{ color: m.fatiguePercentage > 70 ? '#f44336' : m.fatiguePercentage > 40 ? '#ff9800' : '#4caf50' }}>{m.fatiguePercentage}%</div>
            </div>
          )) : <div className="dp-empty">Brak danych zmęczenia</div>
        ) : (
          <div>
            {data.balanceWarning && <div className="dp-warning">{data.balanceWarning}</div>}
            {data.muscles && data.muscles.length > 0 ? data.muscles.map((m, i) => (
              <div key={i} className="dp-musle" style={{ background: '#16161a', border: '1px solid #1e1e22', borderRadius: '8px', padding: '10px 12px', marginBottom: '6px' }}>
                <div className="dp-muscle-name">{m.namePl}</div>
                <div className="dp-stat-row">
                  <span>Bieżący: <strong style={{color:'#f0ede8'}}>{m.currentWeekVolume ?? 0}</strong></span>
                  <span>Poprzedni: <strong style={{color:'#f0ede8'}}>{m.previousWeekVolume ?? 0}</strong></span>
                </div>
                {m.weightProgressDeltaPercentage != null && (
                  <div className="dp-stat-row">
                    <span>Progresja: <strong style={{color: m.weightProgressDeltaPercentage >= 0 ? '#4caf50' : '#f44336'}}>
                      {m.weightProgressDeltaPercentage >= 0 ? '+' : ''}{m.weightProgressDeltaPercentage}%
                    </strong></span>
                  </div>
                )}
              </div>
            )) : <div className="dp-empty">Brak danych do porównania</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function ExercisePage() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0d0f' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', borderRight: '1px solid #1e1e22' }}>
          <WorkoutDashboard />
        </div>
        <div style={{ width: 380, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e22', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: '#f0ede8' }}>
            Mięśnie <span style={{ color: '#c8f542' }}>i regeneracja</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <DashboardPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExercisePage;
