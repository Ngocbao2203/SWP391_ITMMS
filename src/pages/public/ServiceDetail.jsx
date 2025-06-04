import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  List,
  Rate,
  Row,
  Col,
  Tabs,
} from 'antd';

import MainLayout from '../../layouts/MainLayout';
import '../../styles/ServiceDetail.css'; // Import your CSS styles

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// Dữ liệu mẫu
const serviceData = [
  {
    id: 'ivf',
    title: 'Thụ tinh trong ống nghiệm (IVF)',
    description: 'Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ.',
    details: 'IVF là phương pháp điều trị giúp thụ thai cho những cặp vợ chồng gặp khó khăn trong việc có con. Quy trình này bao gồm việc lấy trứng từ người phụ nữ, thụ tinh ngoài cơ thể và cấy phôi vào tử cung.',
    pricing: [
      { name: 'Dịch vụ cơ bản', amount: 5000000 },
      { name: 'Dịch vụ cao cấp', amount: 8000000 }
    ],
    doctors: [
      { name: 'Dr. Nguyễn Văn A', specialty: 'IVF Specialist', photo: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png ' },
      { name: 'Dr. Trần Thị B', specialty: 'IUI Expert', photo: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png ' }
    ],
    schedule: [
      { day: 'Ngày 1', activity: 'Khám sức khỏe và xác nhận hồ sơ.' },
      { day: 'Ngày 3-5', activity: 'Tiêm thuốc kích trứng và theo dõi phát triển.' },
      { day: 'Ngày 7', activity: 'Thụ tinh ngoài cơ thể.' },
    ],
    faqs: [
      { question: 'Quy trình IVF mất bao lâu?', answer: 'Quy trình có thể kéo dài từ 2 đến 3 tuần tùy vào tình trạng sức khỏe của bệnh nhân.' },
      { question: 'Chi phí dịch vụ IVF là bao nhiêu?', answer: 'Chi phí dao động từ 5 triệu VND đến 8 triệu VND tùy chọn dịch vụ.' }
    ],
    reviews: [
      { patient: 'Chị Mai', rating: 5, comment: 'IVF tại đây thật tuyệt vời, tôi đã có em bé sau 3 lần thử.' },
      { patient: 'Anh Hùng', rating: 4, comment: 'Cảm ơn đội ngũ bác sĩ, dịch vụ rất tốt.' },
    ],
    image: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png '
  },
];

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = serviceData.find(s => s.id === serviceId);

  if (!service) {
    return (
      <MainLayout>
        <Typography.Title level={2} type="danger">Dịch vụ không tồn tại!</Typography.Title>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="service-detail-container">
        {/* Hình ảnh & Tiêu đề */}
        <Card bordered={false} className="header-card">
          <img src={service.image} alt={service.title} className="service-image" />
          <div className="service-info">
            <Title level={2}>{service.title}</Title>
            <Paragraph>{service.description}</Paragraph>
          </div>
        </Card>

        {/* Nội dung chính với Tabs */}
        <Card bordered={false} className="content-card">
          <Tabs defaultActiveKey="1" tabPosition="left">
            <TabPane tab="Thông tin chi tiết" key="1">
              <Paragraph>{service.details}</Paragraph>
            </TabPane>

            <TabPane tab="Bảng giá" key="2">
              <List
                dataSource={service.pricing}
                renderItem={(item) => (
                  <List.Item>
                    <strong>{item.name}:</strong> {item.amount.toLocaleString()} VND
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="Bác sĩ" key="3">
              <Row gutter={[16, 16]}>
                {service.doctors.map((doctor, index) => (
                  <Col xs={24} sm={12} md={12} lg={12} key={index}>
                    <Card hoverable className="doctor-card">
                      <Row align="middle">
                        <Col span={6}>
                          <img src={doctor.photo} alt={doctor.name} className="doctor-photo" />
                        </Col>
                        <Col span={18}>
                          <strong>{doctor.name}</strong>
                          <p>{doctor.specialty}</p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>

            <TabPane tab="Lịch trình" key="4">
              <List
                dataSource={service.schedule}
                renderItem={(item) => (
                  <List.Item>
                    <strong>{item.day}:</strong> {item.activity}
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="FAQ" key="5">
              <List
                dataSource={service.faqs}
                renderItem={(faq) => (
                  <List.Item>
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="Đánh giá" key="6">
              <List
                dataSource={service.reviews}
                renderItem={(review) => (
                  <List.Item>
                    <div style={{ width: '100%' }}>
                      <strong>{review.patient}</strong>
                      <Rate disabled value={review.rating} />
                      <p>{review.comment}</p>
                    </div>
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* Nút hành động */}
        <div className="cta-section">
          <Button type="primary" href={`/register/${serviceId}`} size="large" block>
            Đăng ký dịch vụ
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServiceDetail;
