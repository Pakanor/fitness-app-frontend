import React, { useState, useEffect } from 'react';
import { getHeatmapData } from '../../api/exerciseAPI';

function getColor(pct, weeklyVolume, volumeGoal, hasData) {
  if (!hasData) return '#1e1e22';
  const overreach = volumeGoal > 0 && weeklyVolume >= volumeGoal;
  if (overreach && pct < 31) return '#9b1d1d';
  if (overreach) return '#c2410c';
  if (pct >= 71) return '#22c55e';
  if (pct >= 31) return '#f59e0b';
  return '#ef4444';
}

function getColorLabel(pct, hasData, overreach) {
  if (!hasData) return 'Brak danych';
  if (overreach && pct < 31) return 'Przetrenowane';
  if (overreach) return 'Objętość+ regeneracja';
  if (pct >= 71) return 'Gotowe';
  if (pct >= 31) return 'Regeneracja';
  return 'Zmęczone';
}

const FRONT_MUSCLES = [
  { key: 'deltoid_anterior', label: 'Bark przedni', zone: 'shoulders' },
  { key: 'deltoid_lateral', label: 'Bark boczny', zone: 'shoulders' },
  { key: 'chest_main', label: 'Klatka', zone: 'chest' },
  { key: 'biceps', label: 'Biceps', zone: 'arms' },
  { key: 'forearms', label: 'Przedramiona', zone: 'forearms' },
  { key: 'core_stabilizers', label: 'Stabilizatory', zone: 'core' },
  { key: 'abs', label: 'Brzuch', zone: 'core' },
  { key: 'quadriceps', label: 'Czwórki', zone: 'legs' },
  { key: 'hamstrings', label: 'Dwugłowe (przód)', zone: 'legs_back' },
  { key: 'calves', label: 'Łydki', zone: 'calves' },
];

const BACK_MUSCLES = [
  { key: 'deltoid_posterior', label: 'Bark tylny', zone: 'shoulders' },
  { key: 'rhomboids', label: 'Romby', zone: 'upper_back' },
  { key: 'triceps', label: 'Triceps', zone: 'arms' },
  { key: 'lats', label: 'Plecy szerokie', zone: 'lats' },
  { key: 'lower_back', label: 'Dolne plecy', zone: 'lower_back' },
  { key: 'glutes', label: 'Pośladki', zone: 'glutes' },
  { key: 'hamstrings', label: 'Dwugłowe uda', zone: 'legs_back' },
  { key: 'calves', label: 'Łydki', zone: 'calves' },
];

function MuscleBlock({ muscle, data, onClick, size = 'normal' }) {
  const md = data?.find(d => d.nameKey === muscle.key);
  const pct = md ? md.cooldownPercent : 0;
  const vol = md ? md.weeklyVolumeSets : 0;
  const goal = md ? md.volumeGoalSets : 0;
  const hasData = !!md;
  const overreach = goal > 0 && vol >= goal;
  const color = getColor(pct, vol, goal, hasData);
  const label = getColorLabel(pct, hasData, overreach);

  const w = size === 'wide' ? '100%' : '48%';
  const h = size === 'tall' ? 52 : 40;

  return (
    <div
      onClick={() => md && onClick(md, muscle)}
      style={{
        width: w, height: h, background: color, borderRadius: 8,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: md ? 'pointer' : 'default', transition: 'all 0.2s', position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.borderColor = '#c8f542'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
    >
      <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)', textAlign: 'center', lineHeight: 1.2 }}>
        {muscle.label}
      </span>
      {hasData && (
        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>
          {Math.round(pct)}% · {vol}/{goal}s
        </span>
      )}
    </div>
  );
}

function Popup({ data, muscle, onClose }) {
  if (!data) return null;
  const goal = data.volumeGoalSets || 0;
  const overreach = goal > 0 && data.weeklyVolumeSets >= goal;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
      <div style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        background: '#16161a', border: '1px solid #2a2a30', borderRadius: 12,
        padding: 16, zIndex: 1000, minWidth: 280, maxWidth: 340, color: '#f0ede8',
        fontFamily: "'DM Sans', sans-serif", boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, margin: 0 }}>{data.namePl}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 16 }}>&#x2715;</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#888' }}>Regeneracja</span>
            <span style={{ fontWeight: 600, color: getColor(data.cooldownPercent, data.weeklyVolumeSets, data.volumeGoalSets, true) }}>
              {Math.round(data.cooldownPercent)}%
              {data.cooldownPercent < 100 && data.cooldownRemainingMinutes > 0 && (
                <span style={{ fontSize: 11, marginLeft: 6 }}>
                  ~{Math.round(data.cooldownRemainingMinutes / 60)}h
                </span>
              )}
            </span>
          </div>
          <div style={{ height: 4, background: '#1e1e22', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${data.cooldownPercent}%`, background: getColor(data.cooldownPercent, data.weeklyVolumeSets, data.volumeGoalSets, true), borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
            <span style={{ color: '#888' }}>Objętość tygodnia</span>
            <span style={{ fontWeight: 600 }}>{data.weeklyVolumeSets} / {data.volumeGoalSets} serii</span>
          </div>
          {data.estimatedOneRM != null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#888' }}>Szacowane 1RM</span>
              <span style={{ fontWeight: 600, color: '#c8f542' }}>{data.estimatedOneRM} kg</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function BodySilhouette() {
  const [data, setData] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [popupMuscle, setPopupMuscle] = useState(null);
  const [view, setView] = useState('front');

  useEffect(() => {
    (async () => {
      try {
        const result = await getHeatmapData();
        setData(result);
      } catch (err) {
        console.error('Heatmap load error:', err);
      }
    })();
  }, []);

  const handleClick = (md, muscle) => {
    setPopupData(md);
    setPopupMuscle(muscle);
  };

  const muscles = view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", width: '100%' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        <button onClick={() => setView('front')}
          style={{ flex: 1, padding: '6px 0', background: view === 'front' ? '#c8f542' : '#1e1e22', border: '1px solid #2a2a30', borderRadius: 6, color: view === 'front' ? '#0d0d0f' : '#888', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
          PRZÓD
        </button>
        <button onClick={() => setView('back')}
          style={{ flex: 1, padding: '6px 0', background: view === 'back' ? '#c8f542' : '#1e1e22', border: '1px solid #2a2a30', borderRadius: 6, color: view === 'back' ? '#0d0d0f' : '#888', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
          TYŁ
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Shoulders row */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <MuscleBlock muscle={muscles.find(m => m.key.includes('deltoid'))} data={data} onClick={handleClick} />
        </div>

        {/* Torso row */}
        <div style={{ display: 'flex', gap: 6 }}>
          {view === 'front' ? (
            <>
              <MuscleBlock muscle={muscles.find(m => m.key === 'chest_main')} data={data} onClick={handleClick} size="wide" />
            </>
          ) : (
            <>
              <MuscleBlock muscle={muscles.find(m => m.key === 'rhomboids')} data={data} onClick={handleClick} />
              <MuscleBlock muscle={muscles.find(m => m.key === 'lats')} data={data} onClick={handleClick} />
            </>
          )}
        </div>

        {/* Arms + core row */}
        <div style={{ display: 'flex', gap: 6 }}>
          <MuscleBlock muscle={muscles.find(m => m.key === 'biceps' || m.key === 'triceps')} data={data} onClick={handleClick} />
          <MuscleBlock muscle={muscles.find(m => m.key === 'abs' || m.key === 'lower_back')} data={data} onClick={handleClick} size="wide" />
          <MuscleBlock muscle={muscles.find(m => m.key === 'forearms' || m.key === 'core_stabilizers')} data={data} onClick={handleClick} />
        </div>

        {/* Legs row */}
        <div style={{ display: 'flex', gap: 6 }}>
          <MuscleBlock muscle={muscles.find(m => m.key === 'quadriceps' || m.key === 'glutes')} data={data} onClick={handleClick} />
          <MuscleBlock muscle={muscles.find(m => m.key === 'hamstrings')} data={data} onClick={handleClick} />
          <MuscleBlock muscle={muscles.find(m => m.key === 'calves')} data={data} onClick={handleClick} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10, fontSize: 9, color: '#666', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Gotowe</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /> Regeneracja</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> Zmęczone</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#9b1d1d', display: 'inline-block' }} /> Przetrenowane</span>
      </div>

      {popupData && <Popup data={popupData} muscle={popupMuscle} onClose={() => { setPopupData(null); setPopupMuscle(null); }} />}
    </div>
  );
}
