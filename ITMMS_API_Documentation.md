# 📋 **ITMMS Backend API Documentation cho Frontend Integration**

## 🌐 **Base URL & Configuration**
```
Development: http://localhost:5037
Production: [YOUR_PRODUCTION_URL]
Base API Path: /api
```

---

## 🔐 **1. AUTHENTICATION SYSTEM**
**Controller:** `AuthController` | **Base Path:** `/api/auth`

### **Endpoints:**

#### **1.1 User Registration**
```http
POST /api/auth/register
Content-Type: application/json
```
**Request Body:**
```json
{
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0123456789",
  "address": "123 Main Street",
  "username": "username",
  "password": "123456",
  "confirmPassword": "123456",
  "role": "Customer"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Dang nhap thanh cong",
  "userId": 123
}
```

#### **1.2 User Login**
```http
POST /api/auth/login
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Dang nhap thanh cong",
  "user": {
    "id": 1,
    "username": "username",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "Customer",
    "phone": "0123456789"
  }
}
```

#### **1.3 Check Email Exists**
```http
POST /api/auth/check-email
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### **1.4 Check Username Exists**
```http
POST /api/auth/check-username
Content-Type: application/json
```
**Request Body:**
```json
{
  "username": "testuser"
}
```

#### **1.5 Get User Profile**
```http
GET /api/auth/profile/{userId}
```
**Response:**
```json
{
  "id": 1,
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0123456789",
  "address": "123 Main Street",
  "role": "Customer",
  "createdAt": "2025-01-01T00:00:00"
}
```

#### **1.6 Update Profile**
```http
PUT /api/auth/profile/{userId}
Content-Type: application/json
```
**Request Body:**
```json
{
  "fullName": "Nguyen Van B",
  "phone": "0987654321",
  "address": "456 New Street"
}
```

#### **1.7 Change Password**
```http
POST /api/auth/change-password
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": 1,
  "oldPassword": "123456",
  "newPassword": "newpassword123"
}
```

#### **1.8 Get User History**
```http
GET /api/auth/history/{userId}
```

#### **1.9 Create Feedback**
```http
POST /api/auth/feedback
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": 2,
  "doctorId": 1,
  "appointmentId": 1,
  "rating": 5,
  "comment": "Bac si rat tan tam"
}
```

---

## 📅 **2. APPOINTMENT MANAGEMENT**
**Controller:** `AppointmentsController` | **Base Path:** `/api/appointments`

#### **2.1 Book Appointment**
```http
POST /api/appointments
Content-Type: application/json
```
**Request Body:**
```json
{
  "doctorId": 1,
  "treatmentPlanId": null,
  "appointmentDate": "2025-01-15T10:00:00",
  "timeSlot": "10:00-11:00",
  "type": "Consultation",
  "notes": "First consultation"
}
```

#### **2.2 Get All Appointments**
```http
GET /api/appointments
```

#### **2.3 Get Appointment Details**
```http
GET /api/appointments/{appointmentId}
```
**Response:**
```json
{
  "id": 1,
  "appointmentDate": "2025-01-15T10:00:00",
  "timeSlot": "10:00-11:00",
  "type": "Consultation",
  "status": "Scheduled",
  "notes": "First consultation",
  "customer": {
    "id": 1,
    "name": "Nguyen Van A"
  },
  "doctor": {
    "id": 1,
    "name": "Dr. Nguyen Van A",
    "specialization": "Fertility Specialist"
  }
}
```

#### **2.4 Get Customer Appointments**
```http
GET /api/appointments/customer/{customerId}
```
**Response:**
```json
{
  "appointments": [
    {
      "id": 1,
      "appointmentDate": "2025-01-15T10:00:00",
      "timeSlot": "10:00-11:00",
      "type": "Consultation",
      "status": "Scheduled",
      "doctor": {
        "id": 1,
        "name": "Dr. Nguyen Van A",
        "specialization": "Fertility Specialist"
      }
    }
  ]
}
```

#### **2.5 Get Doctor Appointments**
```http
GET /api/appointments/doctor/{doctorId}
```

#### **2.6 Update Appointment**
```http
PUT /api/appointments/{appointmentId}
Content-Type: application/json
```

#### **2.7 Cancel Appointment**
```http
DELETE /api/appointments/{appointmentId}
```

---

## 👨‍⚕️ **3. DOCTOR MANAGEMENT**
**Controller:** `DoctorsController` | **Base Path:** `/api/doctors`

#### **3.1 Get All Doctors**
```http
GET /api/doctors
```
**Response:**
```json
{
  "doctors": [
    {
      "id": 1,
      "name": "Dr. Nguyen Van A",
      "specialization": "Fertility Specialist",
      "experienceYears": 10,
      "consultationFee": 500000,
      "education": "MD, PhD",
      "isAvailable": true,
      "averageRating": 4.5
    }
  ]
}
```

#### **3.2 Get Doctor Details**
```http
GET /api/doctors/{doctorId}
```

#### **3.3 Create Doctor Profile**
```http
POST /api/doctors
Content-Type: application/json
```

#### **3.4 Update Doctor Profile**
```http
PUT /api/doctors/{doctorId}
Content-Type: application/json
```

#### **3.5 Search Doctors**
```http
GET /api/doctors/search?specialization=Fertility&available=true
```

#### **3.6 Get Doctor Feedback**
```http
GET /api/doctors/{doctorId}/feedback
```

#### **3.7 Get Doctor Appointments**
```http
GET /api/doctors/{doctorId}/appointments
```

#### **3.8 Get Available Doctors**
```http
GET /api/doctors/available
```

---

## 🏥 **4. TREATMENT SERVICES**
**Controller:** `TreatmentServicesController` | **Base Path:** `/api/treatmentservices`

#### **4.1 Get All Services**
```http
GET /api/treatmentservices
```
**Response:**
```json
{
  "services": [
    {
      "id": 1,
      "serviceName": "IVF (In Vitro Fertilization)",
      "serviceCode": "IVF001",
      "description": "Thu tinh ong nghiem",
      "basePrice": 85000000,
      "durationDays": 30,
      "successRate": 65.5
    }
  ]
}
```

#### **4.2 Get Service Details**
```http
GET /api/treatmentservices/{serviceId}
```

#### **4.3 Create Service (Admin/Manager)**
```http
POST /api/treatmentservices
Content-Type: application/json
```

#### **4.4 Update Service**
```http
PUT /api/treatmentservices/{serviceId}
Content-Type: application/json
```

#### **4.5 Delete Service**
```http
DELETE /api/treatmentservices/{serviceId}
```

#### **4.6 Search Services**
```http
GET /api/treatmentservices/search?keyword=IVF&minPrice=10000000&maxPrice=100000000
```

#### **4.7 Get Public Pricing**
```http
GET /api/treatmentservices/pricing
```

---

## 📋 **5. TREATMENT PLANS**
**Controller:** `TreatmentPlansController` | **Base Path:** `/api/treatmentplans`

#### **5.1 Create Treatment Plan**
```http
POST /api/treatmentplans
Content-Type: application/json
```
**Request Body:**
```json
{
  "customerId": 1,
  "doctorId": 1,
  "treatmentServiceId": 1,
  "treatmentType": "IVF",
  "description": "Kế hoạch điều trị IVF",
  "startDate": "2025-01-20T00:00:00",
  "totalCost": 85000000,
  "notes": "Bệnh nhân khỏe mạnh, tiên lượng tốt"
}
```

#### **5.2 Get Customer Treatment Plans**
```http
GET /api/treatmentplans/customer/{customerId}
```

#### **5.3 Get Doctor Treatment Plans**
```http
GET /api/treatmentplans/doctor/{doctorId}
```

#### **5.4 Get Treatment Plan Details**
```http
GET /api/treatmentplans/{planId}
```

#### **5.5 Update Treatment Plan**
```http
PUT /api/treatmentplans/{planId}
Content-Type: application/json
```

#### **5.6 Update Treatment Progress**
```http
PUT /api/treatmentplans/{planId}/progress
Content-Type: application/json
```
**Request Body:**
```json
{
  "currentPhase": 2,
  "phaseDescription": "Giai đoạn kích thích buồng trứng",
  "nextPhaseDate": "2025-01-25T00:00:00",
  "progressNotes": "Phản ứng tốt với thuốc kích thích"
}
```

#### **5.7 Get Treatment Progress**
```http
GET /api/treatmentplans/{planId}/progress
```

#### **5.8 Complete Treatment Plan**
```http
POST /api/treatmentplans/{planId}/complete
Content-Type: application/json
```

---

## 📝 **6. MEDICAL RECORDS**
**Controller:** `MedicalRecordsController` | **Base Path:** `/api/medicalrecords`

#### **6.1 Complete Appointment (Doctor)**
```http
POST /api/medicalrecords/complete/{doctorId}
Content-Type: application/json
```
**Request Body:**
```json
{
  "appointmentId": 1,
  "symptoms": "Hiếm muộn, khó thụ thai",
  "diagnosis": "Hiếm muộn nguyên phát",
  "treatment": "Kích thích buồng trứng",
  "prescription": "Clomiphene citrate 50mg",
  "notes": "Tái khám sau 1 tháng",
  "followUpRequired": true,
  "nextAppointmentDate": "2025-02-15T10:00:00"
}
```

#### **6.2 Get Medical Record by Appointment**
```http
GET /api/medicalrecords/appointment/{appointmentId}
```

#### **6.3 Get Patient Medical History**
```http
GET /api/medicalrecords/patient/{customerId}/history
```
**Response:**
```json
{
  "medicalHistory": [
    {
      "id": 1,
      "recordDate": "2025-01-15T10:00:00",
      "doctorName": "Dr. Nguyen Van A",
      "symptoms": "Hiếm muộn, khó thụ thai",
      "diagnosis": "Hiếm muộn nguyên phát",
      "treatment": "Kích thích buồng trứng",
      "prescription": "Clomiphene citrate 50mg",
      "appointmentType": "Consultation"
    }
  ]
}
```

#### **6.4 Get Doctor Medical Records**
```http
GET /api/medicalrecords/doctor/{doctorId}
```

#### **6.5 Test Endpoint**
```http
GET /api/medicalrecords/test
```

---

## 🧪 **7. TEST RESULTS**
**Controller:** `TestResultsController` | **Base Path:** `/api/testresults`

#### **7.1 Create Test Result (Doctor)**
```http
POST /api/testresults/create
Content-Type: application/json
```
**Request Body:**
```json
{
  "customerId": 1,
  "doctorId": 1,
  "testName": "Xét nghiệm máu",
  "testType": "Blood Test",
  "testDate": "2025-01-20T10:00:00",
  "results": "Bình thường",
  "normalRange": "5-10",
  "status": "Completed",
  "notes": "Kết quả tốt",
  "filePath": "/uploads/test_result_123.pdf"
}
```

#### **7.2 Get Customer Test Results**
```http
GET /api/testresults/customer/{customerId}
```
**Response:**
```json
{
  "testResults": [
    {
      "id": 1,
      "testName": "Xét nghiệm máu",
      "testType": "Blood Test",
      "testDate": "2025-01-20T10:00:00",
      "results": "Bình thường",
      "status": "Completed",
      "notes": "Kết quả tốt",
      "filePath": "/uploads/test_result_123.pdf",
      "doctor": {
        "id": 1,
        "name": "Dr. Nguyen Van A",
        "specialization": "Fertility Specialist"
      }
    }
  ]
}
```

#### **7.3 Get Test Result Details**
```http
GET /api/testresults/{testResultId}
```

#### **7.4 Test Endpoint**
```http
GET /api/testresults/test
```

---

## 🔔 **8. NOTIFICATIONS**
**Controller:** `NotificationsController` | **Base Path:** `/api/notifications`

#### **8.1 Get User Notifications**
```http
GET /api/notifications/user/{userId}
```
**Response:**
```json
{
  "notifications": [
    {
      "id": 1,
      "title": "Nhắc nhở khám bệnh",
      "message": "Bạn có lịch hẹn khám bệnh vào ngày mai",
      "type": "AppointmentReminder",
      "isRead": false,
      "createdAt": "2025-01-20T08:00:00",
      "scheduledAt": "2025-01-21T08:00:00"
    }
  ]
}
```

#### **8.2 Create Notification**
```http
POST /api/notifications/create
Content-Type: application/json
```
**Request Body:**
```json
{
  "userId": 1,
  "title": "Nhắc nhở uống thuốc",
  "message": "Đã đến giờ uống thuốc: Clomiphene citrate",
  "type": "MedicationReminder",
  "scheduledAt": "2025-01-21T08:00:00"
}
```

#### **8.3 Mark Notification as Read**
```http
PUT /api/notifications/{notificationId}/read
```

#### **8.4 Create Medication Reminder**
```http
POST /api/notifications/medication-reminder
Content-Type: application/json
```

#### **8.5 Create Appointment Reminder**
```http
POST /api/notifications/appointment-reminder
Content-Type: application/json
```

#### **8.6 Get Unread Count**
```http
GET /api/notifications/unread-count/{userId}
```
**Response:**
```json
{
  "unreadCount": 3
}
```

#### **8.7 Test Endpoint**
```http
GET /api/notifications/test
```

---

## 🌐 **9. GUEST/PUBLIC APIS**
**Controller:** `GuestController` | **Base Path:** `/api/guest`

#### **9.1 Get Home Page Info**
```http
GET /api/guest/home
```
**Response:**
```json
{
  "clinicInfo": {
    "name": "ITMMS Fertility Clinic",
    "description": "Chuyên khoa điều trị hiếm muộn",
    "phone": "0123456789",
    "email": "info@itmms.com",
    "address": "123 Main Street, Ho Chi Minh City"
  },
  "stats": {
    "totalDoctors": 5,
    "totalPatients": 150,
    "successRate": 85.5
  },
  "featuredServices": [
    {
      "id": 1,
      "serviceName": "IVF",
      "basePrice": 85000000,
      "successRate": 65.5
    }
  ]
}
```

#### **9.2 Get Public Services**
```http
GET /api/guest/services
```

#### **9.3 Get Service Details**
```http
GET /api/guest/services/{serviceId}
```

#### **9.4 Get Public Doctors**
```http
GET /api/guest/doctors
```

#### **9.5 Get Doctor Details**
```http
GET /api/guest/doctors/{doctorId}
```

#### **9.6 Get Doctor Reviews**
```http
GET /api/guest/doctors/{doctorId}/reviews
```

#### **9.7 Get Blog Posts**
```http
GET /api/guest/blog?page=1&pageSize=10
```

#### **9.8 Get Blog Post Details**
```http
GET /api/guest/blog/{postId}
```

#### **9.9 Get Blog Categories**
```http
GET /api/guest/blog/categories
```

#### **9.10 Global Search**
```http
GET /api/guest/search?query=IVF&type=service
```

---

## 📊 **10. DASHBOARD (Manager/Admin)**
**Controller:** `DashboardController` | **Base Path:** `/api/dashboard`

#### **10.1 Get Dashboard Stats**
```http
GET /api/dashboard/stats
```
**Response:**
```json
{
  "totalCustomers": 150,
  "totalDoctors": 5,
  "totalAppointments": 300,
  "completedTreatments": 85,
  "totalRevenue": 2550000000,
  "averageRating": 4.5,
  "activeTreatmentPlans": 25,
  "pendingAppointments": 12
}
```

#### **10.2 Get Monthly Report**
```http
GET /api/dashboard/monthly-report?month=1&year=2025
```

#### **10.3 Get Service Statistics**
```http
GET /api/dashboard/service-stats
```

#### **10.4 Get Doctor Statistics**
```http
GET /api/dashboard/doctor-stats
```

#### **10.5 Get Recent Appointments**
```http
GET /api/dashboard/recent-appointments
```

#### **10.6 Get Feedback Statistics**
```http
GET /api/dashboard/feedback-stats
```

#### **10.7 Get Real-time Statistics**
```http
GET /api/dashboard/real-time-stats
```

---

## 🔧 **Frontend Integration Guidelines**

### **1. Error Handling**
Tất cả APIs trả về format lỗi chuẩn:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["validation message"]
  }
}
```

### **2. HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

### **3. Common Headers**
```
Content-Type: application/json
Accept: application/json
```

### **4. Date Format**
Tất cả dates sử dụng ISO 8601 format: `2025-01-20T10:00:00`

### **5. User Roles**
- `Guest` - Không cần authentication
- `Customer` - Bệnh nhân
- `Doctor` - Bác sĩ
- `Manager` - Quản lý
- `Admin` - Administrator

### **6. Pagination**
Các APIs có pagination sử dụng query parameters:
```
?page=1&pageSize=10
```

### **7. Search & Filter**
```
?search=keyword&status=active&dateFrom=2025-01-01&dateTo=2025-01-31
```

### **8. File Upload**
Cho Test Results và Medical Documents:
```http
POST /api/testresults/upload
Content-Type: multipart/form-data
```

---

## 🧪 **Testing Endpoints**
Mỗi controller có test endpoint để kiểm tra hoạt động:
- `GET /api/auth/test`
- `GET /api/appointments/test`
- `GET /api/doctors/test`
- `GET /api/medicalrecords/test`
- `GET /api/notifications/test`
- `GET /api/testresults/test`

---

## 🚀 **Quick Start cho Frontend**

### **1. Authentication Flow:**
```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: '123456' })
});

// 2. Store user info
const user = await loginResponse.json();
localStorage.setItem('user', JSON.stringify(user.user));

// 3. Use user ID for other API calls
const userId = user.user.id;
```

### **2. Booking Flow:**
```javascript
// 1. Get available doctors
const doctors = await fetch('/api/doctors/available').then(r => r.json());

// 2. Book appointment
const appointment = await fetch('/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    doctorId: 1,
    appointmentDate: '2025-01-15T10:00:00',
    timeSlot: '10:00-11:00',
    type: 'Consultation'
  })
});
```

### **3. Get User Data:**
```javascript
// Get appointments
const appointments = await fetch(`/api/appointments/customer/${customerId}`).then(r => r.json());

// Get medical history
const history = await fetch(`/api/medicalrecords/patient/${customerId}/history`).then(r => r.json());

// Get notifications
const notifications = await fetch(`/api/notifications/user/${userId}`).then(r => r.json());
```

---

## 📱 **API Summary**

**Total APIs Available:** 67 endpoints
- **Authentication:** 9 endpoints
- **Appointments:** 7 endpoints  
- **Doctors:** 8 endpoints
- **Medical Records:** 5 endpoints
- **Treatment Services:** 7 endpoints
- **Treatment Plans:** 8 endpoints
- **Test Results:** 4 endpoints
- **Notifications:** 8 endpoints
- **Guest Portal:** 10 endpoints
- **Dashboard:** 7 endpoints

**Key Features:**
- ✅ Complete CRUD operations
- ✅ Role-based access control
- ✅ Real-time notifications
- ✅ File upload support
- ✅ Search & pagination
- ✅ Error handling
- ✅ Data validation

**Swagger Documentation:** `http://localhost:5037/swagger`

---

## 🎯 **Ready for Frontend Integration!**

Hệ thống đã hoàn thành 100% và sẵn sàng cho Frontend team integrate! 