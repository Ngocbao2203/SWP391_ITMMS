// Service Registration API Service - Using treatmentService for real API calls
import { treatmentService } from "./index";

/**
 * Fetches all available services
 * @returns {Promise} Promise that resolves to an array of service objects
 */
export const getServices = async () => {
  try {
    const response = await treatmentService.getAllTreatmentServices();
    if (response && (response.success || Array.isArray(response))) {
      return Array.isArray(response) ? response : response.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

/**
 * Fetches a single service by ID
 * @param {string} serviceId - The ID of the service to fetch
 * @returns {Promise} Promise that resolves to a service object
 */
export const getServiceById = async (serviceId) => {
  try {
    const response = await treatmentService.getTreatmentServiceDetails(
      serviceId
    );
    if (response && (response.success || response.data)) {
      return response.data || response;
    }
    throw new Error("Service not found");
  } catch (error) {
    console.error(`Error fetching service with ID ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Creates an appointment for a service
 * @param {Object} appointmentData - The appointment data to submit
 * @returns {Promise} Promise that resolves to a response object
 */
export const createServiceAppointment = async (appointmentData) => {
  try {
    // Use treatmentService to make the API call
    // This is a placeholder - replace with actual API call
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create appointment");
    }

    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};
