import { Routes, Route } from "react-router-dom";

// Public
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Home from "../pages/public/Home";
import UserService from "../pages/public/UserService";
import BlogList from "../pages/public/BlogList";
import BlogDetail from "../pages/public/BlogDetail";
import DoctorList from "../pages/public/DoctorList";
import DoctorProfile from "../pages/public/DoctorProfile";
import ServiceDetail from "../pages/public/ServiceDetail";

// Admin

// Doctor
import DoctorLayout from "../layouts/DoctorLayout";
import TreatmentProgressPage from "../pages/doctor/TreatmentProgressPage";
import MedicalRecords from "../pages/doctor/MedicalRecords";
import AppointmentSchedule from "../pages/doctor/AppointmentSchedule";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Services from "../pages/admin/Services";
import Feedback from "../pages/admin/Feedback";
import Reports from "../pages/admin/Reports";
import Manager from "../pages/admin/Manager";

// Manager
import ManagerLayout from "../layouts/ManagerLayout";
import Doctors from "../pages/manager/Doctors";
import Assignments from "../pages/manager/Assignments";
import Schedules from "../pages/manager/Schedules";
import Registrations from "../pages/manager/Registrations";
import Progress from "../pages/manager/Progress";
import Notifications from "../pages/manager/Notifications";
import BlogManagement from "../pages/manager/BlogManagement";

// Patient Dashboard and related pages

import BookAppointment from "../pages/patient/BookAppointment";

import PatientDashboard from "../pages/patient/PatientDashboard";
import UserProfile from "../pages/patient/UserProfile";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/userservice" element={<UserService />} />{" "}
      {/* Blog Routes */}
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/doctors" element={<DoctorList />} />
      <Route path="/doctors/:id" element={<DoctorProfile />} />{" "}
      <Route path="/services/:serviceId" element={<ServiceDetail />} />
      <Route path="/doctors" element={<DoctorList />} />
      <Route path="/doctors/:id" element={<DoctorProfile />} />{" "}
      <Route path="/services/:serviceId" element={<ServiceDetail />} />

      <Route path="/bookappointment" element={<BookAppointment />} />
      <Route path="/bookappointment/:serviceId" element={<BookAppointment />} />
      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={<DoctorLayout />} />
      <Route
        path="/doctor/appointments"
        element={
          <DoctorLayout>
            <AppointmentSchedule />
          </DoctorLayout>
        }
      />
      <Route
        path="/doctor/treatmentsprogress"
        element={
          <DoctorLayout>
            <TreatmentProgressPage />
          </DoctorLayout>
        }
      />
      <Route
        path="doctor/medical-records"
        element={
          <DoctorLayout>
            <MedicalRecords />
          </DoctorLayout>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/services"
        element={
          <AdminLayout>
            <Services />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <AdminLayout>
            <Feedback />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminLayout>
            <Reports />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/manager"
        element={
          <AdminLayout>
            <Manager />
          </AdminLayout>
        }
      />
      {/* Manager Routes */}
      <Route
        path="/manager/doctors"
        element={
          <ManagerLayout>
            <Doctors />
          </ManagerLayout>
        }
      />
      <Route
        path="/manager/assignments"
        element={
          <ManagerLayout>
            <Assignments />
          </ManagerLayout>
        }
      />
      <Route
        path="/manager/schedules"
        element={
          <ManagerLayout>
            <Schedules />
          </ManagerLayout>
        }
      />
      <Route
        path="/manager/registrations"
        element={
          <ManagerLayout>
            <Registrations />
          </ManagerLayout>
        }
      />
      <Route
        path="/manager/progress"
        element={
          <ManagerLayout>
            <Progress />
          </ManagerLayout>
        }
      />
      <Route
        path="/manager/notifications"
        element={
          <ManagerLayout>
            <Notifications />
          </ManagerLayout>
        }
      />
      <Route
        path="/manager/blogs"
        element={
          <ManagerLayout>
            <BlogManagement />
          </ManagerLayout>
        }
      />
      {/* Patient Routes */}
      <Route path="/profile" element={<PatientDashboard />} />
      <Route path="/user-profile" element={<UserProfile />} />
    </Routes>
  );
};

export default AppRouter;
