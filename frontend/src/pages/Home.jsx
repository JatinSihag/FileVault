import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState({});
  const [deleting, setDeleting] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API_URL}/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data.files || []);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };
    fetchFiles();
  }, [API_URL]);

  useEffect(() => {
    const fetchUrls = async () => {
      const token = localStorage.getItem('token');
      const urls = {};

      for (const file of files) {
        try {
          const res = await axios.get(`${API_URL}/download/${file.path}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          urls[file.path] = res.data.url;
        } catch (err) {
          console.error(`Error getting URL for ${file.path}:`, err);
          urls[file.path] = null;
        }
      }
      setFileUrls(urls);
    };

    if (files.length > 0) fetchUrls();
  }, [files, API_URL]);

  const handleDelete = async (filePath) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    setDeleting(filePath);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/delete/${filePath}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((f) => f.path !== filePath));
    } catch (err) {
      alert('Failed to delete file.');
    }
    setDeleting(null);
  };

  return (
    <main className="p-5 min-h-screen w-full">
      <div className="files mt-5 flex flex-row flex-wrap gap-6 justify-center">
        {files.length > 0 ? (
          files.map((file) => {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname);
            const url = fileUrls[file.path];
            return (
              <div
                key={file._id || file.path}
                className="w-80 bg-gray-800 text-white rounded-xl shadow-2xl flex flex-col items-center p-6 gap-4"
              >
                <div className="flex flex-col items-center gap-4 w-full">
                  {isImage && url ? (
                    <img
                      src={url}
                      alt={file.originalname}
                      className="w-full h-72 object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <span className="text-6xl mb-2">📄</span>
                  )}
                  <span className="text-lg font-semibold break-all text-center">
                    {file.originalname}
                  </span>
                </div>
                <div className="flex gap-4 mt-2">
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline"
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => window.open(url, '_blank')}
                    className="text-green-300 hover:underline"
                    disabled={!url}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file.path)}
                    className="text-red-400 hover:text-red-600"
                    disabled={deleting === file.path}
                  >
                    {deleting === file.path ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white">No files uploaded yet.</p>
        )}
      </div>
    </main>
  );
};

export default Home;
