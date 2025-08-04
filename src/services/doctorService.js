import apiService from "./api";
import { API_ENDPOINTS } from "./apiConstants";

class DoctorService {
  /**
   * Lấy tất cả doctors
   * @param {Object} filters - Bộ lọc
   */
  async getAllDoctors(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${API_ENDPOINTS.DOCTORS.GET_ALL}?${queryParams}`
        : API_ENDPOINTS.DOCTORS.GET_ALL;

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getAllManagement() {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.DOCTORS.GET_ALL_MANAGEMENT
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thông tin bác sĩ quản lý theo ID
   * @param {number|string} id
   */
  async getManagementById(id) {
    try {
      const endpoint = API_ENDPOINTS.DOCTORS.GET_ALL_MANAGEMENT_BY_ID(id);
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async uploadDoctorAvatar(id, file) {
    try {
      const formData = new FormData();
      formData.append("doctorId", id); // Thêm doctorId vào FormData
      formData.append("file", file);

      console.log(
        "FormData entries in doctorService:",
        Array.from(formData.entries())
      );

      const response = await apiService.post(
        API_ENDPOINTS.DOCTORS.UPLOAD_AVATAR(id),
        formData
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateManagementAvailability(managerId, isAvailable) {
    try {
      console.log(
        "Starting updateManagementAvailability for managerId:",
        managerId,
        "with isAvailable:",
        isAvailable
      );
      const response = await apiService.put(
        API_ENDPOINTS.DOCTORS.UPDATE_MANAGEMENT_TOGGLE_AVAILABILITY(managerId),
        { isAvailable }
      );
      console.log("Response from API:", response);
      return {
        success: true,
        message: "Cập nhật trạng thái quản lý thành công",
        data: response,
      };
    } catch (error) {
      console.error("Error caught in updateManagementAvailability:", error);
      return {
        success: false,
        message: error.message || "Cập nhật trạng thái quản lý thất bại",
        errors: error.response?.data?.errors || [],
      };
    }
  }
  /**
   * Lấy chi tiết doctor
   * @param {number} doctorId
   */
  async getDoctorDetails(doctorId) {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.DOCTORS.GET_BY_ID(doctorId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo profile doctor mới (Admin/Manager)
   * @param {Object} doctorData
   */
  async createDoctor(doctorData) {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.DOCTORS.CREATE,
        doctorData
      );
      return {
        success: true,
        message: "Tạo profile bác sĩ thành công",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Tạo profile bác sĩ thất bại",
        errors: error.getValidationErrors(),
      };
    }
  }

  /**
   * Cập nhật profile doctor
   * @param {number} doctorId
   * @param {Object} updateData
   */
  async updateDoctor(doctorId, updateData) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.DOCTORS.UPDATE(doctorId),
        updateData
      );
      return {
        success: true,
        message: "Cập nhật profile bác sĩ thành công",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Cập nhật profile bác sĩ thất bại",
        errors: error.getValidationErrors(),
      };
    }
  }
  /**
   * Cập nhật trạng thái isAvailable cho bác sĩ
   * @param {number} doctorId
   * @param {boolean} isAvailable
   */
  async updateDoctorAvailability(doctorId, isAvailable) {
    try {
      console.log("Sending PUT data:", JSON.stringify({ isAvailable }));
      const response = await apiService.put(
        API_ENDPOINTS.DOCTORS.UPDATE_AVAILABILITY(doctorId),
        { isAvailable }
      );
      return {
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Cập nhật trạng thái thất bại",
        errors: error.getValidationErrors?.(),
      };
    }
  }

  /**
   * Tìm kiếm doctors
   * @param {Object} searchParams
   */
  async searchDoctors(searchParams = {}) {
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const endpoint = `${API_ENDPOINTS.DOCTORS.SEARCH}?${queryParams}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy doctors available
   * @param {Object} filters
   */
  async getAvailableDoctors(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${API_ENDPOINTS.DOCTORS.GET_AVAILABLE}?${queryParams}`
        : API_ENDPOINTS.DOCTORS.GET_AVAILABLE;

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy feedback của doctor
   * @param {number} doctorId
   * @param {Object} filters
   */
  async getDoctorFeedback(doctorId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${API_ENDPOINTS.DOCTORS.GET_FEEDBACK(doctorId)}?${queryParams}`
        : API_ENDPOINTS.DOCTORS.GET_FEEDBACK(doctorId);

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy appointments của doctor
   * @param {number} doctorId
   * @param {Object} filters
   */
  async getDoctorAppointments(doctorId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${API_ENDPOINTS.DOCTORS.GET_APPOINTMENTS(doctorId)}?${queryParams}`
        : API_ENDPOINTS.DOCTORS.GET_APPOINTMENTS(doctorId);

      const response = await apiService.get(endpoint);
      return response;
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
      return await this.searchDoctors({ specialization });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy top rated doctors
   * @param {number} limit
   */
  async getTopRatedDoctors(limit = 10) {
    try {
      const filters = {
        sort: "averageRating",
        order: "desc",
        limit: limit,
      };

      return await this.getAllDoctors(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra doctor có available trong thời gian không
   * @param {number} doctorId
   * @param {string} date
   * @param {string} timeSlot
   */
  async checkDoctorAvailability(doctorId, date, timeSlot) {
    try {
      const filters = {
        appointmentDate: date,
        timeSlot: timeSlot,
        status: "Scheduled,Confirmed",
      };

      const appointments = await this.getDoctorAppointments(doctorId, filters);
      return {
        available:
          !appointments.appointments || appointments.appointments.length === 0,
        conflictingAppointments: appointments.appointments || [],
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy lịch làm việc của doctor
   * @param {number} doctorId
   * @param {string} date - Optional date parameter (YYYY-MM-DD)
   */
  async getDoctorSchedule(doctorId, date = null) {
    try {
      // Sử dụng endpoint mới được hiển thị trong Swagger
      let endpoint = API_ENDPOINTS.DOCTORS.GET_SCHEDULE(doctorId);

      // Thêm tham số ngày nếu có
      if (date) {
        endpoint += `?date=${date}`;
      }

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching doctor schedule: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy lịch làm việc của doctor hiện tại (đang đăng nhập)
   * @param {Object} filters - Optional filters (date, status, etc.)
   */
  async getMySchedule(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${API_ENDPOINTS.DOCTORS.MY_SCHEDULE}?${queryParams}`
        : API_ENDPOINTS.DOCTORS.MY_SCHEDULE;

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching my schedule: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy statistics của doctor
   * @param {number} doctorId
   * @param {Object} filters
   */
  async getDoctorStatistics(doctorId, filters = {}) {
    try {
      // Lấy tất cả appointments
      const appointments = await this.getDoctorAppointments(doctorId, filters);

      // Lấy feedback
      const feedback = await this.getDoctorFeedback(doctorId);

      // Tính toán statistics
      const stats = {
        totalAppointments: appointments.appointments?.length || 0,
        completedAppointments:
          appointments.appointments?.filter((apt) => apt.status === "Completed")
            .length || 0,
        cancelledAppointments:
          appointments.appointments?.filter((apt) => apt.status === "Cancelled")
            .length || 0,
        averageRating: feedback.averageRating || 0,
        totalReviews: feedback.reviews?.length || 0,
        patientCount:
          new Set(appointments.appointments?.map((apt) => apt.customerId))
            .size || 0,
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo time slots available cho doctor
   * @param {number} doctorId
   * @param {string} date
   * @param {Array} workingHours - ['09:00', '17:00']
   * @param {number} slotDuration - minutes
   */
  async getAvailableTimeSlots(
    doctorId,
    date,
    workingHours = ["09:00", "17:00"],
    slotDuration = 60
  ) {
    try {
      // Lấy appointments trong ngày
      const appointments = await this.getDoctorAppointments(doctorId, {
        appointmentDate: date,
        status: "Scheduled,Confirmed",
      });

      const bookedSlots =
        appointments.appointments?.map((apt) => apt.timeSlot) || [];

      // Tạo tất cả time slots trong working hours
      const [startHour, startMinute] = workingHours[0].split(":").map(Number);
      const [endHour, endMinute] = workingHours[1].split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      const availableSlots = [];

      for (let time = startTime; time < endTime; time += slotDuration) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const timeSlot = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}-${Math.floor((time + slotDuration) / 60)
          .toString()
          .padStart(2, "0")}:${((time + slotDuration) % 60)
          .toString()
          .padStart(2, "0")}`;

        if (!bookedSlots.includes(timeSlot)) {
          availableSlots.push(timeSlot);
        }
      }

      return availableSlots;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Test connection
   */
  async testConnection() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DOCTORS.TEST);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
const doctorService = new DoctorService();
export default doctorService;
