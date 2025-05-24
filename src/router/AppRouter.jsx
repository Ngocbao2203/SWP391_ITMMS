import { Routes, Route } from "react-router-dom";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Home from "../pages/public/Home";
import RequestPasswordReset from "../pages/public/ReqPass";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Services from "../pages/admin/Services";
import Feedback from "../pages/admin/Feedback";
import Reports from "../pages/admin/Reports";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ReqPass" element={<RequestPasswordReset />} />

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
    </Routes>
  );
};

export default AppRouter;
