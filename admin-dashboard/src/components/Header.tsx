import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, X, CheckCircle, AlertCircle, LayoutDashboard, FileText, BarChart3, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const notifications = [];

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Content Manager', href: '/content', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Fetch notifications from Firestore would go here
  // For now, notifications will be empty until implemented

  const handleNotificationClick = (): void => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id: number): void => {
    // In a real app, this would update the notification in the database
    console.log('Mark notification as read', { notificationId: id });
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  return (
    <header className="bg-ghana-secondary-700 shadow-soft border-b border-ghana-secondary-600 px-4 md:px-6 py-2 md:py-3 sticky top-0 z-40 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-ghana-gold-100 hover:text-ghana-gold-300 hover:bg-ghana-secondary-600 rounded-lg transition-all duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <img
            src="/Logo.jpeg"
            alt="Ghana School Feeding Programme Logo"
            className="h-10 md:h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/48/48';
            }}
          />
        </div>

        {/* Center - Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-ghana-gold-500 text-ghana-secondary-900'
                    : 'text-ghana-gold-100 hover:bg-ghana-secondary-600 hover:text-ghana-gold-300'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Notifications - hidden on very small screens */}
          <div className="relative hidden sm:block">
            <button
              onClick={handleNotificationClick}
              className={`relative p-2 text-ghana-gold-100 hover:text-ghana-gold-300 hover:bg-ghana-secondary-600 focus:outline-none focus:ring-2 focus:ring-ghana-gold-500 focus:ring-offset-2 rounded-lg transition-all duration-200 group ${
                showNotifications ? 'bg-ghana-secondary-600 text-ghana-gold-300' : ''
              }`}
            >
              <Bell className="h-5 w-5 md:h-6 md:w-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-bounce">
                  {notifications.filter(n => !n.read).length}
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-ghana-neutral-200 z-50">
                <div className="p-4 border-b border-ghana-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-ghana-neutral-900">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-ghana-neutral-400 hover:text-ghana-neutral-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-ghana-neutral-100 last:border-b-0 hover:bg-ghana-neutral-50 cursor-pointer transition-colors ${
                            notification.read ? 'opacity-60' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 p-1 rounded-full ${
                              notification.type === 'success' ? 'bg-green-100 text-green-600' :
                              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                              notification.type === 'error' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                               notification.type === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                               notification.type === 'error' ? <AlertCircle className="h-4 w-4" /> :
                               <CheckCircle className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ghana-neutral-900">{notification.title}</p>
                              <p className="text-xs text-ghana-neutral-500 mt-1">{notification.message}</p>
                              <p className="text-xs text-ghana-neutral-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-ghana-neutral-500">
                        <Bell className="h-12 w-12 mx-auto mb-3 text-ghana-neutral-300" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-ghana-neutral-200">
                    <button className="w-full text-center text-sm text-ghana-primary-600 hover:text-ghana-primary-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>

          {/* User Menu */}
          <div className="flex items-center space-x-1 md:space-x-3 p-1 md:p-2 rounded-lg hover:bg-ghana-secondary-600 transition-colors duration-200 cursor-pointer group">
            <div className="relative">
              {user?.avatar ? (
                <img
                  className="w-7 h-7 md:w-10 md:h-10 rounded-xl border-2 border-ghana-gold-300 shadow-soft group-hover:shadow-medium transition-shadow duration-200"
                  src={user.avatar}
                  alt={user?.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-7 h-7 md:w-10 md:h-10 rounded-xl border-2 border-ghana-gold-300 shadow-soft group-hover:shadow-medium transition-shadow duration-200 flex items-center justify-center bg-ghana-gold-500 ${user?.avatar ? 'hidden' : ''}`}>
                <span className="text-xs md:text-sm font-semibold text-ghana-secondary-900">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-ghana-gold-400 rounded-full border-2 border-ghana-secondary-700 animate-pulse-slow"></div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-ghana-gold-100">{user?.name || 'Admin'}</p>
              <p className="text-xs text-ghana-gold-300">{user?.email || ''}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center px-2 md:px-4 py-2 text-sm font-medium text-ghana-gold-100 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="h-4 w-4 mr-0 md:mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div ref={mobileMenuRef} className="md:hidden border-t border-ghana-secondary-600 bg-ghana-secondary-800 absolute left-0 right-0 top-full z-50 shadow-xl">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-ghana-gold-500 text-ghana-secondary-900'
                      : 'text-ghana-gold-100 hover:bg-ghana-secondary-600 hover:text-ghana-gold-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
