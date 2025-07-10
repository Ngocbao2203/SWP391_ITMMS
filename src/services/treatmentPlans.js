import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';

/**
 * Class quản lý các hoạt động liên quan đến kế hoạch điều trị
 */
class TreatmentPlans {
  /**
   * Lấy thông tin kế hoạch điều trị theo ID
   * @param {string|number} id - ID của kế hoạch điều trị
   * @returns {Promise<Object>} Thông tin kế hoạch điều trị
   * @throws {Error} Khi id không hợp lệ hoặc không tìm thấy
   */
  async getById(id) {
    try {
      if (!id) throw new Error('ID kế hoạch điều trị không được để trống');
      
      const response = await apiService.get(API_ENDPOINTS.TREATMENT_PLANS.GET_BY_ID(id));
      
      if (!response.data) {
        throw new Error('Không tìm thấy kế hoạch điều trị');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin kế hoạch điều trị thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin kế hoạch điều trị',
        error: error
      };
    }
  }

  /**
   * Tạo mới kế hoạch điều trị
   * @param {Object} data - Dữ liệu kế hoạch điều trị mới
   * @param {number} data.customerId - ID của khách hàng
   * @param {number} data.doctorId - ID của bác sĩ
   * @param {number} data.treatmentServiceId - ID của dịch vụ điều trị
   * @param {string} data.description - Mô tả kế hoạch
   * @returns {Promise<Object>} Kết quả tạo kế hoạch
   */
  async createTreatmentPlan(data) {
    try {
      // Validate required fields
      const requiredFields = ['customerId', 'doctorId', 'treatmentServiceId', 'description'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Các trường sau không được để trống: ${missingFields.join(', ')}`);
      }

      const response = await apiService.post(API_ENDPOINTS.TREATMENT_PLANS.CREATE, data);
      
      return {
        success: true,
        data: response.data,
        message: 'Tạo kế hoạch điều trị thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Lỗi khi tạo kế hoạch điều trị',
        error: error
      };
    }
  }

  /**
   * Lấy danh sách kế hoạch điều trị theo customer
   * @param {string|number} customerId - ID của khách hàng
   * @returns {Promise<Object>} Danh sách kế hoạch điều trị
   */
  async getByCustomer(customerId) {
    try {
      if (!customerId) throw new Error('ID khách hàng không được để trống');

      const response = await apiService.get(API_ENDPOINTS.TREATMENT_PLANS.GET_BY_CUSTOMER(customerId));
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách kế hoạch điều trị thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách kế hoạch điều trị',
        error: error
      };
    }
  }

  /**
   * Cập nhật tiến trình kế hoạch điều trị
   * @param {string|number} id - ID của kế hoạch điều trị
   * @param {Object} data - Dữ liệu cập nhật
   * @param {string} data.phaseDescription - Mô tả giai đoạn hiện tại
   * @param {Date} data.nextPhaseDate - Ngày của giai đoạn tiếp theo
   * @param {Date} data.nextVisitDate - Ngày tái khám tiếp theo
   * @param {string} data.notes - Ghi chú bổ sung
   */
  async updateProgress(id, data) {
    try {
      if (!id) throw new Error('ID kế hoạch điều trị không được để trống');
      if (!data) throw new Error('Dữ liệu cập nhật không được để trống');

      const response = await apiService.put(API_ENDPOINTS.TREATMENT_PLANS.UPDATE_PROGRESS(id), data);
      
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật tiến trình điều trị thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Lỗi khi cập nhật tiến trình điều trị',
        error: error
      };
    }
  }

  /**
   * Lấy kế hoạch điều trị đang hoạt động của khách hàng
   * @param {string|number} customerId - ID của khách hàng
   * @returns {Promise<Object>} Kế hoạch điều trị đang hoạt động
   */
  async getActiveByCustomer(customerId) {
    try {
      if (!customerId) throw new Error('ID khách hàng không được để trống');

      const response = await apiService.get(API_ENDPOINTS.TREATMENT_PLANS.GET_BY_CUSTOMER(customerId));
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy kế hoạch điều trị đang hoạt động thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Lỗi khi lấy kế hoạch điều trị đang hoạt động',
        error: error
      };
    }
  }

  /**
   * Hoàn thành kế hoạch điều trị
   * @param {string|number} id - ID của kế hoạch điều trị
   * @returns {Promise<Object>} Kết quả hoàn thành
   */
  async complete(id) {
    try {
      if (!id) throw new Error('ID kế hoạch điều trị không được để trống');

      const response = await apiService.put(API_ENDPOINTS.TREATMENT_PLANS.COMPLETE(id));
      
      return {
        success: true,
        data: response.data,
        message: 'Hoàn thành kế hoạch điều trị thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Lỗi khi hoàn thành kế hoạch điều trị',
        error: error
      };
    }
  }
}

// Export singleton instance
const treatmentPlans = new TreatmentPlans();
export default treatmentPlans;