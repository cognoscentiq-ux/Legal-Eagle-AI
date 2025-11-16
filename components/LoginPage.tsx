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
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white p-4">
      {/* Logo */}
      <div className="w-full max-w-[541px] px-4 mb-8">
        <img src="https://boboz.co.ke/wp-content/uploads/2025/11/amicus_1_logo.png" alt="Amicus Pro Logo" className="w-full h-auto" />
      </div>
      
      {/* Login Modal */}
      <div className="w-full max-w-4xl bg-brand-med-dark rounded-lg shadow-2xl border border-brand-border flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Introduction */}
        <div className="w-full md:w-1/2 p-8 bg-brand-med flex flex-col justify-center">
            <h1 className="font-extrabold text-2xl md:text-3xl leading-tight text-brand-accent mb-4">
                Get Simple, Straight Answers to Complex Legal Challenges
            </h1>
            <p className="text-md text-gray-200 mb-4">
                Hello! I'm Matt, an AI guru with a strong legal research background.
            </p>
            <p className="text-gray-300 text-sm">
                I'll search and compile insightful legal info on ANY QUESTION, sourcing my
                answers from Kenyan Case Law, Acts of Parliament and Published articles.
            </p>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">Welcome</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full bg-brand-med border border-brand-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
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
                  className="mt-1 block w-full bg-brand-med border border-brand-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                  autoComplete="email"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-brand-med-dark transition-colors"
                >
                  Start Chatting
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
