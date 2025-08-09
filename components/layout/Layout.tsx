
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import GlobalSearch from '../GlobalSearch';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const closeSidebar = () => {
      if (isSidebarOpen) {
          setSidebarOpen(false);
      }
  }

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        onMenuButtonClick={() => setSidebarOpen(!isSidebarOpen)} 
        onSearchSubmit={handleSearchSubmit}
      />
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className="p-4 md:ml-64">
        <main className="pt-16">
          {children}
        </main>
      </div>
      <GlobalSearch
        isOpen={isSearchModalOpen}
        query={searchQuery}
        onClose={handleCloseSearchModal}
      />
    </div>
  );
};
