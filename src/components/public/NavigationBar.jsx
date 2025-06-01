import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, ScheduleOutlined, FileTextOutlined, FileProtectOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const NavigationBar = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/patient-dashboard/profile">
              <UserOutlined /> Hồ Sơ Cá Nhân
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/patient-dashboard/appointments">
              <ScheduleOutlined /> Cuộc Hẹn
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/patient-dashboard/treatment-history">
              <FileTextOutlined /> Lịch Sử Điều Trị
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/patient-dashboard/medical-records">
              <FileProtectOutlined /> Hồ Sơ Y Tế
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
            <Menu.Item key="1">
              <Link to="/patient-dashboard/profile">Thông tin cá nhân</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/patient-dashboard/appointments">Quản lý cuộc hẹn</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/patient-dashboard/treatment-history">Lịch sử điều trị</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/patient-dashboard/medical-records">Hồ sơ y tế</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <h1>Chào mừng đến với Hồ Sơ Bệnh Nhân</h1>
            <p>Chọn các phần từ thanh điều hướng để xem chi tiết.</p>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default NavigationBar;
