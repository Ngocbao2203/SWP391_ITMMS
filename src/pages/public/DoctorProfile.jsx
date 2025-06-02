import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Button, 
  Rate, 
  Breadcrumb, 
  message,
  Tag
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  MessageOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  StarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/DoctorProfile.css';

const { Title, Paragraph, Text } = Typography;

// Dữ liệu chi tiết bác sĩ mở rộng
const doctorsDetailData = {
  1: {
    id: 1,
    name: "Bác sĩ Nguyễn Văn An",
    specialty: "Chuyên gia IVF",
    experience: "15 năm kinh nghiệm",
    rating: 4.9,
    reviewCount: 156,
    successfulCases: 1250,
    patientsCount: 890,
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description: "Bác sĩ Nguyễn Văn An là chuyên gia hàng đầu trong lĩnh vực thụ tinh trong ống nghiệm (IVF) với hơn 15 năm kinh nghiệm. Ông đã giúp hàng ngàn cặp vợ chồng hiếm muộn có con thành công. Với tỷ lệ thành công cao và phong cách tư vấn tận tâm, bác sĩ An được nhiều bệnh nhân tin tưởng và yêu mến.",
    achievements: [
      "Tiến sĩ Y khoa - Đại học Y Hà Nội",
      "Chứng chỉ IVF quốc tế - ESHRE",
      "Giải thưởng bác sĩ xuất sắc 2023",
      "Chủ nhiệm khoa IVF - Bệnh viện Phụ sản Trung ương",
      "Tác giả 25+ nghiên cứu khoa học quốc tế"
    ],
    availability: {
      "Thứ Hai": "8:00 - 17:00",
      "Thứ Ba": "8:00 - 17:00", 
      "Thứ Tư": "8:00 - 17:00",
      "Thứ Năm": "8:00 - 17:00",
      "Thứ Sáu": "8:00 - 17:00",
      "Thứ Bảy": "8:00 - 12:00",
      "Chủ Nhật": "Nghỉ"
    },
    specializations: ["IVF", "ICSI", "Phôi đông lạnh", "PGT", "Tư vấn di truyền"],
    languages: ["Tiếng Việt", "English", "中文"],
    education: "Tiến sĩ Y khoa - Đại học Y Hà Nội (2008)",
    hospital: "Bệnh viện Phụ sản Trung ương",
    reviews: [
      {
        id: 1,
        patientName: "Chị Hoàng Minh",
        rating: 5,
        date: "15/01/2025",
        content: "Bác sĩ An rất tận tâm và chu đáo. Sau 3 năm hiếm muộn, nhờ bác sĩ mà tôi đã có con. Rất biết ơn bác sĩ!"
      },
      {
        id: 2,
        patientName: "Anh Tuấn Anh",
        rating: 5,
        date: "10/01/2025",
        content: "Quy trình IVF được giải thích rất kỹ, bác sĩ luôn theo dõi sát sao. Vợ chồng tôi rất hài lòng."
      },
      {
        id: 3,
        patientName: "Chị Thanh Hoa",
        rating: 4,
        date: "05/01/2025",
        content: "Bác sĩ giàu kinh nghiệm, tư vấn rất chi tiết. Thái độ thân thiện, dễ gần."
      }
    ]
  },
  2: {
    id: 2,
    name: "Bác sĩ Trần Thị Bình",
    specialty: "Chuyên gia IUI",
    experience: "12 năm kinh nghiệm",
    rating: 4.8,
    reviewCount: 134,
    successfulCases: 780,
    patientsCount: 650,
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description: "Bác sĩ Trần Thị Bình chuyên về thụ tinh nhân tạo (IUI) và tư vấn điều trị hiếm muộn. Bà được biết đến với phong cách tư vấn tận tình và chu đáo, luôn lắng nghe và chia sẻ với các cặp vợ chồng khó khăn.",
    achievements: [
      "Thạc sĩ Y khoa - Đại học Y TP.HCM",
      "Chứng chỉ IUI chuyên sâu",
      "Giảng viên trường Đại học Y",
      "10+ năm kinh nghiệm lâm sàng",
      "Tỷ lệ thành công IUI: 85%"
    ],
    availability: {
      "Thứ Hai": "Nghỉ",
      "Thứ Ba": "8:30 - 16:30",
      "Thứ Tư": "8:30 - 16:30",
      "Thứ Năm": "8:30 - 16:30",
      "Thứ Sáu": "8:30 - 16:30",
      "Thứ Bảy": "8:30 - 16:30",
      "Chủ Nhật": "8:30 - 12:00"
    },
    specializations: ["IUI", "Tư vấn hiếm muộn", "Điều trị hormone", "Siêu âm âm đạo"],
    languages: ["Tiếng Việt", "English"],
    education: "Thạc sĩ Y khoa - Đại học Y TP.HCM (2012)",
    hospital: "Phòng khám Chuyên khoa IUI",
    reviews: [
      {
        id: 1,
        patientName: "Chị Mai Linh",
        rating: 5,
        date: "18/01/2025",
        content: "Bác sĩ Bình rất tận tâm, giải thích rất dễ hiểu. Lần đầu IUI đã thành công luôn."
      },
      {
        id: 2,
        patientName: "Chị Phương Anh",
        rating: 4,
        date: "12/01/2025",
        content: "Quy trình chuyên nghiệp, bác sĩ theo dõi sát sao từng bước."
      }
    ]
  }
  // Có thể thêm dữ liệu cho các bác sĩ khác...
};

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctorsDetailData[id];

  if (!doctor) {
    return (
      <MainLayout>
        <div className="doctor-profile-page">
          <div className="doctor-profile-container">
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Title level={3}>Không tìm thấy thông tin bác sĩ</Title>
              <Button type="primary" onClick={() => navigate('/doctors')}>
                Quay lại danh sách bác sĩ
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleBookConsultation = () => {
    message.success(`Đã gửi yêu cầu đặt lịch tư vấn với ${doctor.name}. Chúng tôi sẽ liên hệ với bạn trong 24h!`);
  };

  const handleContactDoctor = () => {
    message.info('Tính năng nhắn tin trực tiếp với bác sĩ sẽ được phát triển trong phiên bản tiếp theo.');
  };

  const handleBackToList = () => {
    navigate('/doctors');
  };

  return (
    <MainLayout>
      <div className="doctor-profile-page">
        <div className="doctor-profile-container">
          {/* Breadcrumb */}
          <div className="breadcrumb-section">
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href="/">Trang chủ</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href="/doctors">Danh sách bác sĩ</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{doctor.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Back Button */}
          <div style={{ marginBottom: '16px' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToList}
              className="back-button"
            >
              Quay lại danh sách
            </Button>
          </div>

          {/* Doctor Header */}
          <Card className="doctor-header-card" data-aos="fade-up">
            <div className="doctor-header-content">
              <div className="doctor-avatar-section">
                <img 
                  src={doctor.photo} 
                  alt={doctor.name}
                  className="doctor-main-photo"
                />
              </div>
              
              <div className="doctor-info-section">
                <Title level={1} className="doctor-profile-name">
                  {doctor.name}
                </Title>
                
                <div className="doctor-profile-specialty">
                  <MedicineBoxOutlined style={{ marginRight: '8px' }} />
                  {doctor.specialty}
                </div>

                <div className="doctor-quick-stats">
                  <div className="stat-item">
                    <span className="stat-number">{doctor.experience.split(' ')[0]}</span>
                    <span className="stat-label">Năm kinh nghiệm</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{doctor.successfulCases}+</span>
                    <span className="stat-label">Ca thành công</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{doctor.patientsCount}+</span>
                    <span className="stat-label">Bệnh nhân</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{doctor.reviewCount}</span>
                    <span className="stat-label">Đánh giá</span>
                  </div>
                </div>

                <div className="doctor-rating-section">
                  <div className="rating-display">
                    <Rate disabled defaultValue={doctor.rating} allowHalf />
                    <span className="rating-number">{doctor.rating}</span>
                    <Text type="secondary">({doctor.reviewCount} đánh giá)</Text>
                  </div>
                </div>

                <Paragraph className="doctor-overview">
                  {doctor.description}
                </Paragraph>

                <div className="action-buttons">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<CalendarOutlined />}
                    className="book-consultation-btn"
                    onClick={handleBookConsultation}
                  >
                    Đặt lịch tư vấn
                  </Button>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<MessageOutlined />}
                    className="contact-doctor-btn"
                    onClick={handleContactDoctor}
                  >
                    Liên hệ bác sĩ
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Details Section */}
          <div className="details-section">
            {/* Achievements & Education */}
            <Card className="detail-card" data-aos="fade-up" data-aos-delay="100">
              <Title level={3} className="detail-card-title">
                <TrophyOutlined />
                Học vấn & Thành tựu
              </Title>
              <ul className="achievement-list">
                {doctor.achievements.map((achievement, index) => (
                  <li key={index} className="achievement-item">
                    <CheckCircleOutlined className="achievement-icon" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
              
              <div style={{ marginTop: '24px' }}>
                <Text strong>Chuyên môn: </Text>
                <div style={{ marginTop: '8px' }}>
                  {doctor.specializations.map((spec, index) => (
                    <Tag key={index} color="blue" style={{ margin: '4px' }}>
                      {spec}
                    </Tag>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <Text strong>Ngôn ngữ: </Text>
                <div style={{ marginTop: '8px' }}>
                  {doctor.languages.map((lang, index) => (
                    <Tag key={index} color="green" style={{ margin: '4px' }}>
                      {lang}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>

            {/* Schedule */}
            <Card className="detail-card" data-aos="fade-up" data-aos-delay="200">
              <Title level={3} className="detail-card-title">
                <ClockCircleOutlined />
                Lịch làm việc
              </Title>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Giờ làm việc</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(doctor.availability).map(([day, time]) => (
                    <tr key={day}>
                      <td><strong>{day}</strong></td>
                      <td>
                        <span className={time !== 'Nghỉ' ? 'available-time' : ''}>
                          {time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                <Text type="success" strong>
                  💡 Lưu ý: Vui lòng đặt lịch trước ít nhất 1 ngày để đảm bảo có chỗ.
                </Text>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="detail-card reviews-section" data-aos="fade-up" data-aos-delay="300">
              <Title level={3} className="detail-card-title">
                <StarOutlined />
                Đánh giá từ bệnh nhân
              </Title>
              <div className="review-list">
                {doctor.reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div>
                        <span className="reviewer-name">
                          <UserOutlined style={{ marginRight: '8px' }} />
                          {review.patientName}
                        </span>
                        <Rate disabled defaultValue={review.rating} style={{ marginLeft: '12px' }} />
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <Paragraph className="review-content">
                      "{review.content}"
                    </Paragraph>
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Button type="link" onClick={() => message.info('Tính năng xem tất cả đánh giá sẽ được phát triển.')}>
                  Xem tất cả {doctor.reviewCount} đánh giá →
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorProfile; 