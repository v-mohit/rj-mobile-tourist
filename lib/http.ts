import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // important for weak networks
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add token to all requests if available in sessionStorage
 * This is called for every request to ensure the latest token is used
 */
http.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage (set during login verification)
    const token = typeof window !== 'undefined'
      ? sessionStorage.getItem('authToken')
      : null;

    // Add token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle authentication errors
 * Clear auth data if token is invalid or expired
 */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's an authentication error (401 or 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear authentication data
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('verifiedContact');
        sessionStorage.removeItem('verifiedIsEmail');
        sessionStorage.removeItem('tokenExpiry');

        // Optionally redirect to verify page for re-login
        // window.location.href = '/verify';
      }
    }
    return Promise.reject(error);
  }
);
