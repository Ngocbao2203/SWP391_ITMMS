import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import MainLayout from '../../layouts/MainLayout';
import SimpleServiceRegistrationForm from '../../components/public/SimpleServiceRegistrationForm';
import '../../styles/BookAppointment.css';

const { Title, Text } = Typography;

const BookAppointment = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Xử lý thành công
  const handleRegistrationSuccess = (response) => {
    setRegistrationSuccess(true);
    // Có thể thêm xử lý khác ở đây nếu cần
  };

  return (
    <MainLayout>
      <div className="book-appointment-container">
        <div className="book-appointment-header">
          <Title level={2}>Đặt lịch hẹn</Title>
          <Text>Vui lòng điền thông tin để đặt lịch hẹn với bác sĩ</Text>
        </div>
        
        <div className="appointment-form-container">
          <SimpleServiceRegistrationForm 
            service={selectedService}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default BookAppointment;
