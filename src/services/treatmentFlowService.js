import { API_ENDPOINTS } from "./apiConstants";
import api from "./api";

/**
 * Service để xử lý các API liên quan đến TreatmentFlow
 */
const treatmentFlowService = {
  /**
   * Lấy thông tin dòng điều trị của một khách hàng
   * @param {number} customerId - ID của khách hàng
   * @returns {Promise<Array>} Mảng các giai đoạn điều trị
   */
  getPatientTreatmentFlow: async (customerId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.TREATMENT_FLOW.GET_BY_CUSTOMER(customerId)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching patient treatment flow:", error);
      throw error;
    }
  },
};

export default treatmentFlowService;
