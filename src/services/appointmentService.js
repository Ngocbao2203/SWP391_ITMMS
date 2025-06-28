import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';

class AppointmentService {
  /**
   * Đặt lịch hẹn mới
   * @param {Object} appointmentData - Dữ liệu lịch hẹn
   */
  async bookAppointment(appointmentData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
      return {
        success: true,
        message: 'Đặt lịch hẹn thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Đặt lịch hẹn thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Lấy tất cả lịch hẹn
   * @param {Object} filters - Bộ lọc
   */
  async getAllAppointments(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.APPOINTMENTS.GET_ALL}?${queryParams}` : 
        API_ENDPOINTS.APPOINTMENTS.GET_ALL;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết lịch hẹn
   * @param {number} appointmentId 
   */
  async getAppointmentDetails(appointmentId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(appointmentId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy lịch hẹn của customer
   * @param {number} customerId 
   * @param {Object} filters - Bộ lọc (status, date, etc.)
   */
  async getCustomerAppointments(customerId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.APPOINTMENTS.GET_BY_CUSTOMER(customerId)}?${queryParams}` : 
        API_ENDPOINTS.APPOINTMENTS.GET_BY_CUSTOMER(customerId);
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy lịch hẹn của doctor
   * @param {number} doctorId 
   * @param {Object} filters - Bộ lọc
   */
  async getDoctorAppointments(doctorId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.APPOINTMENTS.GET_BY_DOCTOR(doctorId)}?${queryParams}` : 
        API_ENDPOINTS.APPOINTMENTS.GET_BY_DOCTOR(doctorId);
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật lịch hẹn
   * @param {number} appointmentId 
   * @param {Object} updateData 
   */
  async updateAppointment(appointmentId, updateData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.APPOINTMENTS.UPDATE(appointmentId), updateData);
      return {
        success: true,
        message: 'Cập nhật lịch hẹn thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cập nhật lịch hẹn thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Hủy lịch hẹn
   * @param {number} appointmentId 
   */
  async cancelAppointment(appointmentId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.APPOINTMENTS.DELETE(appointmentId));
      return {
        success: true,
        message: 'Hủy lịch hẹn thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Hủy lịch hẹn thất bại'
      };
    }
  }

  /**
   * Xác nhận lịch hẹn
   * @param {number} appointmentId 
   */
  async confirmAppointment(appointmentId) {
    try {
      const response = await this.updateAppointment(appointmentId, { status: 'Confirmed' });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Hoàn thành lịch hẹn
   * @param {number} appointmentId 
   */
  async completeAppointment(appointmentId) {
    try {
      const response = await this.updateAppointment(appointmentId, { status: 'Completed' });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đánh dấu no-show
   * @param {number} appointmentId 
   */
  async markNoShow(appointmentId) {
    try {
      const response = await this.updateAppointment(appointmentId, { status: 'No Show' });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy lịch hẹn sắp tới của customer
   * @param {number} customerId 
   * @param {number} days - Số ngày tới
   */
  async getUpcomingAppointments(customerId, days = 7) {
    try {
      const fromDate = new Date();
      const toDate = new Date();
      toDate.setDate(toDate.getDate() + days);

      const filters = {
        dateFrom: fromDate.toISOString().split('T')[0],
        dateTo: toDate.toISOString().split('T')[0],
        status: 'Scheduled,Confirmed'
      };

      return await this.getCustomerAppointments(customerId, filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy lịch sử lịch hẹn của customer
   * @param {number} customerId 
   */
  async getAppointmentHistory(customerId) {
    try {
      const filters = {
        status: 'Completed,Cancelled',
        sort: 'appointmentDate',
        order: 'desc'
      };

      return await this.getCustomerAppointments(customerId, filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra slot thời gian có available không
   * @param {number} doctorId 
   * @param {string} appointmentDate 
   * @param {string} timeSlot 
   */
  async checkTimeSlotAvailability(doctorId, appointmentDate, timeSlot) {
    try {
      const filters = {
        appointmentDate: appointmentDate.split('T')[0],
        timeSlot: timeSlot,
        status: 'Scheduled,Confirmed'
      };

      const appointments = await this.getDoctorAppointments(doctorId, filters);
      return {
        available: !appointments.appointments || appointments.appointments.length === 0,
        conflictingAppointments: appointments.appointments || []
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
      const response = await apiService.get(API_ENDPOINTS.APPOINTMENTS.TEST);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
const appointmentService = new AppointmentService();
export default appointmentService; 