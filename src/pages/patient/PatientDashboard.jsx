import React from 'react';
import { Card, Typography, Tabs } from 'antd';
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
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;