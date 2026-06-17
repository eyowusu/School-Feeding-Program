import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Content Manager', href: '/content', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-ghana-primary-900 shadow-large border-r border-ghana-primary-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-ghana-primary-800 bg-gradient-to-r from-ghana-primary-800 to-ghana-primary-700">
          <div className="flex items-center space-x-4">
            <img 
              src="/Logo.jpeg" 
              alt="Ghana School Feeding Programme Logo" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/48/48';
              }}
            />
            <div>
              <span className="text-2xl font-bold text-white">Admin</span>
              <p className="text-xs text-ghana-primary-200 font-medium">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="font-medium truncate">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-ghana-primary-300 rounded-full animate-pulse-slow"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-ghana-primary-800 bg-gradient-to-r from-ghana-primary-800 to-ghana-primary-700">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-ghana-primary-200 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
