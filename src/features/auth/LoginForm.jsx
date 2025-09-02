import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../API/authAPI'; 
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
  const token = await loginUser(form); 
  alert('Logowanie udane!');
  console.log("Zalogowano, token:", token);
  navigate('/calorie-tracker'); 
} catch (err) {
  const msg = err.response?.data?.message || 'Nieznany błąd';
  setError(msg);
}}

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: 'white',
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Logowanie
      </Typography>

      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={form.EmailOrLogin}
          onChange={(e) => setForm({ ...form, EmailOrLogin: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Hasło"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          fullWidth
          required
        />

        <Button type="submit" variant="contained" fullWidth>
          Zaloguj się
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
