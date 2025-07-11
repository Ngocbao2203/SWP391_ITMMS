import apiService from './api';
import { API_ENDPOINTS } from './apiConstants';

class PatientService {
  /**
   * Lấy medical history của patient
   * @param {number} customerId 
   * @param {Object} filters 
   */
  async getPatientMedicalHistory(customerId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ?
        `${API_ENDPOINTS.MEDICAL_RECORDS.GET_PATIENT_HISTORY(customerId)}?${queryParams}` :
        API_ENDPOINTS.MEDICAL_RECORDS.GET_PATIENT_HISTORY(customerId);

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy test results của patient
   * @param {number} customerId 
   * @param {Object} filters 
   */
  async getPatientTestResults(customerId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ?
        `${API_ENDPOINTS.TEST_RESULTS.GET_BY_CUSTOMER(customerId)}?${queryParams}` :
        API_ENDPOINTS.TEST_RESULTS.GET_BY_CUSTOMER(customerId);

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy treatment plans của patient
   * @param {number} customerId 
   * @param {Object} filters 
   */
  async getPatientTreatmentPlans(customerId, filters = {}) {
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
   * Lấy appointments của patient
   * @param {number} customerId 
   * @param {Object} filters 
   */
  async getPatientAppointments(customerId, filters = {}) {
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
   * Lấy notifications của patient
   * @param {number} userId 
   * @param {Object} filters 
   */
  async getPatientNotifications(userId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ?
        `${API_ENDPOINTS.NOTIFICATIONS.GET_BY_USER(userId)}?${queryParams}` :
        API_ENDPOINTS.NOTIFICATIONS.GET_BY_USER(userId);

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đánh dấu notification đã đọc
   * @param {number} notificationId 
   */
  async markNotificationAsRead(notificationId) {
    try {
      const response = await apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
      return {
        success: true,
        message: 'Đánh dấu thông báo đã đọc',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể đánh dấu thông báo'
      };
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   * @param {number} userId 
   */
  async getUnreadNotificationsCount(userId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT(userId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy dashboard data của patient
   * @param {number} customerId 
   */
  async getPatientDashboard(customerId) {
    try {
      // Gọi parallel các APIs để lấy data
      const [
        appointments,
        treatmentPlans,
        testResults,
        notifications
      ] = await Promise.all([
        this.getPatientAppointments(customerId, { limit: 5, sort: 'appointmentDate', order: 'desc' }),
        this.getPatientTreatmentPlans(customerId, { limit: 3, status: 'Active' }),
        this.getPatientTestResults(customerId, { limit: 3, sort: 'testDate', order: 'desc' }),
        this.getUnreadNotificationsCount(customerId)
      ]);

      return {
        upcomingAppointments: appointments.appointments?.filter(apt =>
          new Date(apt.appointmentDate) > new Date() &&
          ['Scheduled', 'Confirmed'].includes(apt.status)
        ).slice(0, 3) || [],

        activeTreatmentPlans: treatmentPlans.treatmentPlans?.filter(plan =>
          plan.status === 'Active'
        ) || [],

        recentTestResults: testResults.testResults?.slice(0, 3) || [],

        unreadNotifications: notifications.unreadCount || 0,

        completedAppointments: appointments.appointments?.filter(apt =>
          apt.status === 'Completed'
        ).length || 0,

        totalTreatmentPlans: treatmentPlans.treatmentPlans?.length || 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy upcoming appointments của patient
   * @param {number} customerId 
   * @param {number} days 
   */
  async getUpcomingAppointments(customerId, days = 30) {
    try {
      const fromDate = new Date();
      const toDate = new Date();
      toDate.setDate(toDate.getDate() + days);

      const filters = {
        dateFrom: fromDate.toISOString().split('T')[0],
        dateTo: toDate.toISOString().split('T')[0],
        status: 'Scheduled,Confirmed',
        sort: 'appointmentDate',
        order: 'asc'
      };

      return await this.getPatientAppointments(customerId, filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy appointment history của patient
   * @param {number} customerId 
   * @param {Object} filters 
   */
  async getAppointmentHistory(customerId, filters = {}) {
    try {
      const defaultFilters = {
        status: 'Completed,Cancelled',
        sort: 'appointmentDate',
        order: 'desc',
        ...filters
      };

      return await this.getPatientAppointments(customerId, defaultFilters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy active treatment plans của patient
   * @param {number} customerId 
   */
  async getActiveTreatmentPlans(customerId) {
    try {
      const filters = {
        status: 'Active'
      };

      return await this.getPatientTreatmentPlans(customerId, filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy treatment progress của patient
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
   * Lấy recent test results của patient
   * @param {number} customerId 
   * @param {number} limit 
   */
  async getRecentTestResults(customerId, limit = 10) {
    try {
      const filters = {
        sort: 'testDate',
        order: 'desc',
        limit: limit
      };

      return await this.getPatientTestResults(customerId, filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo feedback cho doctor sau appointment
   * @param {Object} feedbackData 
   */
  async createFeedback(feedbackData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.FEEDBACK, feedbackData);
      return {
        success: true,
        message: 'Gửi đánh giá thành công',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gửi đánh giá thất bại',
        errors: error.getValidationErrors()
      };
    }
  }

  /**
   * Lấy patient profile summary
   * @param {number} customerId 
   */
  async getPatientProfile(customerId) {
    try {
      const profile = await apiService.get(API_ENDPOINTS.AUTH.PROFILE(customerId));

      // Lấy additional info
      const [appointments, treatmentPlans] = await Promise.all([
        this.getPatientAppointments(customerId),
        this.getPatientTreatmentPlans(customerId)
      ]);

      return {
        ...profile,
        totalAppointments: appointments.appointments?.length || 0,
        completedAppointments: appointments.appointments?.filter(apt => apt.status === 'Completed').length || 0,
        activeTreatmentPlans: treatmentPlans.treatmentPlans?.filter(plan => plan.status === 'Active').length || 0,
        totalTreatmentPlans: treatmentPlans.treatmentPlans?.length || 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy medical summary của patient
   * @param {number} customerId 
   */
  async getMedicalSummary(customerId) {
    try {
      const [
        medicalHistory,
        testResults,
        treatmentPlans
      ] = await Promise.all([
        this.getPatientMedicalHistory(customerId),
        this.getPatientTestResults(customerId),
        this.getPatientTreatmentPlans(customerId)
      ]);

      return {
        medicalRecords: medicalHistory.medicalHistory || [],
        testResults: testResults.testResults || [],
        treatmentPlans: treatmentPlans.treatmentPlans || [],

        // Summary statistics
        totalMedicalRecords: medicalHistory.medicalHistory?.length || 0,
        totalTestResults: testResults.testResults?.length || 0,
        totalTreatmentPlans: treatmentPlans.treatmentPlans?.length || 0,
        activeTreatmentPlans: treatmentPlans.treatmentPlans?.filter(plan => plan.status === 'Active').length || 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tìm kiếm trong medical records của patient
   * @param {number} customerId 
   * @param {string} searchTerm 
   */
  async searchMedicalRecords(customerId, searchTerm) {
    try {
      const medicalHistory = await this.getPatientMedicalHistory(customerId);

      if (!searchTerm) return medicalHistory;

      const filteredRecords = medicalHistory.medicalHistory?.filter(record =>
        record.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.prescription?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

      return {
        medicalHistory: filteredRecords
      };
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
const patientService = new PatientService();
export default patientService;
