// Centralized API configuration for ShopEZ Frontend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shopez-e-commerces-backend.onrender.com';

/**
 * Returns the full API URL for a given endpoint path.
 * @param {string} endpoint - e.g. '/api/products' or 'api/users/login'
 */
export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
