import React, { useState } from 'react';
import { registerUser } from '../../API/authAPI';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '',email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
  const res = await registerUser(form);
  alert("Rejestracja udana: " + res.message);
} catch (err) {
  console.log("Błąd:", err);

  console.log("response:", err.response);
  console.log("data:", err.response?.data);

  if (err.response?.data?.message) {
    alert("Błąd: " + err.response.data.message);
  } else {
    alert("Nieznany błąd");
  }
}

  };

  return (
    <form onSubmit={handleSubmit}>
        <input
        type="text"
        placeholder="username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Zarejestruj</button>
    </form>
  );
};

export default RegisterForm;
