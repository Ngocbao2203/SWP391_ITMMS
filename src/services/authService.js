import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.loadUserFromStorage();
  }

  // Load user từ localStorage khi khởi tạo
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem('user');
    }
  }

  // Lưu user vào localStorage
  saveUserToStorage(user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Xóa user khỏi localStorage
  removeUserFromStorage() {
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - Dữ liệu đăng ký
   */
  async register(userData) {
    try {
      // Thêm các fields required cho backend
      const registrationData = {
        ...userData,
        role: userData.role || 'Customer',
        confirmPassword: userData.password // Backend require confirmPassword giống password
      };
      
      console.log('📤 Sending registration data:', registrationData);
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, registrationData);
      console.log('📥 Registration response:', response);
      
      // Backend trả về format: { message: "...", user: {...} }
      if (response && (response.message || response.user)) {
        return {
          success: true,
          message: response.message || 'Đăng ký thành công',
          userId: response.user?.id || response.userId,
          user: response.user
        };
      }
      
      return {
        success: false,
        message: 'Đăng ký thất bại'
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        message: error.message || 'Đăng ký thất bại',
        errors: error.getValidationErrors ? error.getValidationErrors() : null
      };
    }
  }

  /**
   * Đăng nhập
   * @param {Object} credentials - Email và password
   */
  async login(credentials) {
    try {
      console.log('📤 Sending login request:', credentials);
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('📥 Login response:', response);
      
      // Backend trả về format: { message: "...", user: {...} }
      // Kiểm tra nếu có user object trong response
      if (response && response.user) {
        const user = response.user;
        
        // Nếu có token, lưu vào user object
        if (response.token) {
          user.token = response.token;
        }
        
        this.saveUserToStorage(user);
        return {
          success: true,
          message: response.message || 'Đăng nhập thành công',
          user: user
        };
      }
      
      return {
        success: false,
        message: response.message || 'Email hoặc mật khẩu không đúng'
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: error.message || 'Đăng nhập thất bại',
        errors: error.getValidationErrors ? error.getValidationErrors() : null
      };
    }
  }

  /**
   * Đăng xuất
   */
  logout() {
    this.removeUserFromStorage();
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  }

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Kiểm tra user có đăng nhập hay không
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Kiểm tra role của user
   * @param {string|Array} roles - Role hoặc danh sách roles
   */
  hasRole(roles) {
    if (!this.currentUser) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(this.currentUser.role);
    }
    
    return this.currentUser.role === roles;
  }

  /**
   * Kiểm tra email có tồn tại hay không
   * @param {string} email 
   */
  async checkEmailExists(email) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra username có tồn tại hay không
   * @param {string} username 
   */
  async checkUsernameExists(username) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.CHECK_USERNAME, { username });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy profile user
   * @param {number} userId 
   */
  async getUserProfile(userId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.PROFILE(userId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật profile user
   * @param {number} userId 
   * @param {Object} profileData 
   */
  async updateProfile(userId, profileData) {
    try {
      const response = await apiService.put(`/auth/profile?id=${userId}`, profileData);
      
      // Cập nhật current user nếu đang cập nhật chính mình
      if (this.currentUser && this.currentUser.id === userId) {
        const updatedUser = { ...this.currentUser, ...profileData };
        this.saveUserToStorage(updatedUser);
      }
      
      return {
        success: true,
        message: 'Cập nhật profile thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cập nhật profile thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Đổi mật khẩu
   * @param {Object} passwordData - userId, oldPassword, newPassword
   */
  async changePassword(passwordData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
      return {
        success: true,
        message: response.message || 'Đổi mật khẩu thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Đổi mật khẩu thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Lấy lịch sử của user
   * @param {number} userId 
   */
  async getUserHistory(userId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.HISTORY(userId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo feedback
   * @param {Object} feedbackData 
   */
  async createFeedback(feedbackData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.FEEDBACK, feedbackData);
      return {
        success: true,
        message: 'Gửi feedback thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gửi feedback thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Test connection
   */
  async testConnection() {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.TEST);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Helper function để format error messages
export const formatErrorMessage = (error) => {
  if (error?.message) {
    return error.message;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};

// Export singleton instance
const authService = new AuthService();
export default authService;
