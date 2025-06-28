import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';

class AdminService {
  /**
   * Lấy dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.STATS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy monthly report
   * @param {number} month 
   * @param {number} year 
   */
  async getMonthlyReport(month, year) {
    try {
      const params = new URLSearchParams({ month, year }).toString();
      const endpoint = `${API_ENDPOINTS.DASHBOARD.MONTHLY_REPORT}?${params}`;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy service statistics
   */
  async getServiceStatistics() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.SERVICE_STATS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy doctor statistics
   */
  async getDoctorStatistics() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.DOCTOR_STATS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy recent appointments
   * @param {Object} filters 
   */
  async getRecentAppointments(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.DASHBOARD.RECENT_APPOINTMENTS}?${queryParams}` : 
        API_ENDPOINTS.DASHBOARD.RECENT_APPOINTMENTS;
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy feedback statistics
   */
  async getFeedbackStatistics() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.FEEDBACK_STATS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy real-time statistics
   */
  async getRealTimeStatistics() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.REAL_TIME_STATS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== MEDICAL RECORDS MANAGEMENT ==========

  /**
   * Complete appointment by doctor
   * @param {number} doctorId 
   * @param {Object} recordData 
   */
  async completeAppointment(doctorId, recordData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.MEDICAL_RECORDS.COMPLETE_APPOINTMENT(doctorId), recordData);
      return {
        success: true,
        message: 'Hoàn thành khám bệnh thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Hoàn thành khám bệnh thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Lấy medical record by appointment
   * @param {number} appointmentId 
   */
  async getMedicalRecordByAppointment(appointmentId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.MEDICAL_RECORDS.GET_BY_APPOINTMENT(appointmentId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy medical records by doctor
   * @param {number} doctorId 
   * @param {Object} filters 
   */
  async getMedicalRecordsByDoctor(doctorId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? 
        `${API_ENDPOINTS.MEDICAL_RECORDS.GET_BY_DOCTOR(doctorId)}?${queryParams}` : 
        API_ENDPOINTS.MEDICAL_RECORDS.GET_BY_DOCTOR(doctorId);
      
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== TEST RESULTS MANAGEMENT ==========

  /**
   * Tạo test result mới
   * @param {Object} testData 
   */
  async createTestResult(testData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.TEST_RESULTS.CREATE, testData);
      return {
        success: true,
        message: 'Tạo kết quả xét nghiệm thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Tạo kết quả xét nghiệm thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Upload test result file
   * @param {FormData} formData 
   */
  async uploadTestResult(formData) {
    try {
      const response = await apiService.upload(API_ENDPOINTS.TEST_RESULTS.UPLOAD, formData);
      return {
        success: true,
        message: 'Upload kết quả xét nghiệm thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Upload kết quả xét nghiệm thất bại'
      };
    }
  }

  // ========== NOTIFICATIONS MANAGEMENT ==========

  /**
   * Tạo notification mới
   * @param {Object} notificationData 
   */
  async createNotification(notificationData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.CREATE, notificationData);
      return {
        success: true,
        message: 'Tạo thông báo thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Tạo thông báo thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Tạo medication reminder
   * @param {Object} reminderData 
   */
  async createMedicationReminder(reminderData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.MEDICATION_REMINDER, reminderData);
      return {
        success: true,
        message: 'Tạo nhắc nhở uống thuốc thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Tạo nhắc nhở uống thuốc thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Tạo appointment reminder
   * @param {Object} reminderData 
   */
  async createAppointmentReminder(reminderData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.APPOINTMENT_REMINDER, reminderData);
      return {
        success: true,
        message: 'Tạo nhắc nhở lịch hẹn thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Tạo nhắc nhở lịch hẹn thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  // ========== ADVANCED DASHBOARD METHODS ==========

  /**
   * Lấy complete dashboard data
   */
  async getCompleteDashboard() {
    try {
      const [
        stats,
        serviceStats,
        doctorStats,
        feedbackStats,
        recentAppointments
      ] = await Promise.all([
        this.getDashboardStats(),
        this.getServiceStatistics(),
        this.getDoctorStatistics(),
        this.getFeedbackStatistics(),
        this.getRecentAppointments({ limit: 10 })
      ]);

      return {
        generalStats: stats,
        serviceStats: serviceStats,
        doctorStats: doctorStats,
        feedbackStats: feedbackStats,
        recentAppointments: recentAppointments,
        
        // Additional computed metrics
        occupancyRate: this.calculateOccupancyRate(stats),
        revenueGrowth: this.calculateRevenueGrowth(stats),
        patientSatisfaction: feedbackStats.averageRating || 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy analytics data cho charts
   * @param {string} timeRange - 'week', 'month', 'quarter', 'year'
   */
  async getAnalyticsData(timeRange = 'month') {
    try {
      const currentDate = new Date();
      let dateFrom, dateTo;

      switch (timeRange) {
        case 'week':
          dateFrom = new Date(currentDate.setDate(currentDate.getDate() - 7));
          dateTo = new Date();
          break;
        case 'month':
          dateFrom = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
          dateTo = new Date();
          break;
        case 'quarter':
          dateFrom = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
          dateTo = new Date();
          break;
        case 'year':
          dateFrom = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
          dateTo = new Date();
          break;
        default:
          dateFrom = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
          dateTo = new Date();
      }

      const [
        appointmentStats,
        revenueStats,
        serviceStats
      ] = await Promise.all([
        this.getAppointmentTrends(dateFrom, dateTo),
        this.getRevenueTrends(dateFrom, dateTo),
        this.getServiceUsageTrends(dateFrom, dateTo)
      ]);

      return {
        appointmentTrends: appointmentStats,
        revenueTrends: revenueStats,
        serviceUsageTrends: serviceStats,
        timeRange: timeRange,
        period: { from: dateFrom, to: dateTo }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy performance metrics cho doctors
   */
  async getDoctorPerformanceMetrics() {
    try {
      const doctorStats = await this.getDoctorStatistics();
      
      // Process doctor performance data
      const performanceMetrics = doctorStats.doctors?.map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        totalAppointments: doctor.totalAppointments || 0,
        completedAppointments: doctor.completedAppointments || 0,
        averageRating: doctor.averageRating || 0,
        completionRate: doctor.completedAppointments / (doctor.totalAppointments || 1) * 100,
        patientSatisfaction: doctor.averageRating || 0,
        revenue: doctor.revenue || 0
      })) || [];

      return {
        doctors: performanceMetrics,
        topPerformers: performanceMetrics
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 5),
        averageCompletionRate: performanceMetrics
          .reduce((sum, doctor) => sum + doctor.completionRate, 0) / 
          (performanceMetrics.length || 1)
      };
    } catch (error) {
      throw error;
    }
  }

  // ========== HELPER METHODS ==========

  /**
   * Calculate occupancy rate
   * @param {Object} stats 
   */
  calculateOccupancyRate(stats) {
    if (!stats.totalAppointments || !stats.totalCapacity) return 0;
    return (stats.totalAppointments / stats.totalCapacity) * 100;
  }

  /**
   * Calculate revenue growth
   * @param {Object} stats 
   */
  calculateRevenueGrowth(stats) {
    if (!stats.currentRevenue || !stats.previousRevenue) return 0;
    return ((stats.currentRevenue - stats.previousRevenue) / stats.previousRevenue) * 100;
  }

  /**
   * Lấy appointment trends (mock implementation)
   * @param {Date} dateFrom 
   * @param {Date} dateTo 
   */
  async getAppointmentTrends(dateFrom, dateTo) {
    try {
      const filters = {
        dateFrom: dateFrom.toISOString().split('T')[0],
        dateTo: dateTo.toISOString().split('T')[0]
      };
      
      return await this.getRecentAppointments(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy revenue trends (mock implementation)
   * @param {Date} dateFrom 
   * @param {Date} dateTo 
   */
  async getRevenueTrends(dateFrom, dateTo) {
    try {
      // This would need to be implemented based on specific revenue tracking
      const stats = await this.getDashboardStats();
      return {
        totalRevenue: stats.totalRevenue || 0,
        period: { from: dateFrom, to: dateTo }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy service usage trends (mock implementation)
   * @param {Date} dateFrom 
   * @param {Date} dateTo 
   */
  async getServiceUsageTrends(dateFrom, dateTo) {
    try {
      return await this.getServiceStatistics();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export dashboard data
   * @param {string} format - 'excel', 'pdf', 'csv'
   */
  async exportDashboardData(format = 'excel') {
    try {
      const dashboardData = await this.getCompleteDashboard();
      
      // This would typically call a specific export endpoint
      // For now, return the data that can be processed by frontend
      return {
        success: true,
        message: `Xuất dữ liệu ${format.toUpperCase()} thành công`,
        data: dashboardData,
        format: format
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Xuất dữ liệu thất bại'
      };
    }
  }
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;
