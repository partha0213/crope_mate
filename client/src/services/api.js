import axios from 'axios';

// Create axios instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Add request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error.response || error);
    }
    
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('userToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Enhanced get method with caching
const cachedGet = async (url, config = {}) => {
  const cacheKey = `${url}-${JSON.stringify(config)}`;
  
  // Check if we have a valid cached response
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return { ...cachedData.response };
    }
  }
  
  // If no cache or expired, make the request
  const response = await api.get(url, config);
  
  // Cache the response
  cache.set(cacheKey, {
    response,
    timestamp: Date.now(),
  });
  
  return response;
};

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  } else if (typeof input === 'object' && input !== null) {
    // Recursively sanitize objects
    return Object.keys(input).reduce((acc, key) => {
      acc[key] = sanitizeInput(input[key]);
      return acc;
    }, Array.isArray(input) ? [] : {});
  }
  return input;
};

export default {
  // Get request with caching
  get: cachedGet,
  
  // Regular methods without caching
  post: (url, data, config = {}) => api.post(url, sanitizeInput(data), config),
  put: (url, data, config = {}) => api.put(url, sanitizeInput(data), config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // File upload with progress tracking
  upload: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) onProgress(percentCompleted);
      },
    });
  },
  
  // Clear cache
  clearCache: () => cache.clear(),
  
  // Clear specific cache entry
  clearCacheEntry: (url) => {
    for (const key of cache.keys()) {
      if (key.startsWith(url)) {
        cache.delete(key);
      }
    }
  },
};