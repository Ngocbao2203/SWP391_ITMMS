// API Endpoints Constants
export const API_ENDPOINTS = {
  // Authentication APIs
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    CHECK_EMAIL: "/auth/check-email",
    CHECK_USERNAME: "/auth/check-username",
    PROFILE: (userId) => `/auth/profile?id=${userId}`,
    UPDATE_PROFILE: (userId) => `/auth/profile?id=${userId}`,
    CHANGE_PASSWORD: "/auth/change-password",
    HISTORY: (userId) => `/auth/history?userId=${userId}`,
    FEEDBACK: "/auth/feedback",
    TEST: "/auth/test",
  },

  // Appointments APIs
  APPOINTMENTS: {
    BASE: "/appointments",
    CREATE: "/appointments", // Sửa thành chữ thường để nhất quán
    GET_BY_ID: (id) => `/appointments/${id}`,
    DELETE: (id) => `/appointments/${id}`, // Sửa thành chữ thường
    GET_MY_APPOINTMENTS: "/appointments/my-appointments", // Sửa thành chữ thường
    GET_BY_CUSTOMER: (customerId) => `/appointments/customer/${customerId}`, // Sửa thành chữ thường
    GET_BY_DOCTOR: (doctorId) => `/appointments/doctor/${doctorId}`, // Sửa thành chữ thường
    GET_MY_SCHEDULE: "/appointments/my-schedule", // Sửa thành chữ thường
    GET_AVAILABLE_SLOTS: "/appointments/available-slots", // Đã đúng, giữ nguyên
    UPDATE_STATUS: (id) => `/appointments/${id}/status`, // Sửa thành chữ thường
    RESCHEDULE: (id) => `/appointments/${id}/reschedule`, // Thêm lại
    CANCEL: (id) => `/appointments/${id}/cancel`, // Thêm lại
    CONFIRM: (id) => `/appointments/${id}/confirm`, // Thêm lại
    UPDATE: (id) => `/appointments/${id}`, // Thêm lại
    GET_ALL: "/appointments", // Thêm lại
    TEST: "/appointments/test", // Thêm lại
  },

  // Doctors APIs
  DOCTORS: {
    BASE: "/doctors",
    GET_ALL: "/doctors",
    GET_ALL_MANAGEMENT: "/doctors/management",
    GET_ALL_MANAGEMENT_BY_ID: (id) => `/doctors/management/${id}`,
    GET_BY_ID: (id) => `/doctors/${id}`,
    CREATE: "/doctors",
    UPDATE: (id) => `/doctors/${id}`,
    SEARCH: "/doctors/search",
    GET_FEEDBACK: (id) => `/doctors/${id}/feedback`,
    GET_APPOINTMENTS: (id) => `/doctors/${id}/appointments`,
    GET_AVAILABLE: "/doctors/available",
    UPDATE_AVAILABILITY: (id) => `/doctors/${id}/availability`,
    UPDATE_MANAGEMENT_TOGGLE_AVAILABILITY: (id) => `/doctors/management/${id}/toggle-availability`,
    GET_SCHEDULE: (id) => `/doctors/${id}/schedule`,
    MY_SCHEDULE: "/doctors/my-schedule",
    TEST: "/doctors/test",
  },

  // Treatment Services APIs
  TREATMENT_SERVICES: {
    BASE: "/treatmentservices",
    GET_ALL: "/treatmentservices",
    GET_BY_ID: (id) => `/treatmentservices/${id}`,
    CREATE: "/treatmentservices",
    UPDATE: (id) => `/treatmentservices/${id}`,
    DELETE: (id) => `/treatmentservices/${id}`,
    SEARCH: "/treatmentservices/search",
    PRICING: "/treatmentservices/pricing",
    TEST: "/treatmentservices/test",
  },

  // Treatment Plans APIs
  TREATMENT_PLANS: {
    BASE: "/TreatmentPlans",
    CREATE: "/TreatmentPlans",
    GET_BY_CUSTOMER: (customerId) => `/TreatmentPlans/customer/${customerId}`,
    GET_BY_DOCTOR: (doctorId) => `/TreatmentPlans/doctor/${doctorId}`,
    GET_BY_ID: (id) => `/TreatmentPlans/${id}`,
    UPDATE: (id) => `/TreatmentPlans/${id}`,
    UPDATE_PROGRESS: (id) => `/TreatmentPlans/${id}/progress`,
    GET_PROGRESS: (id) => `/TreatmentPlans/${id}/progress`,
    COMPLETE: (id) => `/TreatmentPlans/${id}/complete`,
    TEST: "/TreatmentPlans/test",
  },

  // Medical Records APIs
  MEDICAL_RECORDS: {
    BASE: "/MedicalRecords",
    COMPLETE_APPOINTMENT: (doctorId) => `/MedicalRecords/complete/${doctorId}`,
    GET_BY_APPOINTMENT: (appointmentId) =>
      `/MedicalRecords/appointment/${appointmentId}`,
    GET_PATIENT_HISTORY: (customerId) =>
      `/MedicalRecords/patient/${customerId}/history`,
    GET_BY_DOCTOR: (doctorId) => `/MedicalRecords/doctor/${doctorId}`,
    TEST: "/MedicalRecords/test",
  },

  // Test Results APIs
  TEST_RESULTS: {
    BASE: "/testresults",
    CREATE: "/testresults/create",
    GET_BY_CUSTOMER: (customerId) => `/testresults/customer/${customerId}`,
    GET_BY_ID: (id) => `/testresults/${id}`,
    UPLOAD: "/testresults/upload",
    TEST: "/testresults/test",
  },

  // Notifications APIs
  NOTIFICATIONS: {
    BASE: "/notifications",
    GET_BY_USER: (userId) => `/notifications/user/${userId}`,
    CREATE: "/notifications/create",
    MARK_READ: (id) => `/notifications/${id}/read`,
    MEDICATION_REMINDER: "/notifications/medication-reminder",
    APPOINTMENT_REMINDER: "/notifications/appointment-reminder",
    UNREAD_COUNT: (userId) => `/notifications/unread-count/${userId}`,
    TEST: "/notifications/test",
  },

  // Guest/Public APIs
  GUEST: {
    BASE: "/guest",
    HOME: "/guest/home",
    SERVICES: "/guest/services",
    SERVICE_DETAILS: (id) => `/guest/services/${id}`,
    DOCTORS: "/guest/doctors",
    DOCTOR_DETAILS: (id) => `/guest/doctors/${id}`,
    DOCTOR_REVIEWS: (id) => `/guest/doctors/${id}/reviews`,
    BLOG: "/guest/blog",
    BLOG_POST: (id) => `/guest/blog/${id}`,
    BLOG_CATEGORIES: "/guest/blog/categories",
    SEARCH: "/guest/search",
  },

  // Blog APIs
  BLOG: {
    BASE: "/blog",
    GET_ALL: "/blog",
    GET_BY_ID: (id) => `/blog/${id}`,
    CREATE: "/blog/create",
    UPDATE: (id) => `/blog/update/${id}`,
    DELETE: (id) => `/blog/delete/${id}`,
  },
  // Dashboard APIs (Admin/Manager)
  DASHBOARD: {
    BASE: "/dashboard",
    STATS: "/dashboard/stats",
    MONTHLY_REPORT: "/dashboard/monthly-report",
    SERVICE_STATS: "/dashboard/service-stats",
    DOCTOR_STATS: "/dashboard/doctor-stats",
    RECENT_APPOINTMENTS: "/dashboard/recent-appointments",
    FEEDBACK_STATS: "/dashboard/feedback-stats",
    REAL_TIME_STATS: "/dashboard/real-time-stats",
  },
};

// User Roles
export const USER_ROLES = {
  GUEST: "Guest",
  CUSTOMER: "Customer",
  DOCTOR: "Doctor",
  MANAGER: "Manager",
  ADMIN: "Admin",
};

// Appointment Types
export const APPOINTMENT_TYPES = {
  CONSULTATION: "Consultation",
  TREATMENT: "Treatment",
  FOLLOW_UP: "Follow-up",
  CHECK_UP: "Check-up",
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: "Scheduled",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};

// Treatment Plan Status
export const TREATMENT_PLAN_STATUS = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Test Result Status
export const TEST_RESULT_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  APPOINTMENT_REMINDER: "AppointmentReminder",
  MEDICATION_REMINDER: "MedicationReminder",
  TEST_RESULT: "TestResult",
  TREATMENT_UPDATE: "TreatmentUpdate",
  GENERAL: "General",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Query Parameters
export const QUERY_PARAMS = {
  PAGE: "page",
  PAGE_SIZE: "pageSize",
  SEARCH: "search",
  SORT: "sort",
  ORDER: "order",
  STATUS: "status",
  DATE_FROM: "dateFrom",
  DATE_TO: "dateTo",
  AVAILABLE: "available",
  SPECIALIZATION: "specialization",
  MIN_PRICE: "minPrice",
  MAX_PRICE: "maxPrice",
  TYPE: "type",
  KEYWORD: "keyword",
};
