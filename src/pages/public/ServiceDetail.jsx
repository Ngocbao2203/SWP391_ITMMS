import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Tabs, 
  List, 
  Avatar, 
  Divider,
  Tag,
  Rate,
  Spin,
  notification
} from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  TeamOutlined, 
  ClockCircleOutlined, 
  ReadOutlined,
  HeartOutlined,
  UserOutlined
} from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import { getServiceById } from '../../services/serviceRegistration';
import '../../styles/ServiceDetail.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  // Tải dữ liệu dịch vụ
  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const serviceData = await getServiceById(serviceId);
        setService(serviceData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
        setError("Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceData();
  }, [serviceId]);
  // Điều hướng đến trang đăng ký dịch vụ
  const handleRegisterService = () => {
    navigate(`/bookappointment/${serviceId}`, {
      state: { 
        service,
        source: 'ServiceDetail'
      }
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang tải thông tin dịch vụ..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="service-detail-container error">
          <Card className="error-card">
            <div className="error-content">
              <Title level={3}>Có lỗi xảy ra</Title>
              <Paragraph>{error}</Paragraph>
              <Button type="primary" onClick={() => navigate('/services')}>
                Quay lại danh sách dịch vụ
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!service) {
    return (
      <MainLayout>
        <div className="service-detail-container error">
          <Card className="error-card">
            <div className="error-content">
              <Title level={3}>Không tìm thấy dịch vụ</Title>
              <Paragraph>Dịch vụ này không tồn tại hoặc đã bị xóa.</Paragraph>
              <Button type="primary" onClick={() => navigate('/services')}>
                Quay lại danh sách dịch vụ
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="service-detail-container">
        {/* Phần header hiển thị thông tin cơ bản của dịch vụ */}
        <Card className="header-card">
          <Row gutter={24}>
            <Col xs={24} md={10}>
              <div className="service-image">
                <img src={service.image} alt={service.name} />
              </div>
            </Col>
            
            <Col xs={24} md={14}>
              <div className="service-intro">
                <Title level={2}>{service.name}</Title>
                
                <div className="service-stats">
                  <div className="stat-item">
                    <Rate disabled defaultValue={4.5} allowHalf />
                    <span className="rating-count">(120 đánh giá)</span>
                  </div>
                  
                  <div className="stat-item">
                    <UserOutlined />
                    <span>2000+ khách hàng đã sử dụng</span>
                  </div>
                </div>
                
                <Paragraph className="service-description">
                  {service.detailedDescription}
                </Paragraph>
                
                <Row className="service-highlights">
                  <Col span={12}>
                    <div className="highlight-item">
                      <CheckCircleOutlined className="highlight-icon" />
                      <span>Chuyên gia hàng đầu</span>
                    </div>
                    <div className="highlight-item">
                      <CheckCircleOutlined className="highlight-icon" />
                      <span>Thiết bị hiện đại</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="highlight-item">
                      <CheckCircleOutlined className="highlight-icon" />
                      <span>Tỷ lệ thành công cao</span>
                    </div>
                    <div className="highlight-item">
                      <CheckCircleOutlined className="highlight-icon" />
                      <span>Hỗ trợ trọn gói</span>
                    </div>
                  </Col>
                </Row>
                
                <Button 
                  type="primary" 
                  size="large" 
                  className="register-button"
                  onClick={handleRegisterService}
                >
                  Đăng ký dịch vụ
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
        
        {/* Tabs hiển thị các thông tin chi tiết */}
        <Card className="detail-card">
          <Tabs defaultActiveKey="details">
            <TabPane tab="Chi tiết dịch vụ" key="details">
              <div className="service-details">
                <Title level={4}>Mô tả chi tiết</Title>
                <Paragraph>
                  {service.detailedDescription}
                </Paragraph>
                
                <Title level={4}>Quy trình điều trị</Title>
                <div className="treatment-process">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <Title level={5}>Thăm khám và tư vấn</Title>
                      <Paragraph>
                        Bác sĩ thăm khám và tư vấn để xác định nguyên nhân hiếm muộn.
                      </Paragraph>
                    </div>
                  </div>
                  
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <Title level={5}>Kích thích buồng trứng</Title>
                      <Paragraph>
                        Sử dụng các loại thuốc để kích thích buồng trứng sản xuất nhiều trứng.
                      </Paragraph>
                    </div>
                  </div>
                  
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <Title level={5}>Thu nhận trứng</Title>
                      <Paragraph>
                        Tiến hành thủ thuật để thu nhận trứng khi trứng đã trưởng thành.
                      </Paragraph>
                    </div>
                  </div>
                  
                  <div className="process-step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <Title level={5}>Thụ tinh trong phòng thí nghiệm</Title>
                      <Paragraph>
                        Trứng được thụ tinh với tinh trùng trong điều kiện phòng thí nghiệm.
                      </Paragraph>
                    </div>
                  </div>
                  
                  <div className="process-step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <Title level={5}>Chuyển phôi</Title>
                      <Paragraph>
                        Phôi được chuyển vào tử cung của người phụ nữ.
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
            
            <TabPane tab="Đội ngũ chuyên gia" key="experts">
              <div className="service-doctors">
                <Title level={4}>Bác sĩ chuyên khoa</Title>
                <Row gutter={[24, 24]}>
                  {service.doctors && service.doctors.map(doctor => (
                    <Col xs={24} sm={12} md={8} key={doctor.id}>
                      <Card 
                        className="doctor-card" 
                        hoverable 
                        cover={
                          <div className="doctor-image-container">
                            <img 
                              alt={doctor.name}
                              src={doctor.photo} 
                              className="doctor-photo"
                            />
                          </div>
                        }
                      >
                        <div className="doctor-info">
                          <Title level={4}>{doctor.name}</Title>
                          <Tag color="blue">{doctor.specialty}</Tag>
                          <div className="doctor-experience">
                            <Text type="secondary">{doctor.experience}</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </TabPane>
            
            <TabPane tab="Câu hỏi thường gặp" key="faq">
              <div className="service-faq">
                <Title level={4}>Những câu hỏi thường gặp</Title>
                <List
                  itemLayout="vertical"
                  dataSource={[
                    {
                      question: "Tỷ lệ thành công của phương pháp này là bao nhiêu?",
                      answer: "Tỷ lệ thành công của phương pháp này phụ thuộc vào nhiều yếu tố như tuổi, nguyên nhân vô sinh và sức khỏe tổng thể. Tỷ lệ thành công trung bình dao động từ 30-60% sau một chu kỳ điều trị."
                    },
                    {
                      question: "Chi phí điều trị thường là bao nhiêu?",
                      answer: "Chi phí điều trị dao động tùy thuộc vào phương pháp và nhu cầu cá nhân của từng cặp đôi. Trung tâm sẽ tư vấn chi tiết về chi phí sau khi thăm khám và đánh giá."
                    },
                    {
                      question: "Liệu phương pháp này có đau không?",
                      answer: "Hầu hết các thủ thuật được thực hiện dưới sự hỗ trợ của thuốc giảm đau hoặc gây tê nhẹ. Bệnh nhân có thể cảm thấy hơi khó chịu sau thủ thuật nhưng không gây đau đáng kể."
                    },
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <div className="faq-item">
                        <Title level={5} className="faq-question">
                          <ReadOutlined /> {item.question}
                        </Title>
                        <Paragraph className="faq-answer">{item.answer}</Paragraph>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
        
        {/* Call to action */}
        <Card className="cta-card">
          <div className="cta-content">
            <Title level={3}>Bạn còn thắc mắc về dịch vụ này?</Title>
            <Paragraph>
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc và tư vấn chi tiết về dịch vụ.
              Liên hệ ngay để được hỗ trợ tốt nhất.
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={handleRegisterService}
            >
              Đăng ký dịch vụ ngay
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ServiceDetail;