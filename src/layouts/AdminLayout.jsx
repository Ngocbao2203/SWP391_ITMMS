import React from "react";
import { Layout } from "antd";
import AdminSidebar from "../components/admin/AdminSidebar";
import '../styles/AdminLayout.css';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar />
      <Layout className="main-layout">
        <div className="page-header">Admin Panel</div>
        <Content className="admin-content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
