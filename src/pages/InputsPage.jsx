// src/pages/InputsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRecommendations } from '../api/getRecommendations';
import { useEffect } from 'react';

const InputsPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('API Key loaded:', import.meta.env.VITE_OPENAI_API_KEY ? 'Yes' : 'No');
    console.log('Key starts with:', import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 8));
  }, []);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  // In src/pages/InputsPage.jsx - Update the error display
  {error && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
    >
      <p className="text-red-700 font-medium mb-4">{error}</p>
      {error.includes('rate limit') && (
        <button
          onClick={() => {
            setError('');
            // Auto-retry after 10 seconds
            setTimeout(() => {
              handleSubmit(onSubmit)();
            }, 10000);
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry in 10 seconds
        </button>
      )}
    </motion.div>
  )}

  const facultyOptions = [
    { value: 'computer-science', label: 'Computer Science & IT' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business & Management' },
    { value: 'medicine', label: 'Medicine & Health Sciences' },
    { value: 'arts', label: 'Arts & Humanities' },
    { value: 'science', label: 'Natural Sciences' },
    { value: 'social-sciences', label: 'Social Sciences' },
    { value: 'law', label: 'Law' },
  ];

  const countryOptions = [
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
    { value: 'germany', label: 'Germany' },
    { value: 'france', label: 'France' },
    { value: 'japan', label: 'Japan' },
    { value: 'singapore', label: 'Singapore' },
  ];

  // src/pages/InputsPage.jsx - Only the onSubmit function needs update
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const recommendations = await getRecommendations(data.faculty, data.country);
      
      // Validate the response structure
      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        throw new Error('No recommendations received. Please try again.');
      }
      
      setResults(recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your University Match
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about your interests and we'll recommend the best universities for you
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Main Faculty / Subject Area"
              type="select"
              options={facultyOptions}
              error={errors.faculty?.message}
              required
              {...register('faculty', { 
                required: 'Please select your main faculty area' 
              })}
            />

            <InputField
              label="Dream Country (Optional)"
              type="select"
              options={countryOptions}
              error={errors.country?.message}
              {...register('country')}
            />

            <PrimaryButton 
              type="submit" 
              loading={loading}
              disabled={loading}
            >
              Find My Recommendations
            </PrimaryButton>
          </form>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {loading && <LoadingSpinner />}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
            >
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Your Top Recommendations
              </h2>
              
              <div className="grid gap-6">
                {results.map((result, index) => (
                  <ResultCard
                    key={result.id}
                    {...result}
                    index={index}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <button
                  onClick={() => {
                    setResults(null);
                    setError('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  Search Again
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InputsPage;