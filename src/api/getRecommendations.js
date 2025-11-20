// src/api/getRecommendations.js
import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests

// Mock data generator for development
const generateMockRecommendations = (faculty, country = '') => {
  const countries = country ? [country] : ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'];
  const baseCountry = country || 'Various Countries';
  
  return [
    {
      id: 1,
      university: `University of ${getCountryAdjective(countries[0])} ${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      faculty: `${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      country: countries[0],
      ranking: 1,
      description: `World-renowned ${faculty} program with cutting-edge research facilities and strong industry partnerships. Excellent career prospects for graduates.`,
      acceptanceRate: `${Math.floor(Math.random() * 20) + 5}%`,
      tuition: `$${Math.floor(Math.random() * 40000) + 20000}`,
      website: "https://university.example.edu"
    },
    {
      id: 2,
      university: `${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Institute of Technology`,
      faculty: `Advanced ${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      country: countries[1 % countries.length],
      ranking: 2,
      description: `Specialized institution focused on ${faculty} innovation and practical applications. Strong emphasis on hands-on learning and research.`,
      acceptanceRate: `${Math.floor(Math.random() * 25) + 10}%`,
      tuition: `$${Math.floor(Math.random() * 35000) + 15000}`,
      website: "https://techinstitute.edu"
    },
    {
      id: 3,
      university: `Global ${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} University`,
      faculty: `International ${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Program`,
      country: countries[2 % countries.length],
      ranking: 3,
      description: `Comprehensive ${faculty} program with international focus and diverse student body. Excellent study abroad opportunities and global network.`,
      acceptanceRate: `${Math.floor(Math.random() * 30) + 15}%`,
      tuition: `$${Math.floor(Math.random() * 30000) + 10000}`,
      website: "https://globaluniversity.edu"
    },
    {
      id: 4,
      university: `National University of ${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Studies`,
      faculty: `${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} and Research`,
      country: countries[3 % countries.length],
      ranking: 4,
      description: `Research-intensive institution with strong focus on ${faculty} theory and practical applications. Excellent faculty mentorship opportunities.`,
      acceptanceRate: `${Math.floor(Math.random() * 35) + 20}%`,
      tuition: `$${Math.floor(Math.random() * 25000) + 8000}`,
      website: "https://nationaluniversity.edu"
    },
    {
      id: 5,
      university: `Metropolitan ${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} College`,
      faculty: `Applied ${faculty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      country: countries[4 % countries.length],
      ranking: 5,
      description: `Urban campus with strong industry connections in ${faculty}. Focus on career-ready skills and internship opportunities with leading companies.`,
      acceptanceRate: `${Math.floor(Math.random() * 40) + 25}%`,
      tuition: `$${Math.floor(Math.random() * 20000) + 5000}`,
      website: "https://metropolitancollege.edu"
    }
  ];
};

const getCountryAdjective = (country) => {
  const adjectives = {
    'United States': 'American',
    'United Kingdom': 'British',
    'Canada': 'Canadian',
    'Australia': 'Australian',
    'Germany': 'German',
    'France': 'French',
    'Japan': 'Japanese',
    'Singapore': 'Singaporean'
  };
  return adjectives[country] || country;
};

export const getRecommendations = async (faculty, country = '') => {
  try {
    // Rate limiting: Wait if we're making requests too quickly
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    
    lastRequestTime = Date.now();

    // If no API key, use mock data for development
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('📝 Using mock data - No valid OpenAI API key found');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return generateMockRecommendations(faculty, country);
    }

    const prompt = `As a university recommendation system, provide exactly 5 university recommendations in JSON format for a student interested in ${faculty} ${country ? `in ${country}` : 'worldwide'}.

Return ONLY a valid JSON array without any markdown or extra text. Each university object should have:
- id: number (1-5)
- university: string (real university name)
- faculty: string (specific faculty/program name related to ${faculty})
- country: string
- ranking: number (1-5)
- description: string (2-3 sentences about why it's a good fit)
- acceptanceRate: string (realistic percentage like "15%")
- tuition: string (realistic annual tuition like "$35,000")
- website: string (real university website URL)

Make recommendations realistic and based on actual university strengths. Include both prestigious and good-value options.`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a university recommendation expert. Always return valid JSON arrays without any extra text or markdown formatting. Provide realistic university recommendations based on actual institutions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Clean the response and parse JSON
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const recommendations = JSON.parse(cleanedContent);

    // Validate the response structure
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('Invalid response format from API');
    }

    return recommendations;

  } catch (error) {
    console.error('API Error:', error);
    
    // Use mock data as fallback for any error
    console.log('🔄 Falling back to mock data due to error');
    
    if (error.response?.status === 401) {
      console.error('Invalid API key - using mock data');
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded - using mock data');
    } else if (error.response?.status === 403) {
      console.error('API access forbidden - using mock data');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - using mock data');
    } else if (error.message?.includes('JSON')) {
      console.error('JSON parsing error - using mock data');
    } else {
      console.error('Unknown error - using mock data');
    }
    
    // Return mock data as fallback
    return generateMockRecommendations(faculty, country);
  }
};