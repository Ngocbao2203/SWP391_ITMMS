import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import authService from "../../services/authService";
import "../../styles/Header.css";

const { Header: AntHeader } = Layout;

const Header = ({ user: initialUser, onLogout }) => {
  const location = useLocation();
  const [user, setUser] = useState(initialUser);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (initialUser?.id) {
        try {
          const profile = await authService.getUserProfile(initialUser.id);
          // console.log("User profile fetched:", profile);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserProfile();
    setUser(initialUser);
  }, [initialUser]);

  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: <Link to="/profile">Hồ sơ cá nhân</Link>,
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: <span onClick={onLogout}>Đăng xuất</span>,
      },
    ],
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "/userservice",
      icon: <AppstoreOutlined />,
      label: <Link to="/userservice">Dịch vụ</Link>,
    },
    {
      key: "/blog",
      icon: <ReadOutlined />,
      label: <Link to="/blog">Bài viết</Link>,
    },
    {
      key: "/doctors",
      icon: <TeamOutlined />,
      label: <Link to="/doctors">Bác sĩ</Link>,
    },
    ...(user
      ? [
          {
            key: "user",
            className: "user-menu",
            label: (
              <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    size="default"
                    src={userProfile?.avatar || user?.avatar || null}
                    icon={!userProfile?.avatar && !user?.avatar && <UserOutlined />}
                  />
                  <span className="nav-text">
                    {userProfile?.fullName || user?.fullName || "Người dùng"}
                  </span>
                </div>
              </Dropdown>
            ),
          },
        ]
      : [
          {
            key: "/login",
            label: <Link to="/login">Đăng nhập</Link>,
          },
          {
            key: "/register",
            label: <Link to="/register">Đăng ký</Link>,
          },
        ]),
  ];

  return (
    <AntHeader className="app-header">
      <div className="logo-section-hd">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <span className="clinic-name">IVF Clinic</span>
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="nav-menu"
        items={menuItems}
      />
    </AntHeader>
  );
};

export default Header;