import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

const Dashboard = () => {
  const [fileCount, setFileCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFileCount(res.data.files.length);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          // Token invalid or expired
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchFiles();
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Total files uploaded: {fileCount}</p>

      <nav className="mt-6 flex gap-4">
        <Link to="/upload" className="text-blue-600 hover:underline">Upload Files</Link>
        <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
      </nav>
    </div>
  );
};

export default Dashboard;
