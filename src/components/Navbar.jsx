// src/components/Navbar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">UniFinder</span>
          </Link>
          
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                location.pathname === '/' 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/recommendations" 
              className={`transition-colors duration-200 ${
                location.pathname === '/recommendations' 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Get Recommendations
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;