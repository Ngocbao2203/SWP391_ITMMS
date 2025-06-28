import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';

class TreatmentService {
  /**
   * Lấy tất cả treatment services
   * @param {Object} filters 
   */
  async getAllTreatmentServices(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.TREATMENT_SERVICES.GET_ALL}?${queryParams}` : 
        API_ENDPOINTS.TREATMENT_SERVICES.GET_ALL;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết treatment service
   * @param {number} serviceId 
   */
  async getTreatmentServiceDetails(serviceId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.TREATMENT_SERVICES.GET_BY_ID(serviceId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo treatment service mới (Admin/Manager)
   * @param {Object} serviceData 
   */
  async createTreatmentService(serviceData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.TREATMENT_SERVICES.CREATE, serviceData);
      return {
        success: true,
        message: 'Tạo dịch vụ điều trị thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Tạo dịch vụ điều trị thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Cập nhật treatment service
   * @param {number} serviceId 
   * @param {Object} updateData 
   */
  async updateTreatmentService(serviceId, updateData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.TREATMENT_SERVICES.UPDATE(serviceId), updateData);
      return {
        success: true,
        message: 'Cập nhật dịch vụ điều trị thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cập nhật dịch vụ điều trị thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Xóa treatment service
   * @param {number} serviceId 
   */
  async deleteTreatmentService(serviceId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.TREATMENT_SERVICES.DELETE(serviceId));
      return {
        success: true,
        message: 'Xóa dịch vụ điều trị thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Xóa dịch vụ điều trị thất bại'
      };
    }
  }

  /**
   * Tìm kiếm treatment services
   * @param {Object} searchParams 
   */
  async searchTreatmentServices(searchParams = {}) {
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const endpoint = `${API_ENDPOINTS.TREATMENT_SERVICES.SEARCH}?${queryParams}`;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy public pricing của treatment services
   */
  async getPublicPricing() {
    try {
      const response = await apiService.get(API_ENDPOINTS.TREATMENT_SERVICES.PRICING);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== TREATMENT PLANS ==========

  /**
   * Tạo treatment plan mới
   * @param {Object} planData 
   */
  async createTreatmentPlan(planData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.TREATMENT_PLANS.CREATE, planData);
      return {
        success: true,
        message: 'Tạo kế hoạch điều trị thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Tạo kế hoạch điều trị thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Lấy chi tiết treatment plan
   * @param {number} planId 
   */
  async getTreatmentPlanDetails(planId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.TREATMENT_PLANS.GET_BY_ID(planId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật treatment plan
   * @param {number} planId 
   * @param {Object} updateData 
   */
  async updateTreatmentPlan(planId, updateData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.TREATMENT_PLANS.UPDATE(planId), updateData);
      return {
        success: true,
        message: 'Cập nhật kế hoạch điều trị thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cập nhật kế hoạch điều trị thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Cập nhật tiến trình điều trị
   * @param {number} planId 
   * @param {Object} progressData 
   */
  async updateTreatmentProgress(planId, progressData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.TREATMENT_PLANS.UPDATE_PROGRESS(planId), progressData);
      return {
        success: true,
        message: 'Cập nhật tiến trình điều trị thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cập nhật tiến trình điều trị thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Lấy tiến trình điều trị
   * @param {number} planId 
   */
  async getTreatmentProgress(planId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.TREATMENT_PLANS.GET_PROGRESS(planId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Hoàn thành treatment plan
   * @param {number} planId 
   * @param {Object} completionData 
   */
  async completeTreatmentPlan(planId, completionData = {}) {
    try {
      const response = await apiService.post(API_ENDPOINTS.TREATMENT_PLANS.COMPLETE(planId), completionData);
      return {
        success: true,
        message: 'Hoàn thành kế hoạch điều trị thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Hoàn thành kế hoạch điều trị thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Lấy treatment plans của customer
   * @param {number} customerId 
   * @param {Object} filters 
   */
  async getCustomerTreatmentPlans(customerId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.TREATMENT_PLANS.GET_BY_CUSTOMER(customerId)}?${queryParams}` : 
        API_ENDPOINTS.TREATMENT_PLANS.GET_BY_CUSTOMER(customerId);
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy treatment plans của doctor
   * @param {number} doctorId 
   * @param {Object} filters 
   */
  async getDoctorTreatmentPlans(doctorId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.TREATMENT_PLANS.GET_BY_DOCTOR(doctorId)}?${queryParams}` : 
        API_ENDPOINTS.TREATMENT_PLANS.GET_BY_DOCTOR(doctorId);
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== HELPER METHODS ==========

  /**
   * Lấy popular treatment services
   * @param {number} limit 
   */
  async getPopularTreatmentServices(limit = 10) {
    try {
      const filters = {
        sort: 'usage',
        order: 'desc',
        limit: limit
      };
      
      return await this.getAllTreatmentServices(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy treatment services theo price range
   * @param {number} minPrice 
   * @param {number} maxPrice 
   */
  async getTreatmentServicesByPriceRange(minPrice, maxPrice) {
    try {
      const searchParams = {
        minPrice: minPrice,
        maxPrice: maxPrice
      };
      
      return await this.searchTreatmentServices(searchParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy estimated cost cho treatment plan
   * @param {Object} planData 
   */
  async getEstimatedCost(planData) {
    try {
      // Lấy chi tiết service để tính cost
      const service = await this.getTreatmentServiceDetails(planData.treatmentServiceId);
      
      let estimatedCost = service.basePrice || 0;
      
      // Add additional costs based on plan specifics
      if (planData.additionalServices && planData.additionalServices.length > 0) {
        // Calculate additional service costs
        // This would need to be implemented based on specific business logic
      }
      
      return {
        basePrice: service.basePrice || 0,
        estimatedTotal: estimatedCost,
        currency: 'VND'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy treatment success statistics
   * @param {number} serviceId 
   */
  async getTreatmentSuccessStats(serviceId) {
    try {
      const service = await this.getTreatmentServiceDetails(serviceId);
      
      return {
        successRate: service.successRate || 0,
        totalPatients: service.totalPatients || 0,
        averageDuration: service.durationDays || 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Test connection
   */
  async testConnection() {
    try {
      const response = await apiService.get(API_ENDPOINTS.TREATMENT_SERVICES.TEST);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
const treatmentService = new TreatmentService();
export default treatmentService; 