
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.753 1.558a1.5 1.5 0 00-1.506 0l-8.25 4.512A1.5 1.5 0 002 7.58v1.948c0 .414.336.75.75.75h.346c.219.001.435.03.647.087a2.33 2.33 0 011.698 1.54l.953 3.811c.21 1.053 1.11 1.832 2.18 1.832h2.848c1.07 0 1.97-.78 2.18-1.832l.954-3.811a2.33 2.33 0 011.698-1.54c.212-.056.428-.086.647-.087h.346a.75.75 0 00.75-.75V7.58c0-.712-.52-1.338-1.247-1.51L12.753 1.558zM12 8.25a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" />
          <path fillRule="evenodd" d="M1 15.75c0-1.06.75-2.054 1.82-2.39a2.25 2.25 0 012.336 1.107l.25.501a2.25 2.25 0 004.188 0l.25-.501a2.25 2.25 0 012.336-1.107c1.07.336 1.82 1.33 1.82 2.39 0 .964-.626 1.82-1.532 2.18a24.819 24.819 0 01-14.936 0C1.626 17.57 1 16.714 1 15.75zm12 .02a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm-3.75-.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008z" clipRule="evenodd" />
        </svg>
        <h1 className="text-xl font-bold text-gray-100">Amicus Pro</h1>
      </div>
    </header>
  );
};

export default Header;