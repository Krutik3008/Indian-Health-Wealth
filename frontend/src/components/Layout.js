import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/assessment', label: 'Prakriti Assessment', icon: '🧘‍♀️' },
    { path: '/recommendations', label: 'Recommendations', icon: '💡' },
    { path: '/recipes', label: 'Recipes', icon: '🍽️' },
    { path: '/forum', label: 'Forum', icon: '👥' },
    { path: '/history', label: 'Assessment History', icon: '📊' },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex flex-col">
      {/* Header */}
      <nav className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white shadow-xl">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-white to-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-lg">॰</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  Ayurvedic Prakriti Analyzer
                </h1>
                <p className="text-sm text-orange-100">Discover Your Body Constitution</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center space-x-6">
                <span className="text-orange-100">Namaste, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Navigation Menu */}
      {user && (
        <div className="bg-white shadow-md border-b border-orange-200">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                    location.pathname === item.path
                      ? 'border-orange-500 text-orange-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-orange-600 hover:border-orange-300'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto py-8 px-4 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-300">About Ayurveda</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Ayurveda is an ancient system of medicine that focuses on balancing the three doshas (Vata, Pitta, Kapha) 
                to achieve optimal health and wellness through personalized lifestyle and dietary recommendations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-300">Three Doshas</h3>
              <ul className="text-gray-300 text-base space-y-2">
                <li className="flex items-center"><span className="text-blue-400 mr-2">💨</span> Vata - Air & Space</li>
                <li className="flex items-center"><span className="text-red-400 mr-2">🔥</span> Pitta - Fire & Water</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">🌍</span> Kapha - Earth & Water</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-300">Project Info</h3>
              <p className="text-gray-300 text-base mb-2">
                Indian Health, Wellness and Psychology
              </p>
              <p className="text-gray-300 text-base mb-4">
                Student ID: 202203103510037
              </p>
              <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 rounded-lg">
                <p className="font-semibold text-white text-center text-lg">Created by: Patel Krutik Chandreshbhai</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-base">
              © 2025 Ayurvedic Prakriti Analyzer. Developed for educational purposes in Indian Health, Wellness and Psychology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;