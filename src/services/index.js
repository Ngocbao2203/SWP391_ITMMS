// Export all API services for easy importing
export { default as apiService } from "./api";
export { default as authService } from "./authService";
export { default as appointmentService } from "./appointmentService";
export { default as doctorService } from "./doctorService";
export { default as patientService } from "./patientService";
export { default as treatmentService } from "./treatmentService";
export { default as guestService } from "./guestService";
export { default as adminService } from "./adminService";
export { default as treatmentPlans } from "./treatmentPlans"; // Thêm export cho treatmentPlans
export { default as blogService } from "./blogService"; // Thêm export cho blogService
export { default as treatmentFlowService } from "./treatmentFlowService"; // Thêm export cho treatmentFlowService
// Export constants
export * from "./apiConstants";

// Export API utilities
export { ApiError } from "./api";

// ========== SERVICE FACADE ==========
// Simplified interface for common operations

class ApiServiceFacade {
  constructor() {
    this.auth = require("./authService").default;
    this.appointments = require("./appointmentService").default;
    this.doctors = require("./doctorService").default;
    this.patients = require("./patientService").default;
    this.treatments = require("./treatmentService").default;
    this.guest = require("./guestService").default;
    this.admin = require("./adminService").default;
    this.plans = require("./treatmentPlans").default; // Thêm vào facade
    this.blogs = require("./blogService").default; // Thêm vào facade
  }

  /**
   * Quick login method
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    return await this.auth.login({ email, password });
  }

  /**
   * Quick register method
   * @param {Object} userData
   */
  async register(userData) {
    return await this.auth.register(userData);
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  /**
   * Quick logout
   */
  logout() {
    return this.auth.logout();
  }

  /**
   * Book appointment quickly
   * @param {Object} appointmentData
   */
  async bookAppointment(appointmentData) {
    return await this.appointments.bookAppointment(appointmentData);
  }

  /**
   * Get patient dashboard data
   * @param {number} customerId
   */
  async getPatientDashboard(customerId) {
    return await this.patients.getPatientDashboard(customerId);
  }

  /**
   * Get admin dashboard data
   */
  async getAdminDashboard() {
    return await this.admin.getCompleteDashboard();
  }

  /**
   * Search globally
   * @param {string} query
   * @param {string} type
   */
  async search(query, type = "all") {
    return await this.guest.globalSearch({ query, type });
  }

  /**
   * Get home page data
   */
  async getHomeData() {
    return await this.guest.getHomePageInfo();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  /**
   * Check user role
   * @param {string|Array} roles
   */
  hasRole(roles) {
    return this.auth.hasRole(roles);
  }

  /**
   * Create treatment plan quickly
   * @param {Object} planData
   */
  async createTreatmentPlan(planData) {
    return await this.plans.createTreatmentPlan(planData);
  }

  /**
   * Get active treatment plan for customer
   * @param {number} customerId
   */
  async getActiveTreatmentPlan(customerId) {
    return await this.plans.getActiveByCustomer(customerId);
  }
}

// Export singleton facade
export const apiServiceFacade = new ApiServiceFacade();

// ========== UTILITY FUNCTIONS ==========

/**
 * Format error messages for display
 * @param {Error|ApiError} error
 */
export const formatErrorMessage = (error) => {
  if (error.isValidationError && error.isValidationError()) {
    const validationErrors = error.getValidationErrors();
    const messages = Object.values(validationErrors).flat();
    return messages.join(", ");
  }

  return error.message || "Đã có lỗi xảy ra";
};

/**
 * Handle API response consistently
 * @param {Promise} apiCall
 * @param {Object} options
 */
export const handleApiCall = async (apiCall, options = {}) => {
  const {
    showSuccess = false,
    showError = true,
    defaultMessage = "",
  } = options;

  try {
    const response = await apiCall;

    if (showSuccess && response.success !== false) {
      console.log("Success:", response.message || defaultMessage);
    }

    return response;
  } catch (error) {
    if (showError) {
      console.error("Error:", formatErrorMessage(error));
    }

    throw error;
  }
};

/**
 * Create query parameters string
 * @param {Object} params
 */
export const createQueryParams = (params = {}) => {
  const filtered = Object.entries(params).filter(
    ([_, value]) => value !== null && value !== undefined && value !== ""
  );

  return new URLSearchParams(filtered).toString();
};

/**
 * Format date for API
 * @param {Date|string} date
 */
export const formatDateForApi = (date) => {
  if (!date) return null;

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString();
};

/**
 * Format date for display
 * @param {Date|string} date
 * @param {string} locale
 */
export const formatDateForDisplay = (date, locale = "vi-VN") => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale);
};

/**
 * Format currency for display
 * @param {number} amount
 * @param {string} currency
 */
export const formatCurrency = (amount, currency = "VND") => {
  if (!amount && amount !== 0) return "";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Validate email format
 * @param {string} email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format (Vietnam)
 * @param {string} phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
};

/**
 * Debounce function for search
 * @param {Function} func
 * @param {number} delay
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// ========== ERROR HANDLER HOOKS ==========

/**
 * Global error handler
 * @param {Error} error
 * @param {Object} context
 */
export const globalErrorHandler = (error, context = {}) => {
  console.error("Global API Error:", error, context);
};

/**
 * Set global error handler
 * @param {Function} handler
 */
export const setGlobalErrorHandler = (handler) => {
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason && event.reason.name === "ApiError") {
      handler(event.reason);
    }
  });
};

// ========== DEFAULT EXPORT =========
// Export the facade as default for convenience
export default apiServiceFacade;
