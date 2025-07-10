import authService from './authService'
// Base API Configuration và HTTP Client
const API_BASE_URL = 'http://localhost:5037';
const API_PATH = '/api';


class ApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}${API_PATH}`;
    //console.log('Base URL:', this.baseURL);
  }

  createUrl(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    //console.log('Full URL:', url);
    return url;
  }

  // Helper method để handle response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        const error = new ApiError(data.message || 'API Error', response.status, data);
        if (error.isAuthError()) {
          throw new ApiError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 401);
        }
        throw error;
      }
      
      return data;
    }
    
    if (!response.ok) {
      throw new ApiError('Network Error', response.status);
    }
    
    return response;
  }

  // GET request
  async get(endpoint, options = {}) {
    try {
      const user = authService.getCurrentUser(); // Lấy thông tin người dùng
      const token = user?.token; // Giả định token nằm trong user object
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Thêm token nếu có
        ...options.headers,
      };

      const response = await fetch(this.createUrl(endpoint), {
        method: 'GET',
        headers,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST request
  async post(endpoint, data = null, options = {}) {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(this.createUrl(endpoint), {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT request
  async put(endpoint, data = null, options = {}) {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(this.createUrl(endpoint), {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(this.createUrl(endpoint), {
        method: 'DELETE',
        headers,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload file
  async upload(endpoint, formData, options = {}) {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(this.createUrl(endpoint), {
        method: 'POST',
        body: formData,
        headers,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error instanceof ApiError) {
      return error;
    }
    
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new ApiError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.', 0);
    }
    
    return new ApiError(error.message || 'Đã có lỗi xảy ra', 500);
  }
}

// Custom Error Class
class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  // Check if error is validation error
  isValidationError() {
    return this.status === 400 && this.data && this.data.errors;
  }

  // Check if error is authentication error
  isAuthError() {
    return this.status === 401;
  }

  // Check if error is not found
  isNotFoundError() {
    return this.status === 404;
  }

  // Get validation errors
  getValidationErrors() {
    return this.isValidationError() ? this.data.errors : {};
  }
}

// Create singleton instance
const apiService = new ApiService();

export { apiService, ApiError };
export default apiService;