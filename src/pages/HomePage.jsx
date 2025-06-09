import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Stack,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StarRateIcon from '@mui/icons-material/StarRate';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsightsIcon from '@mui/icons-material/Insights';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Michał K.',
    quote: 'Świetna aplikacja! W końcu mam porządek w ćwiczeniach.',
  },
  {
    name: 'Kasia Z.',
    quote: 'Prosta, ale mega funkcjonalna. Licznik kalorii to sztos.',
  },
  {
    name: 'Tomek L.',
    quote: 'Zmotywowałem się do regularnych treningów. Polecam każdemu!',
  },
];

const features = [
  {
    icon: <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Historia treningów',
    desc: 'Zapisuj i przeglądaj wszystkie swoje treningi w jednym miejscu.',
  },
  {
    icon: <InsightsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Statystyki i cele',
    desc: 'Śledź swoje postępy i osiągaj wyznaczone cele.',
  },
  {
    icon: <StarRateIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Motywacja i przypomnienia',
    desc: 'Codzienna motywacja i przypomnienia o aktywności.',
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* HERO */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #2196f3, #ffffff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box textAlign="center">
              <FitnessCenterIcon sx={{ fontSize: 70, color: 'white', mb: 2 }} />
              <Typography variant="h2" fontWeight="bold" gutterBottom color="white">
                FitTrack
              </Typography>
              <Typography variant="h6" color="white" mb={4}>
                Aplikacja, która pomoże Ci osiągnąć formę życia.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button variant="contained" size="large" onClick={() => navigate('/register')}>
                  Rozpocznij
                </Button>
                <Button variant="outlined" size="large" onClick={() => navigate('/login')}>
                  Mam już konto
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* OPINIE */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
          Opinie naszych użytkowników
        </Typography>
   <Grid container spacing={4} justifyContent="center" alignItems="stretch">
  {testimonials.map((t, i) => (
    <Grid item xs={12} sm={6} md={4} key={i}>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            height: '100%',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Avatar sx={{ mb: 2 }}>{t.name[0]}</Avatar>
          <Typography>"{t.quote}"</Typography>
          <Typography variant="subtitle2" color="text.secondary" mt={1}>
            – {t.name}
          </Typography>
        </Paper>
      </motion.div>
    </Grid>
  ))}
</Grid>
      </Container>

      {/* ZALETY */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 10 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
            Dlaczego warto wybrać FitTrack?
          </Typography>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box mb={2}>{f.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {f.title}
                    </Typography>
                    <Typography color="text.secondary">{f.desc}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
