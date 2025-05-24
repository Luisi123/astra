import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request interceptor - Token from localStorage:', token ? 'present' : 'missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', {
        ...config.headers,
        Authorization: 'Bearer [REDACTED]'
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Response error status:', error.response.status);
      console.log('Response error data:', error.response.data);
      
      const errorCode = error.response.data?.code;
      console.log('Error code:', errorCode);

      // Handle token-related errors
      if (error.response.status === 401 || error.response.status === 403) {
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        
        // Don't redirect for token validation requests
        if (error.config.url.includes('/auth/validate')) {
          return Promise.reject(new Error(
            error.response.data?.message || 'Token validation failed'
          ));
        }

        // For other requests, reject with a specific error message
        const errorMessage = error.response.data?.message || 'Session expired. Please log in again.';
        return Promise.reject(new Error(errorMessage));
      }
      
      // For other errors, reject with the error message from the server
      return Promise.reject(new Error(
        error.response.data?.message || 'An error occurred'
      ));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject(new Error('No response from server. Please try again.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Profile API calls
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getInterests: () => api.get('/profile/interests'),
  updateInterests: (interests) => api.put('/profile/interests', { interests }),
};

// Academic API calls
export const academicAPI = {
  getGrades: () => api.get('/academic/grades'),
  updateGrades: (grades) => api.put('/academic/grades', { grades }),
  getProgress: () => api.get('/academic/progress'),
};

// Applications API calls
export const applicationsAPI = {
  getApplications: () => api.get('/applications'),
  createApplication: (data) => api.post('/applications', data),
  updateApplication: (id, data) => api.put(`/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

// Chat API calls
export const chatAPI = {
  getHistory: () => api.get('/chat/history'),
  sendMessage: (content) => api.post('/chat', { content }),
};

// Update user profile
export const updateProfile = async (profileData) => {
  return await api.put('/profile', profileData);
};

export default api; 