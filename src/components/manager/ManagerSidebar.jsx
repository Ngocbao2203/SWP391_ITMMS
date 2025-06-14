import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ScheduleOutlined,
  AuditOutlined,
  NotificationOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/ManagerSidebar.css";

const { Sider } = Layout;

const ManagerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Sider
      className="manager-sidebar"
      width={300}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="logo-section">
        <img src="https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png" alt="logo" className="sidebar-logo" />
        <h2 className="sidebar-title">MANAGER</h2>
      </div>

      <div className="menu-wrapper">
        <Menu mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/manager/doctors" icon={<UserOutlined />}>
            <Link to="/manager/doctors">Doctors</Link>
          </Menu.Item>
          <Menu.Item key="/manager/assignments" icon={<AuditOutlined />}>
            <Link to="/manager/assignments">Assignments</Link>
          </Menu.Item>
          <Menu.Item key="/manager/schedules" icon={<ScheduleOutlined />}>
            <Link to="/manager/schedules">Schedules</Link>
          </Menu.Item>
          <Menu.Item key="/manager/notifications" icon={<NotificationOutlined />}>
            <Link to="/manager/notifications">Notifications</Link>
          </Menu.Item>
          <Menu.Item key="/manager/blogs" icon={<FileTextOutlined />}>
            <Link to="/manager/blogs">Quản lý blog</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
};

export default ManagerSidebar;
