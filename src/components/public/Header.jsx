import React from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  LoginOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "../../styles/Header.css";

const { Header: AntHeader } = Layout;

const Header = ({ user, onLogout }) => {
  const location = useLocation();
  
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Hồ sơ cá nhân</Link>,
    },
    {
      key: 'appointments',
      icon: <AppstoreOutlined />,
      label: <Link to="/bookappointment">Lịch hẹn</Link>,
    },
    {
      key: 'treatment',
      icon: <TeamOutlined />,
      label: <Link to="/profile">Tiến trình điều trị</Link>,
    },
    {
      key: 'medical-records',
      icon: <ReadOutlined />,
      label: <Link to="/profile">Hồ sơ y tế</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/profile">Cài đặt tài khoản</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: onLogout,
    },
  ];

  const navigationItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: '/userservice',
      icon: <AppstoreOutlined />,
      label: <Link to="/userservice">Dịch vụ</Link>,
    },
    {
      key: '/blog',
      icon: <ReadOutlined />,
      label: <Link to="/blog">Bài viết</Link>,
    },
    {
      key: '/doctors',
      icon: <TeamOutlined />,
      label: <Link to="/doctors">Bác sĩ</Link>,
    },
    ...(user ? [
      {
        key: 'user',
        className: 'user-menu',
        label: (
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight" 
            trigger={['click']}
          >
            <Space className="avatar-dropdown" style={{ cursor: 'pointer' }}>
              <Avatar 
                src={user.avatar || null} 
                icon={!user.avatar && <UserOutlined />} 
                style={{ marginRight: 8 }} 
              />
              <span className="user-name">{user.fullName || user.firstName + ' ' + user.lastName}</span>
            </Space>
          </Dropdown>
        ),
      }
    ] : [
      {
        key: '/login',
        label: <Link to="/login">Đăng nhập</Link>,
      },
      {
        key: '/register',
        label: <Link to="/register">Đăng ký</Link>,
      }
    ])
  ];

  return (
    <AntHeader className="app-header">
      <div className="logo-section-hd">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="clinic-name">IVF Clinic</span>
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="nav-menu"
        items={navigationItems}
      />
    </AntHeader>
  );
};

export default Header;
