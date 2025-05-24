import { Routes, Route } from "react-router-dom";

// Public
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Home from '../pages/public/Home';

// Admin
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Services from '../pages/admin/Services';
import Feedback from '../pages/admin/Feedback';
import Reports from '../pages/admin/Reports';

// Manager
import ManagerLayout from '../layouts/ManagerLayout';
import Doctors from '../pages/manager/Doctors';
import Assignments from '../pages/manager/Assignments';
import Schedules from '../pages/manager/Schedules';
import Registrations from '../pages/manager/Registrations';
import Progress from '../pages/manager/Progress';
import Notifications from '../pages/manager/Notifications';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/services" element={<AdminLayout><Services /></AdminLayout>} />
      <Route path="/admin/feedback" element={<AdminLayout><Feedback /></AdminLayout>} />
      <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />

      {/* Manager Routes */}
      <Route path="/manager/doctors" element={<ManagerLayout><Doctors /></ManagerLayout>} />
      <Route path="/manager/assignments" element={<ManagerLayout><Assignments /></ManagerLayout>} />
      <Route path="/manager/schedules" element={<ManagerLayout><Schedules /></ManagerLayout>} />
      <Route path="/manager/registrations" element={<ManagerLayout><Registrations /></ManagerLayout>} />
      <Route path="/manager/progress" element={<ManagerLayout><Progress /></ManagerLayout>} />
      <Route path="/manager/notifications" element={<ManagerLayout><Notifications /></ManagerLayout>} />
    </Routes>
  );
};

export default AppRouter;
