// Trang chi tiết dịch vụ điều trị cho khách truy cập
// Sử dụng Ant Design cho UI, quản lý state bằng React hook
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tabs,
  List,
  Tag,
  Rate,
  Spin,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import { treatmentService } from "../../services";
import "../../styles/ServiceDetail.css";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// Component chính hiển thị chi tiết dịch vụ
const ServiceDetail = () => {
  // Lấy id dịch vụ từ URL
  const { serviceId } = useParams();
  const navigate = useNavigate();
  // State lưu trữ dữ liệu dịch vụ, loading, error
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  // Tải dữ liệu dịch vụ khi component mount hoặc serviceId thay đổi
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi tải lại
    const fetchServiceData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await treatmentService.getTreatmentServiceDetails(
          serviceId
        );
        if (response && (response.success || response.data)) {
          const serviceData = response.data || response;
          setService(serviceData);
        } else {
          setError("Không thể tìm thấy thông tin dịch vụ.");
          message.error("Không thể tìm thấy thông tin dịch vụ.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
        setError("Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.");
        message.error("Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);

  // Điều hướng đến trang đặt lịch dịch vụ
  const handleRegisterService = () => {
    navigate(`/bookappointment/${serviceId}`, {
      state: {
        service,
        source: "ServiceDetail",
      },
    });
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Spin size="large" tip="Đang tải thông tin dịch vụ..." />
        </div>
      </MainLayout>
    );
  }

  // Hiển thị khi có lỗi
  if (error) {
    return (
      <MainLayout>
        <div className="service-detail-container error">
          <Card className="error-card">
            <div className="error-content">
              <Title level={3}>Có lỗi xảy ra</Title>
              <Paragraph>{error}</Paragraph>
              <Button type="primary" onClick={() => navigate("/services")}>
                Quay lại danh sách dịch vụ
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Hiển thị khi không tìm thấy dịch vụ
  if (!service) {
    return (
      <MainLayout>
        <div className="service-detail-container error">
          <Card className="error-card">
            <div className="error-content">
              <Title level={3}>Không tìm thấy dịch vụ</Title>
              <Paragraph>Dịch vụ này không tồn tại hoặc đã bị xóa.</Paragraph>
              <Button type="primary" onClick={() => navigate("/services")}>
                Quay lại danh sách dịch vụ
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Render giao diện chi tiết dịch vụ
  return (
    <MainLayout>
      <div className="service-detail-container">
        {/* Phần header hiển thị thông tin cơ bản của dịch vụ */}
        <Card className="header-card">
          <Row gutter={24}>
            <Col xs={24} md={10}>
              <div className="service-image">
                <img
                  src={
                    service.image ||
                    service.Image ||
                    "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png"
                  }
                  alt={
                    service.serviceName ||
                    service.ServiceName ||
                    service.name ||
                    "Dịch vụ"
                  }
                />
              </div>
            </Col>

            <Col xs={24} md={14}>
              <div className="service-intro">
                <Title level={2}>
                  {service.serviceName || service.ServiceName || service.name}
                </Title>

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
                  {service.detailedDescription ||
                    service.DetailedDescription ||
                    service.description ||
                    service.Description}
                </Paragraph>

                <div className="service-additional-info">
                  <p>
                    <strong>Giá cơ bản:</strong>{" "}
                    {service.basePrice?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>Thời gian điều trị:</strong> {service.durationDays}{" "}
                    ngày
                  </p>
                  <p>
                    <strong>Tỷ lệ thành công:</strong> {service.successRate}%
                  </p>
                </div>

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

                {/* Nút đặt lịch dịch vụ */}
                <Button
                  type="primary"
                  size="large"
                  className="register-button"
                  onClick={handleRegisterService}
                >
                  Đặt Lịch
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Tabs hiển thị các thông tin chi tiết dịch vụ */}
        <Card className="detail-card">
          <Tabs defaultActiveKey="details">
            <TabPane tab="Chi tiết dịch vụ" key="details">
              <div className="service-details">
                <Title level={4}>Mô tả chi tiết</Title>
                <Paragraph>
                  {service.detailedDescription || service.description}
                </Paragraph>

                <Title level={4}>Quy trình điều trị</Title>
                <div className="treatment-process">
                  {service.procedures ? (
                    service.procedures.split("→").map((step, index) => (
                      <div className="process-step" key={index}>
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <Title level={5}>
                            Bước {index + 1}: {step.trim()}
                          </Title>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="process-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <Title level={5}>Thăm khám và tư vấn</Title>
                          <Paragraph>
                            Bác sĩ thăm khám và tư vấn để xác định nguyên nhân
                            hiếm muộn.
                          </Paragraph>
                        </div>
                      </div>
                      <div className="process-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <Title level={5}>Điều trị</Title>
                          <Paragraph>
                            Áp dụng phương pháp điều trị phù hợp với tình trạng
                            của bệnh nhân.
                          </Paragraph>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Title level={4}>Yêu cầu</Title>
                <Paragraph>
                  {service.requirements || "Không có yêu cầu cụ thể"}
                </Paragraph>
              </div>
            </TabPane>

            {/* Tab đội ngũ chuyên gia */}
            <TabPane tab="Đội ngũ chuyên gia" key="experts">
              <div className="service-doctors">
                <Title level={4}>Bác sĩ chuyên khoa</Title>
                <Row gutter={[24, 24]}>
                  {(service.doctors || []).length > 0 ? (
                    (service.doctors || []).map((doctor, index) => (
                      <Col xs={24} sm={12} md={8} key={doctor.id || index}>
                        <Card
                          className="doctor-card"
                          hoverable
                          cover={
                            <div className="doctor-image-container">
                              <img
                                alt={doctor.name || "Bác sĩ"}
                                src={
                                  doctor.photo ||
                                  "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png"
                                }
                                className="doctor-photo"
                              />
                            </div>
                          }
                        >
                          <div className="doctor-info">
                            <Title level={4}>{doctor.name}</Title>
                            <Tag color="blue">
                              {doctor.specialty || "Chuyên khoa"}
                            </Tag>
                            <div className="doctor-experience">
                              <Text type="secondary">
                                {doctor.experience || "Chuyên gia"}
                              </Text>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <Col span={24}>
                      <div className="no-doctors">
                        <Text>Chưa có thông tin bác sĩ cho dịch vụ này.</Text>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </TabPane>

            {/* Tab FAQ */}
            <TabPane tab="Câu hỏi thường gặp" key="faq">
              <div className="service-faq">
                <Title level={4}>Những câu hỏi thường gặp</Title>
                <List
                  itemLayout="vertical"
                  dataSource={
                    (service.faq || []).length > 0
                      ? service.faq
                      : [
                          {
                            question:
                              "Tỷ lệ thành công của phương pháp này là bao nhiêu?",
                            answer: `Tỷ lệ thành công là ${
                              service.successRate || 0
                            }% tùy thuộc vào tình trạng sức khỏe.`,
                          },
                          {
                            question: "Chi phí điều trị thường là bao nhiêu?",
                            answer: `Chi phí cơ bản là ${
                              service.basePrice?.toLocaleString("vi-VN") || 0
                            } VND, có thể thay đổi theo yêu cầu cụ thể.`,
                          },
                          {
                            question: "Liệu phương pháp này có đau không?",
                            answer:
                              "Hầu hết các thủ thuật được thực hiện với thuốc giảm đau nhẹ, không gây đau đáng kể.",
                          },
                        ]
                  }
                  renderItem={(item) => (
                    <List.Item>
                      <div className="faq-item">
                        <Title level={5} className="faq-question">
                          <ReadOutlined /> {item.question}
                        </Title>
                        <Paragraph className="faq-answer">
                          {item.answer}
                        </Paragraph>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Call to action cuối trang */}
        <Card className="cta-card">
          <div className="cta-content">
            <Title level={3}>Bạn quan tâm đến dịch vụ này?</Title>
            <Paragraph>
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ và giải đáp
              mọi thắc mắc của bạn. Đăng ký ngay để được phục vụ tốt nhất.
            </Paragraph>
            <Button type="primary" size="large" onClick={handleRegisterService}>
              Đăng ký dịch vụ ngay
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ServiceDetail;
// Kết thúc file ServiceDetail.jsx
