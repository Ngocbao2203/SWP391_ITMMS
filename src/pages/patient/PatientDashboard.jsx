import React from 'react';
import { Card, Typography, Tabs, Row, Col, Button, notification } from 'antd';
import MainLayout from '../../layouts/MainLayout';
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import PatientProfile from './PatientProfile';
import AppointmentHistory from './AppointmentHistory';
import MedicalRecords from './MedicalRecords';
import TreatmentHistory from './TreatmentHistory';
import '../../styles/PatientDashboard.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const PatientDashboard = () => {
  const openNotification = () => {
    notification.info({
      message: 'Lịch Nhắc Nhở',
      description: 'Đừng quên tiêm thuốc vào ngày mai và xét nghiệm vào tuần tới.',
      placement: 'topRight',
    });
  };

  return (
    <MainLayout>
      <div className="patient-dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <Title level={3} className="dashboard-title">
            Thông Tin Cá Nhân
          </Title>
        </div>

        {/* Tabs Section */}
        <Card className="section-card profile-tabs-card">
          <Tabs defaultActiveKey="1" size="large" animated centered className="custom-tabs">
            <TabPane
              tab={
                <span>
                  <UserOutlined /> Hồ Sơ
                </span>
              }
              key="1"
            >
              <PatientProfile />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CalendarOutlined /> Lịch Hẹn
                </span>
              }
              key="2"
            >
              <AppointmentHistory />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileTextOutlined /> Điều Trị
                </span>
              }
              key="3"
            >
              <TreatmentHistory />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MedicineBoxOutlined /> Hồ Sơ Y Tế
                </span>
              }
              key="4"
            >
              <MedicalRecords />
            </TabPane>
          </Tabs>
        </Card>

        {/* Services Section */}
        <Card className="section-card services-card">
          <Title level={4}>Dịch Vụ Điều Trị</Title>
          <Row gutter={[24, 24]} justify="start">
            <Col xs={24} sm={12} md={8}>
              <Card
                title="IUI (Thụ Tinh Trong Tử Cung)"
                bordered={false}
                className="service-card"
                hoverable
              >
                <Button type="primary" block size="large" className="action-button">
                  Đăng Ký IUI
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                title="IVF (Thụ Tinh Trong Ống Nghiệm)"
                bordered={false}
                className="service-card"
                hoverable
              >
                <Button type="primary" block size="large" className="action-button">
                  Đăng Ký IVF
                </Button>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;