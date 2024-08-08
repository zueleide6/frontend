import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import BBDetailsPage from './pages/bb-details';
import IndexPage from './pages/index';
import Header from './components/Header';
import { AuthProvider } from './lib/AuthContext';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './lib/globals.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0080c0',
    },
    secondary: {
      main: '#1f1f1f',
    },
  },
});

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {!hideHeaderRoutes.includes(location.pathname) && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bb-details/:id" element={<BBDetailsPage />} />
          <Route path="/" element={<IndexPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
