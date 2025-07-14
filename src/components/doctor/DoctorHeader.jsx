import React, { useState } from 'react';
import { Layout, Typography, Avatar, Dropdown, Button, Badge, Space, Divider } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined,
  DownOutlined
} from '@ant-design/icons';
import { authService } from '../../services';
import '../../styles/DoctorHeader.css';

const { Header } = Layout;
const { Text } = Typography;

const DoctorHeader = () => {
  const [notificationCount] = useState(3); // Mock notification count
  const currentUser = authService.getCurrentUser();
  const doctor = currentUser?.doctor;

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const notificationItems = [
    {
      key: '1',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>Lịch hẹn mới</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Bệnh nhân Nguyễn Văn A đã đặt lịch hẹn
          </Text>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>Cập nhật điều trị</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Kế hoạch điều trị #123 cần được cập nhật
          </Text>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>Tái khám</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            3 bệnh nhân cần tái khám trong tuần này
          </Text>
        </div>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <Space>
          <UserOutlined />
          <span>Thông tin cá nhân</span>
        </Space>
      ),
    },
    {
      key: 'settings',
      label: (
        <Space>
          <SettingOutlined />
          <span>Cài đặt</span>
        </Space>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <Space style={{ color: '#ff4d4f' }}>
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
            <div className="logo">
              ITMMS
            </div>
            <Text className="clinic-name">Fertility Clinic</Text>
          </div>
        </div>

        {/* Doctor Info and Actions */}
        <div className="header-right">
          <Space size="large">
            {/* Notifications */}
            <Dropdown
              menu={{ items: notificationItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                type="text" 
                icon={
                  <Badge count={notificationCount} size="small">
                    <BellOutlined style={{ fontSize: '18px' }} />
                  </Badge>
                }
                className="notification-btn"
              />
            </Dropdown>

            <Divider type="vertical" style={{ height: '32px' }} />

            {/* Doctor Profile */}
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <div className="doctor-profile" style={{ cursor: 'pointer' }}>
                <Space>
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    src={doctor.avatar}
                  />
                  <div className="doctor-info">
                    <Text strong className="doctor-name">
                      BS. {doctor.fullName || 'Doctor'}
                    </Text>
                    <br />
                    <Text type="secondary" className="doctor-specialization">
                      {doctor.specialization || 'Chuyên khoa'}
                    </Text>
                  </div>
                  <DownOutlined style={{ fontSize: '12px' }} />
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