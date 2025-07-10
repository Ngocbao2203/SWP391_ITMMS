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
        {/* Chỉ render trực tiếp PatientProfile, không còn Tabs lớn */}
        <PatientProfile />
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;