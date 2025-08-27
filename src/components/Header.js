import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Slide, useScrollTrigger } from '@mui/material';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false); 
  const [accountAnchorEl, setAccountAnchorEl] = useState(null); 

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  const isAccountMenuOpen = Boolean(accountAnchorEl);

  return (
    <HideOnScroll>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ cursor: 'pointer' }}>
            FitnessApp
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Button color="inherit" href="/">Strona główna</Button>
            <Button color="inherit" href="/exercises">Ćwiczenia</Button>
            <Button color="inherit" href="/calorie-tracker">Licznik kalorii</Button>

            <Button
              color="inherit"
              onClick={handleAccountClick}
              endIcon={<span style={{fontSize: '0.7em'}}>▼</span>}
            >
              Konto
            </Button>

            <Menu
              anchorEl={accountAnchorEl}
              open={isAccountMenuOpen}
              onClose={handleAccountClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() => {
                  handleAccountClose();
                  window.location.href = '/profile';
                }}
              >
                Profil
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleAccountClose();
                  alert('Wylogowano');
                  localStorage.removeItem("token");
                  window.location.href = '/login';

                }}
              >
                Wyloguj się
              </MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <button
              onClick={toggleMenu}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
                fontSize: 24,
                color: 'white',
                userSelect: 'none',
              }}
              aria-label="Toggle menu"
            >
              <div
                style={{
                  width: 25,
                  height: 3,
                  backgroundColor: 'white',
                  margin: '5px 0',
                  transition: '0.4s',
                  transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                }}
              />
              <div
                style={{
                  width: 25,
                  height: 3,
                  backgroundColor: 'white',
                  margin: '5px 0',
                  opacity: menuOpen ? 0 : 1,
                  transition: '0.4s',
                }}
              />
              <div
                style={{
                  width: 25,
                  height: 3,
                  backgroundColor: 'white',
                  margin: '5px 0',
                  transition: '0.4s',
                  transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                }}
              />
            </button>
          </Box>
        </Toolbar>

        {menuOpen && (
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              flexDirection: 'column',
              backgroundColor: '#1976d2',
              padding: 2,
            }}
          >
            <Button color="inherit" href="/" onClick={() => setMenuOpen(false)}>Strona główna</Button>
            <Button color="inherit" href="/exercises" onClick={() => setMenuOpen(false)}>Ćwiczenia</Button>
            <Button color="inherit" href="/calorie-tracker" onClick={() => setMenuOpen(false)}>Licznik kalorii</Button>

            <Button
              color="inherit"
              onClick={() => {
                setMenuOpen(false);
                window.location.href = '/profile';
              }}
              sx={{ textAlign: 'left' }}
            >
              Profil
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                setMenuOpen(false);
                alert('Wylogowano');
              }}
              sx={{ textAlign: 'left' }}
            >
              Wyloguj się
            </Button>
          </Box>
        )}
      </AppBar>
    </HideOnScroll>
  );
}

export default Header;
