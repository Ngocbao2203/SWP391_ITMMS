import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  LoginOutlined,
} from "@ant-design/icons";
// import logo from '../../assets/logo192.png';
import "../../styles/Header.css";

const { Header: AntHeader } = Layout;

const Header = ({ user, onLogout }) => {
  const location = useLocation();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout} icon={<LoginOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="app-header">
      <div className="logo-section">
        {/* <img src={logo} alt="Clinic Logo" className="logo-img" /> */}
        <span className="clinic-name">My Clinic</span>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="nav-menu"
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/services" icon={<AppstoreOutlined />}>
          <Link to="/UserServices">Services</Link>
        </Menu.Item>
        <Menu.Item key="/articles" icon={<ReadOutlined />}>
          <Link to="/articles">Articles</Link>
        </Menu.Item>
        <Menu.Item key="/doctors" icon={<TeamOutlined />}>
          <Link to="/doctors">Doctors</Link>
        </Menu.Item>

        {user?.username ? (
          <Menu.Item key="user" className="user-menu">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <span>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                {user.username}
              </span>
            </Dropdown>
          </Menu.Item>
        ) : (
          <>
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="/register">
              <Link to="/register">Register</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </AntHeader>
  );
};

export default Header;
