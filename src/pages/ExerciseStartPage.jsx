import React, { useState } from 'react';
import Header from '../components/layout/Header';
import WorkoutDashboard from '../features/exercises/Workoutdashboard';
import BodySilhouette from '../features/heatmap/BodySilhouette';

function ExercisePage() {
  const [exerciseRefreshKey, setExerciseRefreshKey] = useState(0);
  const triggerRefresh = () => setExerciseRefreshKey(k => k + 1);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0d0f' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', borderRight: '1px solid #1e1e22' }}>
          <WorkoutDashboard onExerciseChange={triggerRefresh} />
        </div>
        <div style={{ width: 340, flexShrink: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', background: '#0d0d0f' }}>
          <div style={{ padding: '8px 0' }}>
            <BodySilhouette key={exerciseRefreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExercisePage;
