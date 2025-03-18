import axios from 'axios';

const API_URL ="https://backend-s299.onrender.com/api/auth"; // Backend base URL

/**
 * User Login
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - User data including token and role
 * @throws {Error} - If login fails
 */
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    if (res.data?.token) {
      const { token, role, name, id } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role || '');
      localStorage.setItem('name', name || '');
      localStorage.setItem('id', id || '');
      console.log(res.data, 'Login successful, token and role saved.');
      return res.data;
    } else {
      console.error('Token not found in response:', res.data);
      throw new Error('Login failed: Token not received');
    }
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * User Logout
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  console.log('User logged out, token and role removed.');
};

/**
 * Get Token from Local Storage
 * @returns {string | null} - JWT Token if exists
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get Role from Local Storage
 * @returns {string | null} - User Role if exists
 */
export const getRole = () => {
  return localStorage.getItem('role');
};

/**
 * Check if User is Authenticated
 * @returns {boolean} - True if user is authenticated, otherwise false
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

/**
 * Check if Token is Expired
 * @param {string} token - JWT Token
 * @returns {boolean} - True if token is expired, otherwise false
 */
export const isTokenExpired = (token) => {
  try {
    const [, payload] = token.split('.'); // Decode JWT payload
    const decoded = JSON.parse(atob(payload)); // Decode Base64 payload
    const exp = decoded.exp; // Extract expiration timestamp

    if (!exp) {
      console.warn('Token does not have an expiration field.');
      return true;
    }

    return Date.now() >= exp * 1000; // Compare current time with expiration time
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

/**
 * Axios Request Interceptor to Include Token and Handle Expiration
 * @param {Object} axiosInstance - Axios instance
 */
export const attachTokenToRequests = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        // Attach token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response, // Return the response as is if successful
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, log the user out
        logout();
        window.location.href = '/login'; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Refresh Token (Optional Implementation)
 * @returns {Promise<string>} - New JWT token
 * @throws {Error} - If refresh fails
 */
export const refreshToken = async () => {
  try {
    const res = await axios.post(`${API_URL}/refresh`, {
      token: getToken(),
    });

    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      console.log('Token refreshed successfully.');
      return res.data.token;
    } else {
      throw new Error('Token refresh failed.');
    }
  } catch (error) {
    console.error('Token Refresh Error:', error.response?.data || error.message);
    throw error;
  }
};
