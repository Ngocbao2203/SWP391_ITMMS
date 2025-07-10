import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';
import dayjs from 'dayjs'; // Thư viện để xử lý ngày giờ, nếu có

// Hàm format ngày giờ (có thể tách ra file riêng nếu dùng nhiều nơi)
const formatDateTimeForAPI = (dateString) => {
  try {
    // Ưu tiên dùng dayjs nếu có
    if (typeof dayjs !== 'undefined') {
      return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss');
    }

    // Fallback dùng Date object
    const date = new Date(dateString);
    const pad = (num) => num.toString().padStart(2, '0');

    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join('-') + 'T' + [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds())
    ].join(':');
  } catch (error) {
    console.error('Lỗi định dạng ngày:', error);
    return dateString; // Trả về nguyên bản nếu không format được
  }
};
class AppointmentService {
  /**
   * Đặt lịch hẹn mới
   * @param {Object} appointmentData - Dữ liệu lịch hẹn
   */
  async bookAppointment(appointmentData) {
    try {
      // 👇 Đảm bảo dùng đúng endpoint CREATE
      const response = await apiService.post(
        API_ENDPOINTS.APPOINTMENTS.CREATE, // '/api/Appointments'
        {
          ...appointmentData,
          // 👇 Format lại dữ liệu theo yêu cầu API
          appointmentDate: dayjs(appointmentData.appointmentDate).format('YYYY-MM-DDTHH:mm:ss'),
          notes: appointmentData.notes || ""
        }
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('🔥 Lỗi đặt lịch:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Đặt lịch thất bại',
        errors: error.response?.data?.errors || []
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
      const endpoint = queryParams
        ? `${API_ENDPOINTS.APPOINTMENTS.GET_ALL}?${queryParams}`
        : API_ENDPOINTS.APPOINTMENTS.GET_ALL;
      return await apiService.get(endpoint);
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
      return await apiService.get(
        API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(appointmentId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy lịch hẹn của customer
   * @param {number} customerId
   * @param {Object} filters - Bộ lọc
   */
  async getCustomerAppointments(customerId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${API_ENDPOINTS.APPOINTMENTS.GET_BY_CUSTOMER(
            customerId
          )}?${queryParams}`
        : API_ENDPOINTS.APPOINTMENTS.GET_BY_CUSTOMER(customerId);
      return await apiService.get(endpoint);
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
      const endpoint = queryParams
        ? `${API_ENDPOINTS.APPOINTMENTS.GET_BY_DOCTOR(doctorId)}?${queryParams}`
        : API_ENDPOINTS.APPOINTMENTS.GET_BY_DOCTOR(doctorId);
      return await apiService.get(endpoint);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy các slot thời gian trống
   * @param {number} doctorId
   * @param {string} date - Ngày cần kiểm tra (YYYY-MM-DD)
   */
  async getAvailableSlots(doctorId, date) {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.APPOINTMENTS.GET_AVAILABLE_SLOTS,
        {
          params: { doctorId, date } // Truyền params đúng cách
        }
      );
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy khung giờ:', {
        url: error.config?.url,
        params: error.config?.params,
        error: error.response?.data
      });
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
      const response = await apiService.put(
        API_ENDPOINTS.APPOINTMENTS.UPDATE(appointmentId),
        updateData
      );
      return {
        success: true,
        message: "Cập nhật lịch hẹn thành công",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Cập nhật lịch hẹn thất bại",
        errors: error.getValidationErrors?.() || [],
      };
    }
  }

  /**
   * Đổi lịch hẹn
   * @param {number} appointmentId
   * @param {Object} rescheduleData - Dữ liệu đổi lịch (date, timeSlot)
   */
  async rescheduleAppointment(appointmentId, rescheduleData) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.APPOINTMENTS.RESCHEDULE(appointmentId),
        rescheduleData
      );
      return {
        success: true,
        message: "Đổi lịch hẹn thành công",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Đổi lịch hẹn thất bại",
        errors: error.getValidationErrors?.() || [],
      };
    }
  }

  /**
   * Hủy lịch hẹn
   * @param {number} appointmentId
   */
  async cancelAppointment(appointmentId) {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.APPOINTMENTS.CANCEL(appointmentId)
      );
      return {
        success: true,
        message: "Hủy lịch hẹn thành công",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Hủy lịch hẹn thất bại",
        errors: error.getValidationErrors?.() || [],
      };
    }
  }

  /**
   * Xác nhận lịch hẹn
   * @param {number} appointmentId
   */
  async confirmAppointment(appointmentId) {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.APPOINTMENTS.CONFIRM(appointmentId)
      );
      return {
        success: true,
        message: "Xác nhận lịch hẹn thành công",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Xác nhận lịch hẹn thất bại",
        errors: error.getValidationErrors?.() || [],
      };
    }
  }

  /**
   * Hoàn thành lịch hẹn
   * @param {number} appointmentId 
   */
  async completeAppointment(appointmentId) {
    try {
      return await this.updateAppointment(appointmentId, { status: 'Completed' });
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
      return await this.updateAppointment(appointmentId, { status: "No Show" });
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
        dateFrom: fromDate.toISOString().split("T")[0],
        dateTo: toDate.toISOString().split("T")[0],
        status: "Scheduled,Confirmed",
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
        status: "Completed,Cancelled,No Show",
        sort: "appointmentDate",
        order: "desc",
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
      const slots = await this.getAvailableSlots(
        doctorId,
        appointmentDate.split("T")[0]
      );
      const isAvailable = slots.availableSlots?.includes(timeSlot) || false;
      return {
        available: isAvailable,
        conflictingAppointments: isAvailable ? [] : slots.appointments || [],
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
      return await apiService.get(API_ENDPOINTS.APPOINTMENTS.TEST);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái lịch hẹn
   * @param {number} appointmentId - ID của lịch hẹn
   * @param {string} status - Trạng thái mới (SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
   */
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(appointmentId),
        { status: status } // Gửi status đúng định dạng như đã nhận từ form
      );
      return {
        success: true,
        message: "Cập nhật trạng thái lịch hẹn thành công",
        data: response,
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      return {
        success: false,
        message: error.message || "Cập nhật trạng thái lịch hẹn thất bại",
        errors: error.getValidationErrors?.() || [],
      };
    }
  }

  /**
   * Lấy lịch làm việc của bác sĩ đang đăng nhập
   * @param {Object} filters - Bộ lọc (date, status, etc.)
   */
  async getMySchedule(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${API_ENDPOINTS.APPOINTMENTS.GET_MY_SCHEDULE}?${queryParams}`
        : API_ENDPOINTS.APPOINTMENTS.GET_MY_SCHEDULE;

      return await apiService.get(endpoint);
    } catch (error) {
      console.error(`Error fetching my schedule: ${error.message}`);
      throw error;
    }
  }
}

// Export singleton instance
const appointmentService = new AppointmentService();
export default appointmentService;
