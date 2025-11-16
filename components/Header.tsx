import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* The 'A' Icon */}
          <div className="w-8 h-8 flex items-center justify-center mr-2">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <linearGradient id="logoAGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />   {/* tailwind orange-500 */}
                    <stop offset="30%" stopColor="#ef4444" />  {/* tailwind red-500 */}
                    <stop offset="70%" stopColor="#d946ef" />  {/* tailwind fuchsia-500 */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* tailwind violet-500 */}
                </linearGradient>
              </defs>
              {/* A stylized path for the letter A. It's a simple triangle with a cutout. */}
              <path 
                d="M20 2 L2 38 L38 38 Z M20 12 L12 28 L28 28 Z" 
                fill="url(#logoAGradient)"
              />
            </svg>
          </div>
          {/* The Text */}
          <div className="flex flex-col justify-center -space-y-1">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              AMICUS
            </span>
            <span className="text-[9px] font-semibold tracking-[0.15em] text-amber-200/90 pl-px">
              IT PAYS TO KNOW
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-pink-400" aria-current="page">Ask a Lawyer</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-pink-400 transition-colors duration-200">Find a Lawyer</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-pink-400 transition-colors duration-200">Be a Lawyer</a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
            >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                )}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#" className="text-pink-400 block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Ask a Lawyer</a>
          <a href="#" className="text-gray-300 hover:text-white hover:bg-gray-700/50 block px-3 py-2 rounded-md text-base font-medium">Find a Lawyer</a>
          <a href="#" className="text-gray-300 hover:text-white hover:bg-gray-700/50 block px-3 py-2 rounded-md text-base font-medium">Be a Lawyer</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
