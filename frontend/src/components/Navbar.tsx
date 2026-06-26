import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
const logo = '/Logo.jpeg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle hash scrolling on component mount or location change
  useEffect(() => {
    const hash = window.location.hash;
    console.log('Hash detected:', hash);
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        console.log('Looking for element with id:', hash.slice(1));
        if (element) {
          console.log('Element found, scrolling...');
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.warn('Element not found for id:', hash.slice(1));
        }
      }, 500); // Increased delay to ensure DOM is fully loaded
    }
  }, [location]);

  // Additional hash listener for dynamic changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log('Hash changed to:', hash);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash.slice(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProgramsOpen && !event.target.closest('.programs-dropdown')) {
        setIsProgramsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isProgramsOpen) {
        setIsProgramsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isProgramsOpen]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Programs', href: '/mandates', hasDropdown: true },
    { name: 'Media Centre', href: '/media' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  const programItems = [
    { name: 'School Feeding', href: '#feeding' },
    { name: 'Nutrition Education', href: '#nutrition' },
    { name: 'Community Outreach', href: '#outreach' },
  ];

  const handleNavigation = (href, isDropdown = false) => {
    console.log('Navigation clicked:', href);
    
    // Use React Router for all navigation
    if (href.startsWith('/')) {
      console.log('Navigating to route:', href);
      navigate(href);
    } else if (href.startsWith('#')) {
      // For program dropdown items, use hash scrolling
      const currentPath = location.pathname;
      if (currentPath === '/' || currentPath === '') {
        const sectionId = href.slice(1);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page first, then scroll
        navigate('/' + href);
      }
    }
    // Close mobile menu if open
    setIsOpen(false);
  };

  return (
    <nav className="bg-ghana-secondary-900 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
              <img
                className="h-14 w-auto min-h-[56px] min-w-[56px] object-contain border-2 border-yellow-400 rounded-lg"
                src={logo}
                alt="Ghana School Feeding Programme"
                style={{
                  filter: 'none',
                  opacity: 1,
                  display: 'block',
                  backgroundColor: 'white',
                  padding: '4px'
                }}
              />
              <span className="ml-3 text-yellow-400 font-bold text-sm leading-tight border-l border-ghana-secondary-700 pl-3">Ghana<br />School Feeding<br />Programme</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div className="relative programs-dropdown">
                      <button
                        onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                        className="text-yellow-400 hover:bg-ghana-secondary-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                      >
                        {item.name}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isProgramsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isProgramsOpen && (
                        <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          {programItems.map((program) => (
                            <button
                              key={program.name}
                              onClick={() => {
                                handleNavigation(program.href);
                                setIsProgramsOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-ghana-secondary-800 hover:text-yellow-400 transition-colors duration-200"
                            >
                              {program.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-yellow-400 hover:bg-ghana-secondary-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      onClick={() => {
                        console.log('Link clicked:', item.href);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {item.name === 'News & Media' ? '📰 ' + item.name : item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-ghana-secondary-900 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-ghana-secondary-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-ghana-secondary-900">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                      className="text-white hover:bg-ghana-secondary-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center justify-between"
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isProgramsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProgramsOpen && (
                      <div className="ml-4 space-y-1 bg-ghana-secondary-800 rounded-md mt-1">
                        {programItems.map((program) => (
                          <button
                            key={program.name}
                            onClick={() => {
                              handleNavigation(program.href);
                              setIsProgramsOpen(false);
                            }}
                            className="text-ghana-neutral-200 hover:bg-ghana-secondary-700 block px-3 py-2 rounded-md text-sm font-medium w-full text-left transition-colors duration-200"
                          >
                            {program.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="text-yellow-400 hover:bg-ghana-secondary-800 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => {
                      console.log('Mobile link clicked:', item.href);
                      setIsOpen(false);
                    }}
                  >
                    {item.name === 'News & Media' ? '📰 ' + item.name : item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
