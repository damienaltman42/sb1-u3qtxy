import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CreatorDashboard from './pages/CreatorDashboard';
import UserDashboard from './pages/UserDashboard';
import RouletteGame from './pages/RouletteGame';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/roulette/:id" element={<RouletteGame />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;