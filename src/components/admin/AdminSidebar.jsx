import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  MessageOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/AdminSidebar.css";

const { Sider } = Layout;

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      className="admin-sidebar"
      width={300}
    >
      <div className="logo-admin">ADMIN</div>

      <div className="menu-wrapper">
        <Menu mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/admin/services" icon={<AppstoreOutlined />}>
            <Link to="/admin/services">Services</Link>
          </Menu.Item>
          <Menu.Item key="/admin/Manager" icon={<FileTextOutlined />}>
            <Link to="/admin/Manager">Manager</Link>
          </Menu.Item>
          <Menu.Item key="/admin/feedback" icon={<MessageOutlined />}>
            <Link to="/admin/feedback">Feedback</Link>
          </Menu.Item>
          <Menu.Item key="/admin/reports" icon={<FileTextOutlined />}>
            <Link to="/admin/reports">Reports</Link>
          </Menu.Item>
        </Menu>
      </div>

      <div className="logout">
        <div onClick={handleLogout}>
          <LogoutOutlined style={{ marginRight: 8 }} />
          <span>Logout</span>
        </div>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
