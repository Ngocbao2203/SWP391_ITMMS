import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import authService from '../../services/authService'; // Nhập authService

const UserAvatar = ({ user, onLogout }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const profile = await authService.getUserProfile(user.id);
          setUserProfile(profile); // Lưu profile vào state
        } catch (error) {
          console.error('Lỗi khi lấy profile:', error);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  if (!user || !userProfile) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Hồ sơ cá nhân
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout} icon={<LoginOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="user-avatar-container">
      <Dropdown overlay={userMenu} placement="bottomRight">
        <div className="user-avatar">
          <Avatar size={64} icon={<UserOutlined />} />
          <div className="user-info">
            <h3>{userProfile?.fullName || 'Tên người dùng'}</h3>
            <p>{userProfile?.email || 'Email chưa có'}</p>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserAvatar;