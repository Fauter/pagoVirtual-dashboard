import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login'; //
import Dashboard from './components/Dashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const checkAuthentication = async () => {
    if (token) {
      try {
        const response = await axios.get('http://192.168.100.6:5000/api/auth/profile', {
          headers: {
            'x-auth-token': token,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;