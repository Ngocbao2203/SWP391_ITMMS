// 🚀 DEMO: Cách sử dụng ITMMS API Services
// Đây là file demo cho các developer để hiểu cách sử dụng services

import apiServices, {
  authService,
  appointmentService,
  doctorService,
  patientService,
  treatmentService,
  guestService,
  adminService,
  formatErrorMessage,
  handleApiCall
} from './index';

// ========== DEMO 1: AUTHENTICATION FLOW ==========
export const demoAuthentication = async () => {
  console.log('🔐 Demo: Authentication Flow');
  
  try {
    // 1. Đăng ký user mới
    const registerData = {
      fullName: 'Nguyễn Văn A',
      email: 'demo@example.com',
      phone: '0123456789',
      address: '123 Đường ABC, TP.HCM',
      username: 'demuser',
      password: '123456',
      confirmPassword: '123456',
      role: 'Customer'
    };

    const registerResult = await authService.register(registerData);
    console.log('Register result:', registerResult);

    // 2. Đăng nhập
    const loginResult = await authService.login({
      email: 'demo@example.com',
      password: '123456'
    });

    if (loginResult.success) {
      console.log('✅ Login successful:', loginResult.user);
      
      // 3. Kiểm tra authentication status
      console.log('Is authenticated:', authService.isAuthenticated());
      console.log('Current user:', authService.getCurrentUser());
      console.log('Has Customer role:', authService.hasRole('Customer'));
      
      return loginResult.user;
    }
  } catch (error) {
    console.error('❌ Authentication error:', formatErrorMessage(error));
  }
};

// ========== DEMO 2: GUEST/PUBLIC FEATURES ==========
export const demoGuestFeatures = async () => {
  console.log('🌐 Demo: Guest/Public Features');
  
  try {
    // 1. Lấy thông tin trang chủ
    const homeData = await guestService.getHomePageInfo();
    console.log('Home page data:', {
      clinicName: homeData.clinicInfo?.name,
      totalDoctors: homeData.stats?.totalDoctors,
      successRate: homeData.stats?.successRate,
      featuredServices: homeData.featuredServices?.length
    });

    // 2. Lấy danh sách bác sĩ công khai
    const publicDoctors = await guestService.getPublicDoctors();
    console.log('Public doctors:', publicDoctors.doctors?.slice(0, 3));

    // 3. Lấy dịch vụ công khai
    const publicServices = await guestService.getPublicServices();
    console.log('Public services:', publicServices.services?.slice(0, 3));

    // 4. Tìm kiếm
    const searchResults = await guestService.globalSearch({
      query: 'IVF',
      type: 'service'
    });
    console.log('Search results for IVF:', searchResults);

  } catch (error) {
    console.error('❌ Guest features error:', formatErrorMessage(error));
  }
};

// ========== DEMO 3: PATIENT JOURNEY ==========
export const demoPatientJourney = async () => {
  console.log('👤 Demo: Patient Journey');
  
  // Giả sử đã login và có user
  const user = authService.getCurrentUser();
  if (!user) {
    console.log('❌ User not logged in');
    return;
  }

  try {
    const customerId = user.id;

    // 1. Tìm bác sĩ phù hợp
    const availableDoctors = await doctorService.getAvailableDoctors();
    console.log('Available doctors:', availableDoctors.doctors?.slice(0, 2));

    if (availableDoctors.doctors?.length > 0) {
      const selectedDoctor = availableDoctors.doctors[0];
      
      // 2. Kiểm tra time slots available
      const availableSlots = await doctorService.getAvailableTimeSlots(
        selectedDoctor.id,
        '2025-01-15',
        ['09:00', '17:00'],
        60
      );
      console.log('Available time slots:', availableSlots.slice(0, 3));

      // 3. Đặt lịch hẹn
      if (availableSlots.length > 0) {
        const appointmentData = {
          doctorId: selectedDoctor.id,
          appointmentDate: '2025-01-15T10:00:00',
          timeSlot: availableSlots[0],
          type: 'Consultation',
          notes: 'Khám tư vấn lần đầu'
        };

        const bookingResult = await appointmentService.bookAppointment(appointmentData);
        console.log('Booking result:', bookingResult);
      }
    }

    // 4. Lấy dashboard data
    const dashboard = await patientService.getPatientDashboard(customerId);
    console.log('Patient dashboard:', {
      upcomingAppointments: dashboard.upcomingAppointments?.length,
      activeTreatmentPlans: dashboard.activeTreatmentPlans?.length,
      unreadNotifications: dashboard.unreadNotifications
    });

    // 5. Lấy medical history
    const medicalHistory = await patientService.getPatientMedicalHistory(customerId);
    console.log('Medical history records:', medicalHistory.medicalHistory?.length);

  } catch (error) {
    console.error('❌ Patient journey error:', formatErrorMessage(error));
  }
};

// ========== DEMO 4: DOCTOR WORKFLOW ==========
export const demoDoctorWorkflow = async () => {
  console.log('👨‍⚕️ Demo: Doctor Workflow');
  
  // Giả sử đây là doctor account
  const doctorId = 1;

  try {
    // 1. Lấy lịch hẹn của doctor hôm nay
    const today = new Date().toISOString().split('T')[0];
    const doctorAppointments = await appointmentService.getDoctorAppointments(doctorId, {
      appointmentDate: today,
      status: 'Scheduled,Confirmed'
    });
    console.log('Today appointments:', doctorAppointments.appointments?.length);

    // 2. Lấy treatment plans đang quản lý
    const treatmentPlans = await treatmentService.getDoctorTreatmentPlans(doctorId, {
      status: 'Active'
    });
    console.log('Active treatment plans:', treatmentPlans.treatmentPlans?.length);

    // 3. Hoàn thành một appointment (ví dụ)
    if (doctorAppointments.appointments?.length > 0) {
      const appointment = doctorAppointments.appointments[0];
      
      const medicalRecord = {
        appointmentId: appointment.id,
        symptoms: 'Hiếm muộn, khó thụ thai trong 2 năm',
        diagnosis: 'Hiếm muộn nguyên phát',
        treatment: 'Kích thích buồng trứng, tăng cường dinh dưỡng',
        prescription: 'Clomiphene citrate 50mg x 5 ngày',
        notes: 'Bệnh nhân cần tái khám sau 1 tháng',
        followUpRequired: true,
        nextAppointmentDate: '2025-02-15T10:00:00'
      };

      const completeResult = await adminService.completeAppointment(doctorId, medicalRecord);
      console.log('Complete appointment result:', completeResult);
    }

    // 4. Lấy doctor statistics
    const doctorStats = await doctorService.getDoctorStatistics(doctorId);
    console.log('Doctor statistics:', doctorStats);

  } catch (error) {
    console.error('❌ Doctor workflow error:', formatErrorMessage(error));
  }
};

// ========== DEMO 5: ADMIN DASHBOARD ==========
export const demoAdminDashboard = async () => {
  console.log('👑 Demo: Admin Dashboard');
  
  try {
    // 1. Lấy dashboard statistics
    const dashboardStats = await adminService.getDashboardStats();
    console.log('Dashboard stats:', {
      totalCustomers: dashboardStats.totalCustomers,
      totalDoctors: dashboardStats.totalDoctors,
      totalAppointments: dashboardStats.totalAppointments,
      totalRevenue: dashboardStats.totalRevenue,
      averageRating: dashboardStats.averageRating
    });

    // 2. Lấy monthly report
    const monthlyReport = await adminService.getMonthlyReport(1, 2025);
    console.log('Monthly report (Jan 2025):', monthlyReport);

    // 3. Lấy service statistics
    const serviceStats = await adminService.getServiceStatistics();
    console.log('Service statistics:', serviceStats);

    // 4. Lấy doctor performance
    const doctorPerformance = await adminService.getDoctorPerformanceMetrics();
    console.log('Doctor performance:', {
      totalDoctors: doctorPerformance.doctors?.length,
      topPerformers: doctorPerformance.topPerformers?.slice(0, 3),
      averageCompletionRate: doctorPerformance.averageCompletionRate
    });

    // 5. Lấy analytics data
    const analyticsData = await adminService.getAnalyticsData('month');
    console.log('Analytics data (month):', analyticsData);

  } catch (error) {
    console.error('❌ Admin dashboard error:', formatErrorMessage(error));
  }
};

// ========== DEMO 6: TREATMENT MANAGEMENT ==========
export const demoTreatmentManagement = async () => {
  console.log('🩺 Demo: Treatment Management');
  
  try {
    // 1. Lấy tất cả treatment services
    const services = await treatmentService.getAllTreatmentServices();
    console.log('Available treatment services:', services.services?.slice(0, 3));

    // 2. Tìm kiếm services theo giá
    const affordableServices = await treatmentService.getTreatmentServicesByPriceRange(
      50000000, // 50 triệu
      100000000 // 100 triệu
    );
    console.log('Services in price range 50-100M:', affordableServices.services?.length);

    // 3. Tạo treatment plan (ví dụ)
    if (services.services?.length > 0) {
      const service = services.services[0];
      const user = authService.getCurrentUser();
      
      if (user) {
        const planData = {
          customerId: user.id,
          doctorId: 1,
          treatmentServiceId: service.id,
          treatmentType: service.serviceName,
          description: `Kế hoạch điều trị ${service.serviceName}`,
          startDate: '2025-01-20T00:00:00',
          totalCost: service.basePrice,
          notes: 'Kế hoạch điều trị được tùy chỉnh theo tình trạng bệnh nhân'
        };

        const createResult = await treatmentService.createTreatmentPlan(planData);
        console.log('Create treatment plan result:', createResult);
      }
    }

    // 4. Lấy popular services
    const popularServices = await treatmentService.getPopularTreatmentServices(5);
    console.log('Popular services:', popularServices.services?.map(s => s.serviceName));

  } catch (error) {
    console.error('❌ Treatment management error:', formatErrorMessage(error));
  }
};

// ========== DEMO 7: ERROR HANDLING ==========
export const demoErrorHandling = async () => {
  console.log('⚠️ Demo: Error Handling');
  
  try {
    // 1. Test validation error
    await authService.login({
      email: 'invalid-email',
      password: '123'
    });
  } catch (error) {
    console.log('Validation error example:', {
      isValidationError: error.isValidationError(),
      message: formatErrorMessage(error),
      validationErrors: error.getValidationErrors()
    });
  }

  try {
    // 2. Test not found error
    await doctorService.getDoctorDetails(99999);
  } catch (error) {
    console.log('Not found error example:', {
      isNotFoundError: error.isNotFoundError(),
      status: error.status,
      message: error.message
    });
  }

  // 3. Using handleApiCall with error handling
  const result = await handleApiCall(
    guestService.getHomePageInfo(),
    {
      showSuccess: true,
      showError: true,
      defaultMessage: 'Load home page successfully!'
    }
  );
  console.log('Handle API call result:', result?.clinicInfo?.name);
};

// ========== DEMO 8: USING FACADE ==========
export const demoFacadeUsage = async () => {
  console.log('🎭 Demo: Using API Facade');
  
  try {
    // 1. Quick login
    const loginResult = await apiServices.login('demo@example.com', '123456');
    console.log('Quick login:', loginResult.success);

    // 2. Quick search
    const searchResults = await apiServices.search('IVF', 'service');
    console.log('Quick search results:', searchResults);

    // 3. Get home data
    const homeData = await apiServices.getHomeData();
    console.log('Quick home data:', homeData.clinicInfo?.name);

    // 4. Check authentication
    console.log('Is authenticated:', apiServices.isAuthenticated());
    console.log('Has Customer role:', apiServices.hasRole('Customer'));

    // 5. Quick booking (if authenticated)
    if (apiServices.isAuthenticated()) {
      const appointmentData = {
        doctorId: 1,
        appointmentDate: '2025-01-15T10:00:00',
        timeSlot: '10:00-11:00',
        type: 'Consultation'
      };

      const bookingResult = await apiServices.bookAppointment(appointmentData);
      console.log('Quick booking result:', bookingResult);
    }

  } catch (error) {
    console.error('❌ Facade usage error:', formatErrorMessage(error));
  }
};

// ========== RUN ALL DEMOS ==========
export const runAllDemos = async () => {
  console.log('🚀 Running All ITMMS API Service Demos...\n');
  
  await demoAuthentication();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await demoGuestFeatures();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await demoPatientJourney();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await demoDoctorWorkflow();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await demoAdminDashboard();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await demoTreatmentManagement();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await demoErrorHandling();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await demoFacadeUsage();
  
  console.log('\n✅ All demos completed!');
};

// ========== USAGE EXAMPLES FOR COMPONENTS ==========

// React component example
export const ExampleComponent = () => {
  // Xem file demo này để hiểu cách integrate vào React components
  
  /*
  import React, { useState, useEffect } from 'react';
  import { authService, patientService, formatErrorMessage } from '../services';
  
  const PatientDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const loadDashboard = async () => {
        try {
          const user = authService.getCurrentUser();
          if (user) {
            const data = await patientService.getPatientDashboard(user.id);
            setDashboardData(data);
          }
        } catch (err) {
          setError(formatErrorMessage(err));
        } finally {
          setLoading(false);
        }
      };
      
      loadDashboard();
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
      <div>
        <h1>Patient Dashboard</h1>
        <p>Upcoming appointments: {dashboardData?.upcomingAppointments?.length}</p>
        <p>Active treatments: {dashboardData?.activeTreatmentPlans?.length}</p>
        <p>Unread notifications: {dashboardData?.unreadNotifications}</p>
      </div>
    );
  };
  */
};

// ========== EXPORT FOR TESTING ==========
export default {
  runAllDemos,
  demoAuthentication,
  demoGuestFeatures,
  demoPatientJourney,
  demoDoctorWorkflow,
  demoAdminDashboard,
  demoTreatmentManagement,
  demoErrorHandling,
  demoFacadeUsage
}; 