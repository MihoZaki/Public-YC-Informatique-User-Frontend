import axios from "axios";

// Base URL for the API (adjust this for your deployment environment)
const API_BASE_URL = "http://localhost:8000/api/v1"; // Replace with your backend URL

// Create an Axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
    // Authorization header will be added dynamically later if needed
  },
  withCredentials: true, // Important: Include cookies (like session_id or refresh_token) in requests
});

// --- Authentication Endpoints ---

/**
 * Registers a new user.
 * @param {Object} userData - The user's registration data (email, password, full_name).
 * @returns {Promise<Object>} The response data containing the new user info and success status.
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data; // Returns { success: true,  { id, email, full_name, ... } }
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Re-throw to be handled by caller
  }
};

/**
 * Logs in a user and returns an access token.
 * @param {Object} credentials - The user's login credentials (email, password).
 * @returns {Promise<Object>} The response data containing access token and user info.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data; // Returns { success: true,  { access_token, user: { id, email, full_name, ... } } }
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Refreshes the access token using the refresh token (assumes refresh token is handled via cookies).
 * @returns {Promise<Object>} The response data containing the new access token.
 */
export const refreshToken = async () => {
  try {
    // Refresh token is sent via cookie, no body needed
    const response = await apiClient.post("/auth/refresh");
    return response.data; // Returns { success: true,  { access_token } }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

/**
 * Logs out the user by revoking the refresh token (assumes refresh token is handled via cookies).
 * @returns {Promise<void>} Resolves on successful logout.
 */
export const logoutUser = async () => {
  try {
    // Logout is a POST request, refresh token is sent via cookie
    await apiClient.post("/auth/logout");
    // Response is 204 No Content, no data to return
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// --- Public Products Endpoints ---

/**
 * Fetches a paginated list of products.
 * @param {number} page - Page number (1-indexed).
 * @param {number} limit - Number of products per page.
 * @returns {Promise<Object>} The response data containing products array, pagination info, etc.
 */
export const fetchProducts = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get("/products", {
      params: {
        page,
        limit,
      },
    });
    // The API returns {  [...], page, limit, total, total_pages }
    // Return the *entire* response object. The component will destructure it.
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Fetches details of a specific product by its ID.
 * @param {string} id - The UUID of the product.
 * @returns {Promise<Object>} The response data containing the product details.
 */
export const fetchProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    // The API returns the product object directly
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

/**
 * Searches for products based on various criteria.
 * @param {Object} searchParams - Object containing search parameters (q, category_id, brand, min_price, max_price, in_stock_only, include_discounted_only, page, limit, spec_filter).
 * @returns {Promise<Object>} The response data containing matching products array, pagination info, etc.
 */
export const searchProducts = async (searchParams = {}) => {
  try {
    // Default parameters
    const params = {
      page: 1,
      limit: 20,
      ...searchParams, // Spread the provided search parameters
    };

    // Convert boolean parameters to strings as expected by the API
    if (params.in_stock_only !== undefined) {
      params.in_stock_only = String(params.in_stock_only).toLowerCase();
    }
    if (params.include_discounted_only !== undefined) {
      params.include_discounted_only = String(params.include_discounted_only)
        .toLowerCase();
    }

    const response = await apiClient.get("/products/search", { params });
    // The API returns {  [...], page, limit, total, total_pages, ... }
    // Return the *entire* response object. The component will destructure it.
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

/**
 * Fetches all product categories.
 * @returns {Promise<Array>} An array of category objects.
 */
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/products/categories");
    // The API returns the array of categories directly
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Fetches details of a specific category by its ID.
 * @param {string} id - The UUID of the category.
 * @returns {Promise<Object>} The response data containing the category details.
 */
export const fetchCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`/products/categories/${id}`);
    // The API returns the category object directly
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

// --- User-Specific Endpoints (Require Authorization Token) ---

// Helper function to set the authorization header
const setAuthHeader = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

/**
 * Fetches the current user's cart.
 * @param {string} token - The user's access token.
 * @returns {Promise<Object>} The response data containing the cart details.
 */
export const fetchUserCart = async (token) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.get("/cart");
    return response.data; // Returns the cart object
  } catch (error) {
    console.error("Error fetching user cart:", error);
    throw error;
  }
};

/**
 * Adds an item to the current user's cart.
 * @param {string} token - The user's access token.
 * @param {string} productId - The UUID of the product to add.
 * @param {number} quantity - The quantity to add.
 * @returns {Promise<Object>} The response data containing the added cart item details.
 */
export const addItemToCart = async (token, productId, quantity) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.post("/cart/items", {
      product_id: productId,
      quantity: quantity,
    });
    return response.data; // Returns the added/updated cart item object
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

/**
 * Updates the quantity of an item in the current user's cart.
 * @param {string} token - The user's access token.
 * @param {string} itemId - The UUID of the cart item to update.
 * @param {number} quantity - The new quantity.
 * @returns {Promise<Object>} The response data containing the updated cart item details.
 */
export const updateCartItem = async (token, itemId, quantity) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.put(`/cart/items/${itemId}`, {
      quantity: quantity,
    });
    return response.data; // Returns the updated cart item object
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

/**
 * Removes an item from the current user's cart.
 * @param {string} token - The user's access token.
 * @param {string} itemId - The UUID of the cart item to remove.
 * @returns {Promise<void>} Resolves on successful removal.
 */
export const removeCartItem = async (token, itemId) => {
  setAuthHeader(token);
  try {
    await apiClient.delete(`/cart/items/${itemId}`);
    // Response is 204 No Content, no data to return
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

/**
 * Clears the current user's cart.
 * @param {string} token - The user's access token.
 * @returns {Promise<void>} Resolves on successful clearing.
 */
export const clearUserCart = async (token) => {
  setAuthHeader(token);
  try {
    await apiClient.delete("/cart");
    // Response is 204 No Content, no data to return
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

/**
 * Creates a new order from the user's cart.
 * @param {string} token - The user's access token.
 * @param {Object} orderData - The order details (delivery_service_id, shipping_address, notes).
 * @returns {Promise<Object>} The response data containing the created order details.
 */
export const createOrder = async (token, orderData) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.post("/orders", orderData);
    return response.data; // Returns the created order object
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Fetches details of a specific order belonging to the user.
 * @param {string} token - The user's access token.
 * @param {string} orderId - The UUID of the order.
 * @returns {Promise<Object>} The response data containing the order details.
 */
export const fetchOrderById = async (token, orderId) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data; // Returns the order object
  } catch (error) {
    console.error(`Error fetching order with id ${orderId}:`, error);
    throw error;
  }
};

/**
 * Fetches a paginated list of orders for the current user.
 * @param {string} token - The user's access token.
 * @param {number} page - Page number (1-indexed).
 * @param {number} limit - Number of orders per page.
 * @returns {Promise<Object>} The response data containing orders array, pagination info, etc.
 */
export const fetchUserOrders = async (token, page = 1, limit = 20) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.get("/orders", {
      params: {
        page,
        limit,
      },
    });
    return response.data; // Returns {  [...], page, limit, total, total_pages }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Fetches the available delivery options for the user.
 * @param {string} token - The user's access token.
 * @returns {Promise<Array>} An array of delivery option objects.
 */
export const fetchDeliveryOptions = async (token) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.get("/delivery-options");
    return response.data; // Returns the array of delivery options
  } catch (error) {
    console.error("Error fetching delivery options:", error);
    throw error;
  }
};

/**
 * Submits a review for a product.
 * @param {string} token - The user's access token.
 * @param {string} productId - The UUID of the product.
 * @param {number} rating - The rating (1-5).
 * @returns {Promise<Object>} The response data containing the created review details.
 */
export const submitReview = async (token, productId, rating) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.post("/reviews", {
      product_id: productId,
      rating: rating,
    });
    return response.data; // Returns the created review object
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

/**
 * Fetches reviews for a specific product.
 * @param {string} productId - The UUID of the product.
 * @param {number} page - Page number (1-indexed).
 * @param {number} limit - Number of reviews per page.
 * @returns {Promise<Object>} The response data containing reviews array, pagination info, etc.
 */
export const fetchReviewsForProduct = async (
  productId,
  page = 1,
  limit = 20,
) => {
  // This endpoint might be public or require auth depending on implementation
  // Assuming it's public for now, so no token required in this function
  // Authorization would be added inside if needed
  try {
    const response = await apiClient.get(`/reviews/product/${productId}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data; // Returns {  [...], page, limit, total, total_pages }
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw error;
  }
};

/**
 * Updates an existing review submitted by the user.
 * @param {string} token - The user's access token.
 * @param {string} reviewId - The UUID of the review.
 * @param {number} rating - The new rating (1-5).
 * @returns {Promise<Object>} The response data containing the updated review details.
 */
export const updateReview = async (token, reviewId, rating) => {
  setAuthHeader(token);
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, {
      rating: rating,
    });
    return response.data; // Returns the updated review object
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Deletes an existing review submitted by the user.
 * @param {string} token - The user's access token.
 * @param {string} reviewId - The UUID of the review.
 * @returns {Promise<void>} Resolves on successful deletion.
 */
export const deleteReview = async (token, reviewId) => {
  setAuthHeader(token);
  try {
    await apiClient.delete(`/reviews/${reviewId}`);
    // Response is 204 No Content, no data to return
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    throw error;
  }
};

// --- Health Check Endpoint ---

/**
 * Checks the health of the API service.
 * @returns {Promise<Object>} The response data containing the health status.
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data; // Returns { status: "ok", timestamp: "..." }
  } catch (error) {
    console.error("Error checking health:", error);
    throw error; // Might throw a 500 error response
  }
};
