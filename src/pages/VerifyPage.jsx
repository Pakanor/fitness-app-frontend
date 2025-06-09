import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import { useNavigate } from 'react-router-dom';

const VerifyPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 10,
        p: 4,
        borderRadius: 3,
        boxShadow: 4,
        textAlign: 'center',
        backgroundColor: 'white',
      }}
    >
      <MarkEmailReadOutlinedIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Dziękujemy za rejestrację!
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Na Twój adres e-mail został wysłany link weryfikacyjny. Kliknij w niego, aby aktywować konto.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Powrót na stronę główną
      </Button>
    </Box>
  );
};

export default VerifyPage;
