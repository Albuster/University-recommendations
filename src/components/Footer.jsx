// src/components/Footer.jsx
import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">UniFinder</span>
          </div>
          
          <div className="text-gray-400 text-sm">
            Made with <Heart className="inline h-4 w-4 text-red-400" /> for graduating students
          </div>
          
          <div className="text-gray-400 text-sm mt-4 md:mt-0">
            © 2024 UniFinder. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;