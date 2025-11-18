// src/components/PrimaryButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

const PrimaryButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
        disabled || loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default PrimaryButton;