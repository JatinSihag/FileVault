// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'; 
import { useState,useContext,useRef } from 'react';
import {UserContext} from './UserProvider'; // Adjust the import path as necessary
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
const Navbar = () => {
  const navigate = useNavigate();
  const {user,setUser} = useContext(UserContext);
  const [showModal,setShowModal] = useState(false);
  const fileInputRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null)
    navigate('/login');
  };
  const handlePhotoUpload = async(e)=>{
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    const token = localStorage.getItem('token');
    const res = await axios.post(`${API_URL}/user/profile/photo`, formData, {
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    setUser({...user,profilePicture:res.data.profilePicture});
  };

  return (
    <nav className="text-white flex justify-between items-center shadow-sm shadow-white/20 pr-5">
      <img src={logo} alt="FileVault" className='w-20' />
      <div className="flex gap-4">
        <Link to="/home" className="hover:underline text-2xl">Home</Link>
        <Link to="/upload" className="hover:underline text-2xl ">Upload</Link>
       
      {user && (
  <img
    src={
      user.profilePicture && user.profilePicture !== '/default-avatar.png'
        ? user.profilePicture.startsWith('http')
          ? user.profilePicture
          : `${API_URL}${user.profilePicture}`
        : '/default-avatar.png'
    }
    alt="Profile"
    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
    onClick={() => navigate('/profile')}
  />
)}
        <button onClick={handleLogout} className="bg-red-700 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
