import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LOGO_URL } from '../../constants';

interface HeaderProps {
  onMenuButtonClick: () => void;
  onSearchSubmit: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuButtonClick, onSearchSubmit }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  return (
    <header className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
            <button
                onClick={onMenuButtonClick}
                className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
            <img src={LOGO_URL} alt="Levelnet Logo" className="h-8 w-auto hidden md:block" />
        </div>
        
        <div className="flex-1 px-4 lg:px-8">
            <form onSubmit={handleSearch}>
                <label htmlFor="global-search" className="sr-only">Cari...</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input
                        type="text"
                        id="global-search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Cari leads, kunjungan, no. hp..."
                    />
                </div>
            </form>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <span className="text-gray-700 dark:text-gray-300">
                Welcome, <span className="font-bold">{user?.name}</span>
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};