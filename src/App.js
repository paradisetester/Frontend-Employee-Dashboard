// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout'; // Employee Dashboard for authenticated users
import PublicLayout from './components/Frontend/Layout'; // PublicLayout component
import Login from './components/Login';
import PrivateRoute from './utils/PrivateRoute';
import SocketProvider from './services/SocketContext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { SpeedInsights } from "@vercel/speed-insights/react"

import { getToken, isTokenExpired, logout } from './services/authService';

const TokenExpirationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = getToken();
      if (token && isTokenExpired(token)) {
        logout();
        navigate('/login');
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [navigate]);

  return null;
};

const AppRoutes = () => {
  return (
    <SocketProvider>
      <TokenExpirationHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Public routes */}
        <Route path="/frontend/*" element={<PublicLayout />} />

        {/* Private routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        />
      </Routes>
      <SpeedInsights/>
    </SocketProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
