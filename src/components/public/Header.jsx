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
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Hồ sơ cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="appointments" icon={<AppstoreOutlined />}>
        <Link to="/bookappointment">Lịch hẹn</Link>
      </Menu.Item>
      <Menu.Item key="treatment" icon={<TeamOutlined />}>
        <Link to="/profile">Tiến trình điều trị</Link>
      </Menu.Item>
      <Menu.Item key="medical-records" icon={<ReadOutlined />}>
        <Link to="/profile">Hồ sơ y tế</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/profile">Cài đặt tài khoản</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={onLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="app-header">
      <div className="logo-section">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="clinic-name">IVF Clinic</span>
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="nav-menu"
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Trang chủ</Link>
        </Menu.Item>
        <Menu.Item key="/userservice" icon={<AppstoreOutlined />}>
          <Link to="/userservice">Dịch vụ</Link>
        </Menu.Item>
        <Menu.Item key="/blog" icon={<ReadOutlined />}>
          <Link to="/blog">Bài viết</Link>
        </Menu.Item>
        <Menu.Item key="/doctors" icon={<TeamOutlined />}>
          <Link to="/doctors">Bác sĩ</Link>
        </Menu.Item>

        {user ? (
          <Menu.Item key="user" className="user-menu">
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <Space className="avatar-dropdown" style={{ cursor: 'pointer' }}>
                <Avatar 
                  src={user.avatar || null} 
                  icon={!user.avatar && <UserOutlined />} 
                  style={{ marginRight: 8 }} 
                />
                <span className="user-name">{user.firstName} {user.lastName}</span>
              </Space>
            </Dropdown>
          </Menu.Item>
        ) : (
          <>
            <Menu.Item key="/login">
              <Link to="/login">Đăng nhập</Link>
            </Menu.Item>
            <Menu.Item key="/register">
              <Link to="/register">Đăng ký</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </AntHeader>
  );
};

export default Header;
