import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../API/authAPI';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await registerUser(form);
      alert('Rejestracja udana: ' + res.message);
      navigate('/verify');
    } catch (err) {
      const msg = err.response?.data?.message || 'Nieznany błąd';
      setError(msg);
    }
  };

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
        Rejestracja
      </Typography>

      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Nazwa użytkownika"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          Zarejestruj się
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterForm;
