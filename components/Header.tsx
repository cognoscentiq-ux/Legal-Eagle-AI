import React from 'react';

const Header: React.FC = () => {
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
        
      </div>
    </header>
  );
};

export default Header;
