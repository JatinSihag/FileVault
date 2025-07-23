import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserProvider';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [showUpload, setShowUpload] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [recent, setRecent] = useState([]);
  const [accountCreated, setAccountCreated] = useState(null);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
        setAccountCreated(res.data.user.createdAt || null);
      } catch (err) {
        setUser(null);
      }
    };
    fetchProfile();

    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/home`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFileCount(res.data.files.length);
        setRecent(res.data.files
          .slice()
          .sort((a, b) => (b._id > a._id ? 1 : -1))
          .slice(0, 5));
      } catch (err) {
        setFileCount(0);
        setRecent([]);
      }
    };
    fetchFiles();
    const timer = setTimeout(() => setShrink(true), 3000);
    return () => clearTimeout(timer);

  }, []);
  useEffect(() => {
  if (!shrink) {
    const timer = setTimeout(() => setShrink(true), 3000);
    return () => clearTimeout(timer);
  }
}, [shrink]);

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/user/profile/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setUser({ ...user, profilePicture: res.data.profilePicture });
      setShowUpload(false); // Hide upload form after success
      setSelectedFileName("No file chosen");
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {user ? (
        <div className="flex flex-row w-full max-w-4xl gap-10 items-start justify-center">
          {/* Left Section: Info, Storage, Activity, Logout */}
          <div className="flex-1 flex flex-col items-start">
            {!showUpload && (
              <div className="w-full max-w-md mb-8 flex flex-col gap-6">
                {/* Account Info */}
                <div className=" rounded-lg p-4 shadow flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-white mb-2">Account Info</h2>
                  <p className='text-gray-200'><strong>Username:</strong> {user.username}</p>
                  <p className='text-gray-200'><strong>Email:</strong> {user.email}</p>
                  {accountCreated && (
                    <p><strong>Joined:</strong> {new Date(accountCreated).toLocaleDateString()}</p>
                  )}
                  <p className="text-gray-200 font-semibold">
                    Files Uploaded: <span className="text-cyan-400">{fileCount}</span>
                  </p>
                </div>
                {/* Storage Usage Bar */}
                <div className="rounded-lg p-4 shadow">
                  <h2 className="text-lg font-semibold mb-2 text-gray-200">Storage Usage</h2>
                  <div className="w-full bg-gray-700 rounded-full h-5 mb-2 flex items-center px-0 relative">
                    <div
                      className={`h-5 rounded-full transition-all duration-500 bg-blue-500`}
                      style={{ width: `${Math.min((fileCount * 5), 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-400">
                    {(fileCount * 5).toFixed(2)} MB of 100 MB used
                  </p>
                </div>
                {/* Recent Activity */}
                <div className=" rounded-lg p-4 shadow">
                  <h2 className="text-lg font-semibold mb-2 text-gray-200">Recent Activity</h2>
                  {recent.length === 0 ? (
                    <p className="text-gray-400">No recent activity.</p>
                  ) : (
                    <ul className="text-gray-300 text-base list-disc pl-5">
                      {recent.map(file => (
                        <li key={file._id} className="mb-1">
                          Uploaded <span className="font-semibold">{file.originalname}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded mt-4"
            >
              Logout
            </button>
          </div>
          {/* Right Section: Profile Image & Photo Upload */}
          <div className="flex flex-col items-center min-w-[320px]">
            <img
              src={user.profilePicture ? `${API_URL}${user.profilePicture}` : '/default-avatar.png'}
              alt="Profile"
              style={{
                width: shrink || showUpload ? 100 : 300,
                height: shrink || showUpload ? 100 : 300,
                borderRadius: '50%',
                transition: 'width 0.3s, height 0.3s'
              }}
              className="mb-4"
            />
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded ${!showUpload ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
                onClick={() => {
                  setShowUpload(false);
                  setShrink(false);
                }}
              >
                View Profile
              </button>
              <button
                className={`px-4 py-2 rounded ${showUpload ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
                onClick={() => setShowUpload(true)}
              >
                Change Profile Photo
              </button>
            </div>
            {showUpload && (
              <form
                onSubmit={handlePhotoUpload}
                className="flex flex-col items-center justify-center w-80 gap-4 bg-gray-900 p-4 rounded-md mt-6"
              >
                <div className="flex items-center gap-4 w-full">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={e =>
                        setSelectedFileName(e.target.files[0] ? e.target.files[0].name : "No file chosen")
                      }
                    />
                    <span className="border border-gray-400 rounded px-2 py-2 bg-gray-800 text-white block text-center">
                      Choose File
                    </span>
                  </label>
                  <span className="border border-gray-400 rounded px-2 py-2 bg-gray-700 text-white flex-1">
                    {selectedFileName}
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 p-2 px-6 rounded-lg text-white font-semibold"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-600 mb-6">Failed to load profile information.</p>
      )}
    </div>
  );
};

export default Profile;