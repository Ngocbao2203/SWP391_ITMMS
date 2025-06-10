import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { 
  UserOutlined, 
  LoginOutlined, 
  EditOutlined, 
  CalendarOutlined, 
  MedicineBoxOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Component UserAvatar
const UserAvatar = ({ user, onLogout }) => {
  // Nếu không có user, hiển thị fallback
  if (!user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <EditOutlined /> Hồ sơ cá nhân
        </Link>
      </Menu.Item>
      <Menu.Item key="appointments">
        <Link to="/bookappointment">
          <CalendarOutlined /> Lịch hẹn
        </Link>
      </Menu.Item>
      <Menu.Item key="treatment">
        <Link to="/profile">
          <FileTextOutlined /> Tiến trình điều trị
        </Link>
      </Menu.Item>
      <Menu.Item key="medical-records">
        <Link to="/profile">
          <MedicineBoxOutlined /> Hồ sơ y tế
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
            <h3>{user?.name || 'Tên người dùng'}</h3>
            <p>{user?.email || 'Email chưa có'}</p>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserAvatar;
