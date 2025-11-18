// src/api/getRecommendations.js
import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Mock API - replace with real API

export const getRecommendations = async (faculty, country = '') => {
  try {
    // Simulate API call - in real implementation, replace with actual endpoint
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      params: {
        faculty,
        country,
        _limit: 5 // Get 5 recommendations
      }
    });

    // Transform mock data to match our expected format
    // In a real app, the API would return proper university data
    const recommendations = response.data.map((item, index) => ({
      id: item.id,
      university: `University of ${faculty} ${index + 1}`,
      faculty: `${faculty} Studies`,
      country: country || 'Various Countries',
      ranking: index + 1,
      description: `Top-ranked program in ${faculty} with excellent research opportunities and industry connections.`,
      acceptanceRate: `${Math.floor(Math.random() * 30) + 10}%`,
      tuition: `$${Math.floor(Math.random() * 30000) + 10000}`,
      website: 'https://university.example.edu'
    }));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return recommendations;
  } catch (error) {
    throw new Error('Failed to fetch recommendations. Please try again.');
  }
};