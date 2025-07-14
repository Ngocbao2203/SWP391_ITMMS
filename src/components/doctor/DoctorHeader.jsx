import React, { useState } from "react";
import {
  Layout,
  Typography,
  Avatar,
  Dropdown,
  Button,
  Badge,
  Space,
  Divider,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { authService } from "../../services";
import "../../styles/DoctorHeader.css";

const { Header } = Layout;
const { Text } = Typography;

const DoctorHeader = () => {
  const [notificationCount] = useState(3); // Mock notification count
  const currentUser = authService.getCurrentUser();
  const doctor = currentUser?.doctor;

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  const notificationItems = [
    {
      key: "1",
      label: (
        <div style={{ padding: "8px 0" }}>
          <Text strong>Lịch hẹn mới</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Bệnh nhân Nguyễn Văn A đã đặt lịch hẹn
          </Text>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div style={{ padding: "8px 0" }}>
          <Text strong>Cập nhật điều trị</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Kế hoạch điều trị #123 cần được cập nhật
          </Text>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div style={{ padding: "8px 0" }}>
          <Text strong>Tái khám</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            3 bệnh nhân cần tái khám trong tuần này
          </Text>
        </div>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: "profile_header",
      label: (
        <div className="user-dropdown-header">
          <Avatar size="small" icon={<UserOutlined />} src={doctor.avatar} />
          <div>
            <Text strong style={{ fontSize: "13px" }}>
              BS. {doctor.fullName || "Doctor"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {doctor.specialization || "Chuyên khoa"}
            </Text>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
      style: { margin: "4px 0" },
    },
    {
      key: "profile",
      label: (
        <Space className="dropdown-item">
          <UserOutlined />
          <span>Thông tin cá nhân</span>
        </Space>
      ),
    },
    {
      key: "settings",
      label: (
        <Space className="dropdown-item">
          <SettingOutlined />
          <span>Cài đặt</span>
        </Space>
      ),
    },
    {
      type: "divider",
      style: { margin: "4px 0" },
    },
    {
      key: "logout",
      label: (
        <Space className="dropdown-item-danger">
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </Space>
      ),
      onClick: handleLogout,
    },
  ];

  if (!doctor) {
    return null;
  }

  return (
    <Header className="doctor-header">
      <div className="header-content">
        {/* Logo and Title */}
        <div className="header-left">
          <div className="logo-container">
            <div className="logo">ITMMS</div>
            <Text className="clinic-name">Fertility Clinic</Text>
          </div>
        </div>

        {/* Doctor Info and Actions */}
        <div className="header-right">
          <Space size="large">
            {/* Notifications */}
            <Dropdown
              menu={{ items: notificationItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={
                  <Badge count={notificationCount} size="small">
                    <BellOutlined style={{ fontSize: "18px" }} />
                  </Badge>
                }
                className="notification-btn"
              />
            </Dropdown>

            <Divider type="vertical" style={{ height: "32px" }} />

            {/* Doctor Profile - Simplified */}
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div
                className="doctor-profile-compact"
                style={{ cursor: "pointer" }}
              >
                <Space>
                  <Avatar
                    size="default"
                    icon={<UserOutlined />}
                    src={doctor.avatar}
                    className="avatar-highlight"
                  />
                </Space>
              </div>
            </Dropdown>
          </Space>
        </div>
      </div>
    </Header>
  );
};

export default DoctorHeader;
