import React from 'react';
import { Typography } from 'antd';
import MainLayout from '../../layouts/MainLayout';

import PatientProfile from './PatientProfile';
import '../../styles/PatientDashboard.css';

const { Title } = Typography;

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
        {/* Chỉ render trực tiếp PatientProfile, không còn Tabs lớn */}
        <PatientProfile />
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;