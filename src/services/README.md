# 🚀 ITMMS API Services - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Bộ API Services hoàn chỉnh cho hệ thống ITMMS (Infertility Treatment Management Medical System) với các tính năng:

- ✅ **8 Services chính** cho tất cả modules
- ✅ **Error handling** thống nhất 
- ✅ **Type safety** và validation
- ✅ **Utility functions** hỗ trợ
- ✅ **Clean architecture** dễ maintain
- ✅ **Documentation** đầy đủ

## 🏗️ Cấu Trúc Services

```
src/services/
├── api.js                 # Base HTTP client
├── apiConstants.js        # API endpoints & constants
├── authService.js         # Authentication & user management
├── appointmentService.js  # Appointment booking & management
├── doctorService.js       # Doctor profiles & schedules
├── patientService.js      # Patient data & medical history
├── treatmentService.js    # Treatment services & plans
├── guestService.js        # Public/guest APIs
├── adminService.js        # Admin dashboard & management
├── index.js              # Export all services + utilities
└── README.md             # This file
```

## 🚀 Quick Start

### 1. Cấu Hình Environment

Tạo file `.env` trong root project:

```env
REACT_APP_API_URL=http://localhost:5037
```

### 2. Import Services

```javascript
// Import tất cả services
import {
  authService,
  appointmentService,
  doctorService,
  patientService,
  treatmentService,
  guestService,
  adminService,
  apiServiceFacade
} from './services';

// Hoặc import facade để dùng nhanh
import apiServices from './services';
```

### 3. Sử Dụng Cơ Bản

```javascript
// Login nhanh
const result = await apiServices.login('user@example.com', '123456');

// Đặt lịch hẹn
const appointment = await apiServices.bookAppointment({
  doctorId: 1,
  appointmentDate: '2025-01-15T10:00:00',
  timeSlot: '10:00-11:00',
  type: 'Consultation'
});

// Lấy dashboard data
const dashboardData = await apiServices.getPatientDashboard(customerId);
```

## 🔐 Authentication Service

### Login & Registration

```javascript
import { authService } from './services';

// Đăng nhập
const loginResult = await authService.login({
  email: 'user@example.com',
  password: '123456'
});

if (loginResult.success) {
  console.log('User:', loginResult.user);
  // User được tự động lưu vào localStorage
}

// Đăng ký
const registerResult = await authService.register({
  fullName: 'Nguyen Van A',
  email: 'user@example.com',
  phone: '0123456789',
  address: '123 Main Street',
  username: 'username',
  password: '123456',
  confirmPassword: '123456',
  role: 'Customer'
});
```

### User Management

```javascript
// Kiểm tra authentication
if (authService.isAuthenticated()) {
  const currentUser = authService.getCurrentUser();
  console.log('Current user:', currentUser);
}

// Kiểm tra role
if (authService.hasRole('Doctor')) {
  // Show doctor features
}

if (authService.hasRole(['Admin', 'Manager'])) {
  // Show admin features
}

// Cập nhật profile
const updateResult = await authService.updateProfile(userId, {
  fullName: 'Nguyen Van B',
  phone: '0987654321'
});

// Đổi mật khẩu
const changePasswordResult = await authService.changePassword({
  userId: 1,
  oldPassword: '123456',
  newPassword: 'newpassword123'
});
```

## 📅 Appointment Service

### Đặt Lịch Hẹn

```javascript
import { appointmentService } from './services';

// Đặt lịch hẹn mới
const bookingResult = await appointmentService.bookAppointment({
  doctorId: 1,
  treatmentPlanId: null, // Optional
  appointmentDate: '2025-01-15T10:00:00',
  timeSlot: '10:00-11:00',
  type: 'Consultation',
  notes: 'First consultation'
});

// Kiểm tra time slot available
const availability = await appointmentService.checkTimeSlotAvailability(
  doctorId, 
  '2025-01-15T10:00:00', 
  '10:00-11:00'
);

if (availability.available) {
  // Proceed with booking
}
```

### Quản Lý Lịch Hẹn

```javascript
// Lấy lịch hẹn của customer
const customerAppointments = await appointmentService.getCustomerAppointments(customerId, {
  status: 'Scheduled,Confirmed',
  sort: 'appointmentDate',
  order: 'asc'
});

// Lấy lịch hẹn sắp tới
const upcomingAppointments = await appointmentService.getUpcomingAppointments(customerId, 7);

// Cập nhật lịch hẹn
const updateResult = await appointmentService.updateAppointment(appointmentId, {
  notes: 'Updated notes',
  timeSlot: '11:00-12:00'
});

// Hủy lịch hẹn
const cancelResult = await appointmentService.cancelAppointment(appointmentId);
```

## 👨‍⚕️ Doctor Service

### Tìm Kiếm Bác Sĩ

```javascript
import { doctorService } from './services';

// Lấy tất cả bác sĩ
const allDoctors = await doctorService.getAllDoctors();

// Tìm kiếm bác sĩ
const searchResults = await doctorService.searchDoctors({
  specialization: 'Fertility Specialist',
  available: true
});

// Lấy top rated doctors
const topDoctors = await doctorService.getTopRatedDoctors(5);

// Lấy bác sĩ available
const availableDoctors = await doctorService.getAvailableDoctors();
```

### Quản Lý Bác Sĩ

```javascript
// Lấy chi tiết bác sĩ
const doctorDetails = await doctorService.getDoctorDetails(doctorId);

// Lấy feedback của bác sĩ
const doctorFeedback = await doctorService.getDoctorFeedback(doctorId);

// Lấy lịch làm việc
const doctorSchedule = await doctorService.getDoctorSchedule(
  doctorId, 
  '2025-01-01', 
  '2025-01-31'
);

// Lấy time slots available
const availableSlots = await doctorService.getAvailableTimeSlots(
  doctorId, 
  '2025-01-15',
  ['09:00', '17:00'], // Working hours
  60 // Slot duration in minutes
);
```

## 🏥 Patient Service

### Dashboard & Overview

```javascript
import { patientService } from './services';

// Lấy dashboard data hoàn chỉnh
const dashboard = await patientService.getPatientDashboard(customerId);
console.log('Dashboard:', {
  upcomingAppointments: dashboard.upcomingAppointments,
  activeTreatmentPlans: dashboard.activeTreatmentPlans,
  recentTestResults: dashboard.recentTestResults,
  unreadNotifications: dashboard.unreadNotifications
});

// Lấy medical summary
const medicalSummary = await patientService.getMedicalSummary(customerId);
```

### Medical Data

```javascript
// Lấy medical history
const medicalHistory = await patientService.getPatientMedicalHistory(customerId);

// Lấy test results
const testResults = await patientService.getPatientTestResults(customerId);

// Lấy treatment plans
const treatmentPlans = await patientService.getPatientTreatmentPlans(customerId);

// Tìm kiếm trong medical records
const searchResults = await patientService.searchMedicalRecords(
  customerId, 
  'hiếm muộn'
);
```

### Notifications

```javascript
// Lấy notifications
const notifications = await patientService.getPatientNotifications(userId);

// Đánh dấu đã đọc
await patientService.markNotificationAsRead(notificationId);

// Lấy số lượng chưa đọc
const unreadCount = await patientService.getUnreadNotificationsCount(userId);
```

## 🩺 Treatment Service

### Treatment Services

```javascript
import { treatmentService } from './services';

// Lấy tất cả dịch vụ điều trị
const allServices = await treatmentService.getAllTreatmentServices();

// Tìm kiếm dịch vụ
const searchResults = await treatmentService.searchTreatmentServices({
  keyword: 'IVF',
  minPrice: 10000000,
  maxPrice: 100000000
});

// Lấy pricing information
const pricing = await treatmentService.getPublicPricing();
```

### Treatment Plans

```javascript
// Tạo treatment plan
const planResult = await treatmentService.createTreatmentPlan({
  customerId: 1,
  doctorId: 1,
  treatmentServiceId: 1,
  treatmentType: 'IVF',
  description: 'Kế hoạch điều trị IVF',
  startDate: '2025-01-20T00:00:00',
  totalCost: 85000000,
  notes: 'Bệnh nhân khỏe mạnh, tiên lượng tốt'
});

// Cập nhật tiến trình điều trị
const progressResult = await treatmentService.updateTreatmentProgress(planId, {
  currentPhase: 2,
  phaseDescription: 'Giai đoạn kích thích buồng trứng',
  nextPhaseDate: '2025-01-25T00:00:00',
  progressNotes: 'Phản ứng tốt với thuốc kích thích'
});

// Hoàn thành treatment plan
const completeResult = await treatmentService.completeTreatmentPlan(planId, {
  outcome: 'Successful',
  finalNotes: 'Điều trị thành công'
});
```

## 🌐 Guest Service (Public APIs)

### Trang Chủ & Thông Tin Công Khai

```javascript
import { guestService } from './services';

// Lấy thông tin trang chủ
const homeData = await guestService.getHomePageInfo();
console.log('Clinic info:', homeData.clinicInfo);
console.log('Stats:', homeData.stats);
console.log('Featured services:', homeData.featuredServices);

// Lấy dịch vụ công khai
const publicServices = await guestService.getPublicServices();

// Lấy bác sĩ công khai
const publicDoctors = await guestService.getPublicDoctors();
```

### Tìm Kiếm & Blog

```javascript
// Tìm kiếm toàn cục
const searchResults = await guestService.globalSearch({
  query: 'IVF',
  type: 'service'
});

// Lấy blog posts
const blogPosts = await guestService.getBlogPosts({
  page: 1,
  pageSize: 10
});

// Lấy categories
const categories = await guestService.getBlogCategories();
```

## 👑 Admin Service (Dashboard & Management)

### Dashboard Statistics

```javascript
import { adminService } from './services';

// Lấy dashboard stats cơ bản
const dashboardStats = await adminService.getDashboardStats();

// Lấy dashboard hoàn chỉnh
const completeDashboard = await adminService.getCompleteDashboard();

// Lấy monthly report
const monthlyReport = await adminService.getMonthlyReport(1, 2025);

// Lấy analytics data
const analyticsData = await adminService.getAnalyticsData('month');
```

### Medical Management

```javascript
// Hoàn thành appointment (Doctor)
const completeResult = await adminService.completeAppointment(doctorId, {
  appointmentId: 1,
  symptoms: 'Hiếm muộn, khó thụ thai',
  diagnosis: 'Hiếm muộn nguyên phát',
  treatment: 'Kích thích buồng trứng',
  prescription: 'Clomiphene citrate 50mg',
  notes: 'Tái khám sau 1 tháng',
  followUpRequired: true,
  nextAppointmentDate: '2025-02-15T10:00:00'
});

// Tạo test result
const testResult = await adminService.createTestResult({
  customerId: 1,
  doctorId: 1,
  testName: 'Xét nghiệm máu',
  testType: 'Blood Test',
  testDate: '2025-01-20T10:00:00',
  results: 'Bình thường',
  normalRange: '5-10',
  status: 'Completed',
  notes: 'Kết quả tốt'
});
```

## 🛠️ Utility Functions

### Error Handling

```javascript
import { 
  formatErrorMessage, 
  handleApiCall,
  ApiError 
} from './services';

// Format error messages
try {
  await authService.login({ email: 'invalid', password: '123' });
} catch (error) {
  const message = formatErrorMessage(error);
  console.log('Error:', message);
  
  // Check error types
  if (error.isValidationError()) {
    const validationErrors = error.getValidationErrors();
    console.log('Validation errors:', validationErrors);
  }
}

// Handle API calls with notifications
const result = await handleApiCall(
  authService.login({ email: 'user@example.com', password: '123456' }),
  { 
    showSuccess: true, 
    showError: true,
    defaultMessage: 'Đăng nhập thành công!'
  }
);
```

### Formatting & Validation

```javascript
import {
  formatDateForDisplay,
  formatDateForApi,
  formatCurrency,
  isValidEmail,
  isValidPhone,
  debounce
} from './services';

// Format functions
const displayDate = formatDateForDisplay('2025-01-15T10:00:00'); // "15/01/2025"
const apiDate = formatDateForApi(new Date()); // "2025-01-15T10:00:00.000Z"
const currency = formatCurrency(85000000); // "85.000.000 ₫"

// Validation
const emailValid = isValidEmail('user@example.com'); // true
const phoneValid = isValidPhone('0123456789'); // true

// Debounced search
const debouncedSearch = debounce(async (query) => {
  const results = await guestService.globalSearch({ query });
  console.log('Search results:', results);
}, 300);
```

## 🎯 Best Practices

### 1. Error Handling

```javascript
// ✅ Luôn handle errors
try {
  const result = await authService.login(credentials);
  if (result.success) {
    // Handle success
  } else {
    // Handle failure
    console.error(result.message);
  }
} catch (error) {
  // Handle network/unexpected errors
  console.error(formatErrorMessage(error));
}
```

### 2. Loading States

```javascript
// ✅ Manage loading states
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  try {
    const result = await authService.login(credentials);
    // Handle result
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### 3. Data Caching

```javascript
// ✅ Cache frequently used data
const [doctors, setDoctors] = useState(null);

useEffect(() => {
  if (!doctors) {
    doctorService.getAllDoctors().then(setDoctors);
  }
}, [doctors]);
```

### 4. Pagination

```javascript
// ✅ Handle pagination properly
const [appointments, setAppointments] = useState([]);
const [page, setPage] = useState(1);

const loadAppointments = async (pageNum) => {
  const result = await appointmentService.getCustomerAppointments(customerId, {
    page: pageNum,
    pageSize: 10
  });
  setAppointments(result.appointments);
};
```

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5037

# Optional: Enable debug mode
REACT_APP_DEBUG_API=true

# Optional: API timeout
REACT_APP_API_TIMEOUT=10000
```

### Global Setup

```javascript
// src/index.js hoặc App.js
import { setGlobalErrorHandler } from './services';

// Setup global error handler
setGlobalErrorHandler((error) => {
  console.error('Global API Error:', error);
  // Show notification or redirect to error page
});
```

## 📞 API Testing

### Test All Connections

```javascript
import {
  authService,
  appointmentService,
  doctorService,
  treatmentService,
  adminService
} from './services';

// Test tất cả API connections
const testConnections = async () => {
  try {
    await Promise.all([
      authService.testConnection(),
      appointmentService.testConnection(),
      doctorService.testConnection(),
      treatmentService.testConnection(),
      adminService.testConnection()
    ]);
    console.log('✅ All API connections working!');
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
};
```

## 🎉 Kết Luận

Bộ API Services này cung cấp:

- **Complete coverage** cho tất cả chức năng ITMMS
- **Type-safe** operations với error handling
- **Easy-to-use** interface với clear documentation
- **Scalable architecture** cho future expansion
- **Production-ready** với best practices

Chỉ cần import và sử dụng! 🚀

---

**Happy Coding!** 💻✨

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng tạo issue hoặc liên hệ team development. 