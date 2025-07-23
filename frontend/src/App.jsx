import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import React, { useContext, useEffect,useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './components/UserProvider';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import Upload from './components/Upload';
import PublicHome from './pages/PublicHome';
import Navbar from './components/Navbar';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

function App() {
  
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${API_BASE}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      }finally{
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setUser]);
  const isAuth = !!user;
  if (loading) {
    return <div>Loading...</div>; // or a spinner component
  }

  return (
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={isAuth ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={isAuth ? <Navigate to="/home" /> : <Register />} />

        {/* Protected routes with Navbar */}
  
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Upload />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Home />
              </>
            </PrivateRoute>
          }
        />
        <Route
  path="/profile"
  element={
    <PrivateRoute>
      <>
        <Navbar />
        <Profile />
      </>
    </PrivateRoute>
  }
/>
      </Routes>
  );
}

export default App;
