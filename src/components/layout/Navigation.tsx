import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Home, User, LogIn, UserPlus, Settings, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'creator' ? '/creator/dashboard' : '/user/dashboard';
  };

  return (
    <nav className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              OnlyFans Roulette
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive('/creator/dashboard') || isActive('/user/dashboard')
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive('/settings')
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
              onClick={() => {/* Toggle mobile menu */}}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;