import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (name: string, email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin(name, email);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      {/* Logo and Title */}
      <div className="flex items-center mb-8">
         <div className="w-12 h-12 flex items-center justify-center mr-3">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <linearGradient id="logoAGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="30%" stopColor="#ef4444" />
                    <stop offset="70%" stopColor="#d946ef" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M20 2 L2 38 L38 38 Z M20 12 L12 28 L28 28 Z" fill="url(#logoAGradient)" />
            </svg>
          </div>
          <div className="flex flex-col justify-center -space-y-1">
            <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              AMICUS PRO
            </span>
             <span className="text-xs font-semibold tracking-[0.15em] text-amber-200/90 pl-px">
              IT PAYS TO KNOW
            </span>
          </div>
      </div>
      
      {/* Login Form */}
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">Welcome</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email"className="block text-sm font-medium text-gray-400">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
              autoComplete="email"
            />
          </div>
           <p className="text-xs text-gray-500 text-center">
            Admin login: use <strong>admin</strong> and <strong>admin@amicus.pro</strong>
          </p>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-800 transition-colors"
            >
              Start Chatting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;