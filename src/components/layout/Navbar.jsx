import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, ChevronDown, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../services/api';

const Navbar = () => {
  const { user, isAuthenticated, userType, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await authAPI.getMe();
      setUnreadCount(response.data?.unreadNotifications || 0);
    } catch (err) {
      // Silent fail
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      success('Logged out successfully');
      navigate('/');
    } catch (err) {
      error('Failed to logout');
    }
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'applicant':
        return '/applicant/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Find Jobs', path: '/jobs' },
        { label: 'Find Candidates', path: '/signup/employer' },
      ];
    }
    
    if (userType === 'applicant') {
      return [
        { label: 'Dashboard', path: '/applicant/dashboard' },
        { label: 'Find Jobs', path: '/applicant/jobs' },
        { label: 'My Applications', path: '/applicant/applications' },
      ];
    }
    
    if (userType === 'employer') {
      return [
        { label: 'Dashboard', path: '/employer/dashboard' },
        { label: 'My Jobs', path: '/employer/jobs' },
        { label: 'Browse Applicants', path: '/employer/applicants' },
      ];
    }
    
    if (userType === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Employers', path: '/admin/employers' },
        { label: 'Applicants', path: '/admin/applicants' },
        { label: 'Jobs', path: '/admin/jobs' },
      ];
    }
    
    return [];
  };

  const isLandingPage = location.pathname === '/';
  const navbarBg = isLandingPage && !isScrolled 
    ? 'bg-transparent' 
    : 'bg-white shadow-sm';
  const textColor = isLandingPage && !isScrolled 
    ? 'text-white' 
    : 'text-gray-800';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navbarBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C8E636] rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0B3D2E]" />
            </div>
            <span className={`text-xl font-bold ${textColor}`}>ShiftMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium hover:text-[#C8E636] transition-colors ${textColor}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium hover:text-[#C8E636] transition-colors ${textColor}`}
                >
                  Login
                </Link>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsSignupOpen(!isSignupOpen)}
                    className="flex items-center gap-2 bg-[#C8E636] text-[#0B3D2E] px-4 py-2 rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors"
                  >
                    Get Started
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isSignupOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fade-in">
                      <Link
                        to="/signup/applicant"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsSignupOpen(false)}
                      >
                        As Applicant
                      </Link>
                      <Link
                        to="/signup/employer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsSignupOpen(false)}
                      >
                        As Employer
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={`/${userType}/notifications`}
                  className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${textColor}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#0B3D2E] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${textColor}`}>
                      {user?.fullName?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 ${textColor}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fade-in">
                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to={`/${userType}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to={`/${userType}/settings`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${textColor}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <hr className="my-2" />
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup/applicant"
                  className="block px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up as Applicant
                </Link>
                <Link
                  to="/signup/employer"
                  className="block px-4 py-2 border-2 border-[#0B3D2E] text-[#0B3D2E] rounded-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up as Employer
                </Link>
              </>
            ) : (
              <>
                <hr className="my-2" />
                <Link
                  to={`/${userType}/notifications`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <Link
                  to={`/${userType}/profile`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
