import React from 'react';

const PublicHome = () => {
  return (
    <div className="min-h-screen text-white flex flex-col bg-black relative overflow-hidden">
      {/* Header */}
      <header className="w-full py-4 flex items-center justify-between px-8 z-30 relative">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="FileVault Logo" className="w-12 h-12" />
          <span className="text-2xl font-bold">FileVault</span>
        </div>
        <nav className="flex gap-6">
          <a href="/home" className="hover:text-gray-400">Home</a>
          <a href="/profile" className="hover:text-gray-400">Profile</a>
          <a href="/upload" className="hover:text-gray-400">Upload</a>
        </nav>
      </header>

      
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/new.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top",
          opacity: 0.45,
          zIndex: 10,
          pointerEvents: "none"
        }}
      ></div>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative w-full" style={{ zIndex: 20 }}>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">Welcome to FileVault</h1>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
          Securely store and manage your files in the cloud. Fast, safe, and easy to use for everyone.
        </p>
        <div className="flex gap-4">
          <a href="/register" className="px-6 py-3 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg">Get Started</a>
          <a href="/login" className="px-6 py-3 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg">Login</a>
        </div>
      </main>
    </div>
  );
};

export default PublicHome;