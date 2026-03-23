import React from 'react';
import Header from '../components/layout/Header';
import WorkoutDashboard from '../features/exercises/Workoutdashboard';

function ExercisePage() {
  return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d0d0f' }}>
      <Header />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <WorkoutDashboard />
      </div>
    </div>
  );
}

export default ExercisePage;