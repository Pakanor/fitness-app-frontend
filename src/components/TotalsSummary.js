import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function TotalsSummary({ totals }) {
  if (!totals) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',          
        bottom: 0,
        left: 0,
        width: '100%',            
        p: 2,
        borderTop: '5px solid #1976d2',
        backgroundColor: '#e3f2fd',
        zIndex: 1000,             
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Typography><strong>Kalorie:</strong> {parseFloat(totals.energy).toFixed(2)} kcal</Typography>
        <Typography><strong>Białko:</strong> {parseFloat(totals.proteins).toFixed(2)} g</Typography>
        <Typography><strong>Tłuszcz:</strong> {parseFloat(totals.fat).toFixed(2)} g</Typography>
        <Typography><strong>Węglowodany:</strong> {parseFloat(totals.sugars).toFixed(2)} g</Typography>
      </Box>
    </Paper>
  );
}

export default TotalsSummary;
