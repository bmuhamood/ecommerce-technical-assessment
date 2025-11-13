/**
 * API Service
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to build headers
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

/**
 * Product APIs
 */

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
  
  return await apiCall(endpoint, {
    method: 'GET',
    headers: getHeaders()
  });
};

// Get single product by ID
export const getProductById = async (id) => {
  return await apiCall(`/products/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
};

// Create new product (requires auth)
export const createProduct = async (productData) => {
  return await apiCall('/products', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(productData)
  });
};

// Update product (requires auth)
export const updateProduct = async (id, productData) => {
  return await apiCall(`/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(productData)
  });
};

// Delete product (requires auth)
export const deleteProduct = async (id) => {
  return await apiCall(`/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true)
  });
};

// Get all categories
export const getCategories = async () => {
  return await apiCall('/products/categories', {
    method: 'GET',
    headers: getHeaders()
  });
};

/**
 * Authentication APIs
 */

// Login
export const login = async (credentials) => {
  return await apiCall('/auth/login', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials)
  });
};

// Register
export const register = async (userData) => {
  return await apiCall('/auth/register', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData)
  });
};

// Get current user (requires auth)
export const getCurrentUser = async () => {
  return await apiCall('/auth/me', {
    method: 'GET',
    headers: getHeaders(true)
  });
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  login,
  register,
  getCurrentUser
};
