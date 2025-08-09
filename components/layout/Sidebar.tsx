
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MENU_ITEMS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, closeSidebar }) => {
  const { user } = useAuth();

  const availableMenuItems = user?.role === UserRole.SUPER_ADMIN
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.name !== 'Data Akun');

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {availableMenuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};