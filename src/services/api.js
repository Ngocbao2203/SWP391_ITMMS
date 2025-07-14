import authService from './authService'
// Base API Configuration và HTTP Client
const API_BASE_URL = 'http://localhost:5037';
const API_PATH = '/api';


class ApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}${API_PATH}`;
    this.pendingRequests = new Map(); // Track pending requests to avoid duplicates
    this.requestQueue = []; // Queue for managing concurrent requests
    this.maxConcurrentRequests = 5; // Limit concurrent requests
    this.activeRequests = 0;
    //console.log('Base URL:', this.baseURL);
  }

  createUrl(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    //console.log('Full URL:', url);
    return url;
  }

  // Generate request key for duplicate detection
  createRequestKey(method, endpoint, data = null) {
    const dataStr = data ? JSON.stringify(data) : '';
    return `${method}:${endpoint}:${dataStr}`;
  }

  // Queue management for concurrent requests
  async queueRequest(requestFn, requestKey = null) {
    // Check for duplicate requests
    if (requestKey && this.pendingRequests.has(requestKey)) {
      console.log('Duplicate request detected, returning existing promise:', requestKey);
      return this.pendingRequests.get(requestKey);
    }

    // Create promise and add to pending requests
    const promise = new Promise((resolve, reject) => {
      const executeRequest = async () => {
        try {
          this.activeRequests++;
          console.log(`Active requests: ${this.activeRequests}/${this.maxConcurrentRequests}`);
          
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          if (requestKey) {
            this.pendingRequests.delete(requestKey);
          }
          this.processQueue();
        }
      };

      if (this.activeRequests >= this.maxConcurrentRequests) {
        console.log('Request queued due to concurrency limit');
        this.requestQueue.push(executeRequest);
      } else {
        executeRequest();
      }
    });

    if (requestKey) {
      this.pendingRequests.set(requestKey, promise);
    }

    return promise;
  }

  // Process queued requests
  processQueue() {
    if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const nextRequest = this.requestQueue.shift();
      nextRequest();
    }
  }

  // Helper method để handle response
  async handleResponse(response) {
    console.log('=== API RESPONSE DEBUG ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        console.error('=== API ERROR DETAILS ===');
        console.error('Status:', response.status);
        console.error('Response data:', data);
        console.error('Error message:', data.message || data.title || data.error);
        console.error('Validation errors:', data.errors || data.validationErrors);
        
        const error = new ApiError(data.message || data.title || 'API Error', response.status, data);
        console.error('Final API Error:', error);
        
        if (error.isAuthError()) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('currentUser');
          throw new ApiError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 401);
        }
        throw error;
      }
      
      return data;
    }
    
    if (!response.ok) {
      console.error('Non-JSON error response:', response);
      // Try to get response text for non-JSON errors
      try {
        const responseText = await response.text();
        console.error('Response text:', responseText);
        throw new ApiError(`Network Error: ${response.status} ${response.statusText} - ${responseText}`, response.status);
      } catch (textError) {
        console.error('Could not read response text:', textError);
        throw new ApiError(`Network Error: ${response.status} ${response.statusText}`, response.status);
      }
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

  // POST request with retry mechanism and queue management
  async post(endpoint, data = null, options = {}) {
    const requestKey = options.allowDuplicates ? null : this.createRequestKey('POST', endpoint, data);
    
    return this.queueRequest(async () => {
      const maxRetries = options.maxRetries || 3;
      const retryDelay = options.retryDelay || 1000;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`=== POST REQUEST (Attempt ${attempt}/${maxRetries}) ===`);
          console.log('Endpoint:', endpoint);
          console.log('Full URL:', this.createUrl(endpoint));
          console.log('Data:', data);
          console.log('Data JSON:', JSON.stringify(data, null, 2));
          
          const user = authService.getCurrentUser();
          const token = user?.token;
          const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
          };
          
          console.log('=== REQUEST HEADERS ===');
          console.log('User:', user ? `${user.fullName} (${user.role})` : 'No user');
          console.log('Token exists:', !!token);
          console.log('Headers:', headers);

          const response = await fetch(this.createUrl(endpoint), {
            method: 'POST',
            headers,
            body: data ? JSON.stringify(data) : null,
            ...options,
          });

          return await this.handleResponse(response);
        } catch (error) {
          console.error(`POST attempt ${attempt} failed:`, error);
          
          // Don't retry on authentication errors or client errors (4xx)
          if (error.status >= 400 && error.status < 500) {
            throw this.handleError(error);
          }
          
          // Retry on network errors or server errors (5xx)
          if (attempt < maxRetries) {
            console.log(`Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
          
          throw this.handleError(error);
        }
      }
    }, requestKey);
  }

  // PUT request with retry mechanism and queue management
  async put(endpoint, data = null, options = {}) {
    const requestKey = options.allowDuplicates ? null : this.createRequestKey('PUT', endpoint, data);
    
    return this.queueRequest(async () => {
      const maxRetries = options.maxRetries || 3;
      const retryDelay = options.retryDelay || 1000;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`=== PUT REQUEST (Attempt ${attempt}/${maxRetries}) ===`);
          console.log('Endpoint:', endpoint);
          console.log('Data:', data);
          
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
          console.error(`PUT attempt ${attempt} failed:`, error);
          
          // Don't retry on authentication errors or client errors (4xx)
          if (error.status >= 400 && error.status < 500) {
            throw this.handleError(error);
          }
          
          // Retry on network errors or server errors (5xx)
          if (attempt < maxRetries) {
            console.log(`Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
          
          throw this.handleError(error);
        }
      }
    }, requestKey);
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