import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ScheduleOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  FundProjectionScreenOutlined,
  NotificationOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/ManagerSidebar.css"; // 👈 Đừng quên tạo file CSS

const { Sider } = Layout;

const ManagerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Sider className="manager-sidebar" width={300}>
      <div className="logo">MANAGER</div>

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
          <Menu.Item key="/manager/registrations" icon={<CheckCircleOutlined />}>
            <Link to="/manager/registrations">Registrations</Link>
          </Menu.Item>
          <Menu.Item key="/manager/progress" icon={<FundProjectionScreenOutlined />}>
            <Link to="/manager/progress">Progress</Link>
          </Menu.Item>
          <Menu.Item key="/manager/notifications" icon={<NotificationOutlined />}>
            <Link to="/manager/notifications">Notifications</Link>
          </Menu.Item>
        </Menu>
      </div>

      <div className="logout" onClick={handleLogout}>
        <LogoutOutlined style={{ marginRight: 8 }} />
        <span>Logout</span>
      </div>
    </Sider>
  );
};

export default ManagerSidebar;
