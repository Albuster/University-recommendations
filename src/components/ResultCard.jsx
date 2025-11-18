// src/components/ResultCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Users, ExternalLink } from 'lucide-react';

const ResultCard = ({ university, faculty, country, ranking, description, acceptanceRate, tuition, website, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{university}</h3>
            <p className="text-lg text-blue-600 font-semibold">{faculty}</p>
          </div>
          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            <Award className="h-4 w-4" />
            <span className="text-sm font-semibold">#{ranking}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{country}</span>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-gray-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Acceptance</p>
            <p className="font-semibold text-gray-900">{acceptanceRate}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <span className="text-lg">💰</span>
            <p className="text-sm text-gray-600">Tuition</p>
            <p className="font-semibold text-gray-900">{tuition}/year</p>
          </div>
        </div>

        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          <span>Visit Website</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
};

export default ResultCard;