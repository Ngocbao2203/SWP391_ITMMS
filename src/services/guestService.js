import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';

class GuestService {
  /**
   * Lấy thông tin trang chủ
   */
  async getHomePageInfo() {
    try {
      const response = await apiService.get(API_ENDPOINTS.GUEST.HOME);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách dịch vụ công khai
   * @param {Object} filters 
   */
  async getPublicServices(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.GUEST.SERVICES}?${queryParams}` : 
        API_ENDPOINTS.GUEST.SERVICES;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết dịch vụ công khai
   * @param {number} serviceId 
   */
  async getPublicServiceDetails(serviceId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.GUEST.SERVICE_DETAILS(serviceId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách bác sĩ công khai
   * @param {Object} filters 
   */
  async getPublicDoctors(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.GUEST.DOCTORS}?${queryParams}` : 
        API_ENDPOINTS.GUEST.DOCTORS;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết bác sĩ công khai
   * @param {number} doctorId 
   */
  async getPublicDoctorDetails(doctorId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.GUEST.DOCTOR_DETAILS(doctorId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy reviews của bác sĩ
   * @param {number} doctorId 
   * @param {Object} filters 
   */
  async getDoctorReviews(doctorId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.GUEST.DOCTOR_REVIEWS(doctorId)}?${queryParams}` : 
        API_ENDPOINTS.GUEST.DOCTOR_REVIEWS(doctorId);
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách blog posts
   * @param {Object} filters 
   */
  async getBlogPosts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.GUEST.BLOG}?${queryParams}` : 
        API_ENDPOINTS.GUEST.BLOG;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết blog post
   * @param {number} postId 
   */
  async getBlogPostDetails(postId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.GUEST.BLOG_POST(postId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh mục blog
   */
  async getBlogCategories() {
    try {
      const response = await apiService.get(API_ENDPOINTS.GUEST.BLOG_CATEGORIES);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm kiếm toàn cục
   * @param {Object} searchParams 
   */
  async globalSearch(searchParams = {}) {
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const endpoint = `${API_ENDPOINTS.GUEST.SEARCH}?${queryParams}`;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== HELPER METHODS ==========

  /**
   * Lấy featured services từ trang chủ
   */
  async getFeaturedServices() {
    try {
      const homeData = await this.getHomePageInfo();
      return homeData.featuredServices || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy clinic stats từ trang chủ
   */
  async getClinicStats() {
    try {
      const homeData = await this.getHomePageInfo();
      return homeData.stats || {};
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy clinic info từ trang chủ
   */
  async getClinicInfo() {
    try {
      const homeData = await this.getHomePageInfo();
      return homeData.clinicInfo || {};
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm kiếm dịch vụ theo từ khóa
   * @param {string} keyword 
   */
  async searchServices(keyword) {
    try {
      return await this.globalSearch({
        query: keyword,
        type: 'service'
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm kiếm bác sĩ theo từ khóa
   * @param {string} keyword 
   */
  async searchDoctors(keyword) {
    try {
      return await this.globalSearch({
        query: keyword,
        type: 'doctor'
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm kiếm blog posts theo từ khóa
   * @param {string} keyword 
   */
  async searchBlogPosts(keyword) {
    try {
      return await this.globalSearch({
        query: keyword,
        type: 'blog'
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy top rated doctors
   * @param {number} limit 
   */
  async getTopRatedDoctors(limit = 5) {
    try {
      const filters = {
        sort: 'averageRating',
        order: 'desc',
        limit: limit
      };
      
      return await this.getPublicDoctors(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy popular services
   * @param {number} limit 
   */
  async getPopularServices(limit = 5) {
    try {
      const filters = {
        sort: 'popularity',
        order: 'desc',
        limit: limit
      };
      
      return await this.getPublicServices(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy recent blog posts
   * @param {number} limit 
   */
  async getRecentBlogPosts(limit = 5) {
    try {
      const filters = {
        page: 1,
        pageSize: limit,
        sort: 'createdAt',
        order: 'desc'
      };
      
      return await this.getBlogPosts(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy services theo category/type
   * @param {string} category 
   */
  async getServicesByCategory(category) {
    try {
      const filters = {
        category: category
      };
      
      return await this.getPublicServices(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy doctors theo specialization
   * @param {string} specialization 
   */
  async getDoctorsBySpecialization(specialization) {
    try {
      const filters = {
        specialization: specialization
      };
      
      return await this.getPublicDoctors(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy blog posts theo category
   * @param {string} category 
   */
  async getBlogPostsByCategory(category) {
    try {
      const filters = {
        category: category
      };
      
      return await this.getBlogPosts(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy pricing information cho services
   */
  async getServicesPricing() {
    try {
      const services = await this.getPublicServices();
      
      return services.services?.map(service => ({
        id: service.id,
        serviceName: service.serviceName,
        basePrice: service.basePrice,
        successRate: service.successRate,
        durationDays: service.durationDays
      })) || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy contact information
   */
  async getContactInfo() {
    try {
      const clinicInfo = await this.getClinicInfo();
      
      return {
        name: clinicInfo.name,
        phone: clinicInfo.phone,
        email: clinicInfo.email,
        address: clinicInfo.address,
        workingHours: clinicInfo.workingHours || 'Mon-Fri: 8:00-17:00',
        emergencyContact: clinicInfo.emergencyContact || clinicInfo.phone
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy success statistics
   */
  async getSuccessStatistics() {
    try {
      const stats = await this.getClinicStats();
      
      return {
        totalPatients: stats.totalPatients || 0,
        successRate: stats.successRate || 0,
        totalDoctors: stats.totalDoctors || 0,
        yearsOfExperience: stats.yearsOfExperience || 5,
        completedTreatments: stats.completedTreatments || 0
      };
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
const guestService = new GuestService();
export default guestService; 