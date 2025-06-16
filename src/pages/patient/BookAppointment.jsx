import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Spin, Button, Tooltip, message } from 'antd';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import IvfAppointmentForm from '../../components/public/IvfAppointmentForm';
import '../../styles/BookAppointment.css';
import { 
  PhoneOutlined, HeartOutlined, ClockCircleOutlined, SafetyCertificateOutlined, 
  CheckCircleFilled, RightOutlined, StarFilled, FileTextOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { getServiceById } from '../../services/serviceRegistration';

const { Title, Text, Paragraph } = Typography;

const BookAppointment = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedService, setSelectedService] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(serviceId ? true : false);
  const [sourceRoute, setSourceRoute] = useState('/userservice'); // Mặc định là userservice

  // Tải thông tin dịch vụ nếu có serviceId từ URL
  useEffect(() => {
    const loadServiceData = async () => {
      if (serviceId) {
        setPageLoading(true);
        try {
          const serviceData = await getServiceById(serviceId);
          setSelectedService(serviceData);
        } catch (error) {
          console.error("Lỗi khi tải thông tin dịch vụ:", error);
        } finally {
          setPageLoading(false);
        }
      } else if (location.state && location.state.service) {
        // Nhận thông tin dịch vụ từ state của location (nếu được truyền)
        setSelectedService(location.state.service);
        
        // Lưu thông tin về trang nguồn
        if (location.state.source) {
          switch(location.state.source) {
            case 'UserService':
              setSourceRoute('/userservice');
              break;
            case 'ServiceDetail':
              const serviceID = location.state.service?.id || '';
              setSourceRoute(`/services/${serviceID}`);
              break;
            default:
              setSourceRoute('/userservice');
          }
          
          // Hiển thị thông báo nếu từ UserService
          if (location.state.source === 'UserService') {
            setTimeout(() => {
              message.success('Bạn đã chọn dịch vụ ' + location.state.service.name);
            }, 500);
          }
        }
      }
    };
    
    loadServiceData();
  }, [serviceId, location]);
  
  // Xử lý thành công
  const handleRegistrationSuccess = (response) => {
    setRegistrationSuccess(true);
    // Thêm animation thông báo thành công
    setTimeout(() => {
      setFormLoading(false);
    }, 500);
  };
  
  // Giả lập trạng thái loading khi submit form
  const handleFormSubmitting = () => {
    setFormLoading(true);
  };
  // Hiển thị loading khi đang tải thông tin dịch vụ
  if (pageLoading) {
    return (
      <MainLayout>
        <div className="book-appointment-hero">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '400px',
            width: '100%'
          }}>
            <Spin size="large" tip="Đang tải thông tin dịch vụ..." />
          </div>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div className="book-appointment-hero">
        <div className="book-appointment-container">
          <Row gutter={[30, 24]} className="appointment-content-row">
            <Col xs={24} md={12} lg={12} className="appointment-left-content">
              <div className="appointment-text-content">
                <div className="appointment-header-badge">
                  <StarFilled className="badge-icon" /> Dịch vụ IVF hàng đầu
                </div>
                <Title level={1}>Đăng ký dịch vụ IVF</Title>
                <Paragraph className="hero-subtitle">
                  Hãy để chúng tôi đồng hành cùng bạn trong hành trình làm cha mẹ với giải pháp điều trị hiệu quả
                </Paragraph>
                
                <div className="appointment-features">
                  <div className="appointment-feature-item">
                    <SafetyCertificateOutlined className="feature-icon" />
                    <div className="feature-text">
                      <Text strong>Đội ngũ chuyên nghiệp</Text>
                      <Text>Các bác sĩ giàu kinh nghiệm</Text>
                    </div>
                  </div>
                  
                  <div className="appointment-feature-item">
                    <HeartOutlined className="feature-icon" />
                    <div className="feature-text">
                      <Text strong>Chăm sóc tận tâm</Text>
                      <Text>Hỗ trợ 24/7 trong suốt quá trình</Text>
                    </div>
                  </div>
                  
                  <div className="appointment-feature-item">
                    <ClockCircleOutlined className="feature-icon" />
                    <div className="feature-text">
                      <Text strong>Linh hoạt thời gian</Text>
                      <Text>Đặt lịch theo nhu cầu của bạn</Text>
                    </div>
                  </div>
                </div>
                
                <div className="appointment-badges">
                  <div className="appointment-badge">
                    <span className="badge-number">95%</span>
                    <span className="badge-text">Tỷ lệ thành công</span>
                  </div>
                  <div className="appointment-badge">
                    <span className="badge-number">150+</span>
                    <span className="badge-text">Bác sĩ chuyên môn</span>
                  </div>
                  <div className="appointment-badge">
                    <span className="badge-number">10k+</span>
                    <span className="badge-text">Khách hàng hài lòng</span>
                  </div>
                </div>                  <div className="appointment-actions">
                  <Button 
                    type="primary" 
                    ghost
                    className="action-btn back-btn" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate(sourceRoute)}
                  >
                    Quay lại trang dịch vụ
                  </Button>
                  <Tooltip title="Gọi ngay để được tư vấn">
                    <div className="appointment-contact">
                      <PhoneOutlined className="contact-icon" />
                      <div>
                        <Text className="contact-label">Cần trợ giúp?</Text>
                        <Title level={5} className="contact-phone">+84 969 123 456</Title>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12} lg={12} className="appointment-right-content">
              <div className={`appointment-form-wrapper ${formLoading ? 'form-loading' : ''}`}>
                {formLoading && (
                  <div className="form-overlay">
                    <Spin size="large" />
                  </div>
                )}                <div className="appointment-form-container">
                  <IvfAppointmentForm 
                    service={selectedService}
                    onRegistrationSuccess={handleRegistrationSuccess}
                    onSubmitting={handleFormSubmitting}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookAppointment;
