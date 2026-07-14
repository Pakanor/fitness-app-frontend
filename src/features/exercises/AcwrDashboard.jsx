import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const API = 'http://localhost:8000/api/ExerciseDb';

export default function AcwrDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deloadPlan, setDeloadPlan] = useState(null);
  const [deloadLoading, setDeloadLoading] = useState(false);
  const [deloadApplied, setDeloadApplied] = useState(false);

  const fetchAcwr = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/acwr`, { credentials: 'include' });
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAcwr(); }, []);

  const handleDeloadPreview = async () => {
    setDeloadLoading(true);
    try {
      const res = await fetch(`${API}/deload/preview`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) setDeloadPlan(await res.json());
    } catch {}
    setDeloadLoading(false);
  };

  const handleDeloadApply = async () => {
    if (!deloadPlan?.entries) return;
    setDeloadLoading(true);
    try {
      const res = await fetch(`${API}/deload/apply`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deloadPlan.entries),
      });
      if (res.ok) {
        setDeloadApplied(true);
        setDeloadPlan(null);
        fetchAcwr();
      }
    } catch {}
    setDeloadLoading(false);
  };

  const ratioColor = !data ? '#666' : data.ratio < 0.8 ? '#60a5fa' : data.ratio <= 1.3 ? '#c8f542' : data.ratio <= 1.5 ? '#f59e0b' : '#ef4444';

  const chartData = data?.dailyWorkload?.map(d => ({
    date: new Date(d.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }),
    load: Math.round(d.workload),
  })) || [];

  if (loading) return <div style={{ padding: 20, color: '#444', fontSize: 13 }}>Ładowanie ACWR...</div>;
  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#16161a', border: '1px solid #1e1e22', borderRadius: 14, padding: 20 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
          ACWR — Obciążenie treningowe
        </div>

        {data.insufficientData ? (
          <div style={{ color: '#666', fontSize: 13, textAlign: 'center', padding: 16 }}>
            Zaloguj co najmniej 7 dni treningowych, aby zobaczyć wskaźnik ACWR.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
              <div style={{ flex: 1, background: '#0d0d0f', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>ACWR</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: ratioColor }}>
                  {data.ratio.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: ratioColor, marginTop: 4 }}>{data.status}</div>
              </div>
              <div style={{ flex: 1, background: '#0d0d0f', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Obciążenie ostre (7 dni)</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#f0ede8' }}>
                  {Math.round(data.acuteLoad)}
                </div>
              </div>
              <div style={{ flex: 1, background: '#0d0d0f', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Obciążenie przewlekłe (28 dni)</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#f0ede8' }}>
                  {Math.round(data.chronicLoad)}
                </div>
              </div>
            </div>

            {chartData.length > 0 && (
              <div style={{ height: 180, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#1e1e22', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#888' }}
                      formatter={(v) => [`${v}`, 'Obciążenie']}
                    />
                    <ReferenceLine y={data.chronicLoad} stroke="#555" strokeDasharray="4 4" label={{ value: ' chronic', fontSize: 9, fill: '#555' }} />
                    <Bar dataKey="load" fill={ratioColor} radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>

      {data.alert && (
        <div style={{
          background: data.ratio > 1.5 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${data.ratio > 1.5 ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ fontSize: 13, color: data.ratio > 1.5 ? '#f87171' : '#fbbf24', marginBottom: 8 }}>
            ⚠️ {data.alert}
          </div>
          {data.ratio > 1.5 && !deloadApplied && (
            <button
              onClick={handleDeloadPreview}
              disabled={deloadLoading}
              style={{
                padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none',
                borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {deloadLoading ? 'Przygotowywanie...' : 'Zastosuj Deload'}
            </button>
          )}
          {deloadApplied && (
            <div style={{ fontSize: 12, color: '#c8f542' }}>Deload zastosowany! Sprawdź jutrzejszy trening.</div>
          )}
        </div>
      )}

      {deloadPlan && deloadPlan.entries?.length > 0 && (
        <div style={{ background: '#16161a', border: '1px solid #ef4444', borderRadius: 12, padding: 16 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>
            Plan Deload — {deloadPlan.entries.length} ćwiczeń
          </div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{deloadPlan.message}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, maxHeight: 200, overflow: 'auto' }}>
            {deloadPlan.entries.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, fontSize: 12, color: '#f0ede8', padding: '6px 8px', background: '#0d0d0f', borderRadius: 6 }}>
                <span style={{ color: '#888', minWidth: 24 }}>#{i + 1}</span>
                <span>Ćwiczenie #{e.exerciseId}</span>
                <span style={{ color: '#c8f542' }}>{e.sets}×{e.reps}</span>
                <span>{e.weight}kg</span>
                <span style={{ color: '#a855f7' }}>RPE {e.rpe}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDeloadApply} disabled={deloadLoading}
              style={{ padding: '8px 16px', background: '#c8f542', color: '#0d0d0f', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
              {deloadLoading ? 'Zapisywanie...' : 'Potwierdź i zapisz'}
            </button>
            <button onClick={() => setDeloadPlan(null)}
              style={{ padding: '8px 16px', background: '#1e1e22', color: '#888', border: '1px solid #333', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
