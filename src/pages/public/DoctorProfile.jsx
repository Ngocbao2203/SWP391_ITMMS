import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Breadcrumb, message, Tag } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  MessageOutlined,
  TrophyOutlined,
  StarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/DoctorProfile.css";

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
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Nguyễn Văn An là chuyên gia hàng đầu trong lĩnh vực thụ tinh trong ống nghiệm (IVF) với hơn 15 năm kinh nghiệm. Ông đã giúp hàng ngàn cặp vợ chồng hiếm muộn có con thành công. Với tỷ lệ thành công cao và phong cách tư vấn tận tâm, bác sĩ An được nhiều bệnh nhân tin tưởng và yêu mến.",
    achievements: [
      "Tiến sĩ Y khoa - Đại học Y Hà Nội",
      "Chứng chỉ IVF quốc tế - ESHRE",
      "Giải thưởng bác sĩ xuất sắc 2023",
      "Chủ nhiệm khoa IVF - Bệnh viện Phụ sản Trung ương",
      "Tác giả 25+ nghiên cứu khoa học quốc tế",
    ],
    specializations: [
      "IVF",
      "ICSI",
      "Phôi đông lạnh",
      "PGT",
      "Tư vấn di truyền",
    ],
    education: "Tiến sĩ Y khoa - Đại học Y Hà Nội (2008)",
    hospital: "Bệnh viện Phụ sản Trung ương",
    reviews: [
      {
        id: 1,
        patientName: "Chị Hoàng Minh",
        rating: 5,
        date: "15/01/2025",
        content:
          "Bác sĩ An rất tận tâm và chu đáo. Sau 3 năm hiếm muộn, nhờ bác sĩ mà tôi đã có con. Rất biết ơn bác sĩ!",
      },
      {
        id: 2,
        patientName: "Anh Tuấn Anh",
        rating: 5,
        date: "10/01/2025",
        content:
          "Quy trình IVF được giải thích rất kỹ, bác sĩ luôn theo dõi sát sao. Vợ chồng tôi rất hài lòng.",
      },
      {
        id: 3,
        patientName: "Chị Thanh Hoa",
        rating: 4,
        date: "05/01/2025",
        content:
          "Bác sĩ giàu kinh nghiệm, tư vấn rất chi tiết. Thái độ thân thiện, dễ gần.",
      },
    ],
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
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Trần Thị Bình chuyên về thụ tinh nhân tạo (IUI) và tư vấn điều trị hiếm muộn. Bà được biết đến với phong cách tư vấn tận tình và chu đáo, luôn lắng nghe và chia sẻ với các cặp vợ chồng khó khăn.",
    achievements: [
      "Thạc sĩ Y khoa - Đại học Y TP.HCM",
      "Chứng chỉ IUI chuyên sâu",
      "Giảng viên trường Đại học Y",
      "10+ năm kinh nghiệm lâm sàng",
      "Tỷ lệ thành công IUI: 85%",
    ],
    specializations: [
      "IUI",
      "Tư vấn hiếm muộn",
      "Điều trị hormone",
      "Siêu âm âm đạo",
    ],
    education: "Thạc sĩ Y khoa - Đại học Y TP.HCM (2012)",
    hospital: "Phòng khám Chuyên khoa IUI",
    reviews: [
      {
        id: 1,
        patientName: "Chị Mai Linh",
        rating: 5,
        date: "18/01/2025",
        content:
          "Bác sĩ Bình rất tận tâm, giải thích rất dễ hiểu. Lần đầu IUI đã thành công luôn.",
      },
      {
        id: 2,
        patientName: "Chị Phương Anh",
        rating: 4,
        date: "12/01/2025",
        content: "Quy trình chuyên nghiệp, bác sĩ theo dõi sát sao từng bước.",
      },
    ],
  },
  3: {
    id: 3,
    name: "Bác sĩ Phạm Văn Tuấn",
    specialty: "Chuyên gia ICSI",
    experience: "16 năm kinh nghiệm",
    rating: 4.9,
    reviewCount: 178,
    successfulCases: 950,
    patientsCount: 720,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Phạm Văn Tuấn là chuyên gia hàng đầu về kỹ thuật tiêm tinh trùng vào bào tương noãn (ICSI), đặc biệt hiệu quả trong các trường hợp vô sinh nam nghiêm trọng. Với 16 năm kinh nghiệm, ông đã giúp nhiều gia đình có con với các trường hợp vô sinh phức tạp.",
    achievements: [
      "Tiến sĩ Y khoa - Đại học Y Dược TP.HCM",
      "Chứng chỉ ICSI quốc tế",
      "Chuyên gia đào tạo ICSI tại châu Á",
      "Giải thưởng nghiên cứu xuất sắc 2022",
      "Tỷ lệ thành công ICSI: 78%",
    ],
    specializations: [
      "ICSI",
      "Điều trị vô sinh nam",
      "Tư vấn di truyền",
      "Thụ tinh ống nghiệm nâng cao",
    ],
    education: "Tiến sĩ Y khoa - Đại học Y Dược TP.HCM (2010)",
    hospital: "Trung tâm Hỗ trợ Sinh sản Quốc tế",
    reviews: [
      {
        id: 1,
        patientName: "Chị Ngọc Ánh",
        rating: 5,
        date: "20/01/2025",
        content:
          "Sau 5 năm điều trị vô sinh không kết quả, nhờ bác sĩ Tuấn và kỹ thuật ICSI, chúng tôi đã có được con gái xinh đẹp. Vô cùng biết ơn!",
      },
      {
        id: 2,
        patientName: "Anh Minh Khôi",
        rating: 5,
        date: "17/01/2025",
        content:
          "Bác sĩ Tuấn rất chuyên nghiệp, tận tâm và thấu hiểu. Gia đình tôi đã có con sau nhiều năm thất vọng.",
      },
    ],
  },
  4: {
    id: 4,
    name: "Bác sĩ Nguyễn Thị Minh",
    specialty: "Chuyên gia IVF",
    experience: "14 năm kinh nghiệm",
    rating: 4.8,
    reviewCount: 145,
    successfulCases: 870,
    patientsCount: 680,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Nguyễn Thị Minh là chuyên gia IVF với nhiều kinh nghiệm trong điều trị các ca hiếm muộn phức tạp và lâu năm. Bà đã nghiên cứu và áp dụng nhiều phương pháp điều trị tiên tiến và đạt tỷ lệ thành công cao.",
    achievements: [
      "Tiến sĩ Nội tiết sinh sản - Đại học Y Hà Nội",
      "Chứng chỉ IVF nâng cao - Hoa Kỳ",
      "Giải thưởng nghiên cứu khoa học 2022",
      "15+ công trình nghiên cứu về hỗ trợ sinh sản",
      "Tỷ lệ thành công IVF: 73%",
    ],
    specializations: ["IVF", "Nội tiết sinh sản", "Tư vấn di truyền", "PGT-A"],
    education: "Tiến sĩ Nội tiết sinh sản - Đại học Y Hà Nội (2011)",
    hospital: "Trung tâm Nghiên cứu và Ứng dụng Kỹ thuật Sinh sản",
    reviews: [
      {
        id: 1,
        patientName: "Chị Trần Huyền",
        rating: 5,
        date: "22/01/2025",
        content:
          "Bác sĩ Minh đã tận tình hỗ trợ chúng tôi sau ba lần IVF thất bại ở nơi khác. Lần thứ tư với bác sĩ đã thành công. Rất cảm kích!",
      },
      {
        id: 2,
        patientName: "Chị Hà Linh",
        rating: 4,
        date: "15/01/2025",
        content:
          "Bác sĩ dành nhiều thời gian tư vấn, giải thích rõ ràng từng bước, giúp chúng tôi rất an tâm.",
      },
    ],
  },
  5: {
    id: 5,
    name: "Bác sĩ Lê Minh Tâm",
    specialty: "Chuyên gia IUI & ICSI",
    experience: "13 năm kinh nghiệm",
    rating: 4.7,
    reviewCount: 121,
    successfulCases: 730,
    patientsCount: 510,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Lê Minh Tâm chuyên về cả hai kỹ thuật IUI và ICSI, giúp tư vấn linh hoạt phương pháp điều trị phù hợp nhất cho từng cặp vợ chồng dựa trên tình trạng cụ thể. Với 13 năm kinh nghiệm, bác sĩ đã giúp nhiều cặp vợ chồng hiếm muộn thực hiện ước mơ làm cha mẹ.",
    achievements: [
      "Thạc sĩ Y khoa - Đại học Y Hà Nội",
      "Chứng chỉ IUI và ICSI quốc tế",
      "Nghiên cứu sinh tại Pháp",
      "Giải thưởng y khoa 2023",
      "Tỷ lệ thành công: IUI 70%, ICSI 75%",
    ],
    specializations: ["IUI", "ICSI", "Tư vấn hiếm muộn", "Điều trị hormone"],
    education:
      "Thạc sĩ Y khoa - Đại học Y Hà Nội (2012), Nghiên cứu sinh tại Đại học Paris, Pháp (2014-2016)",
    hospital: "Trung tâm Hỗ trợ Sinh sản",
    reviews: [
      {
        id: 1,
        patientName: "Chị Thu Hằng",
        rating: 5,
        date: "25/01/2025",
        content:
          "Bác sĩ Tâm đã giúp tôi lựa chọn phương pháp điều trị hiếm muộn phù hợp nhất. Sau 2 lần IUI không thành công, bác sĩ đã tư vấn chuyển sang ICSI và đã thành công. Rất biết ơn!",
      },
      {
        id: 2,
        patientName: "Anh Quốc Bảo",
        rating: 4,
        date: "19/01/2025",
        content:
          "Bác sĩ Tâm tư vấn rất tận tâm, đưa ra nhiều lựa chọn điều trị phù hợp với tình trạng và chi phí của gia đình.",
      },
    ],
  },
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
            <div className="doctor-not-found">
              <Title level={3}>Không tìm thấy thông tin bác sĩ</Title>
              <Button type="primary" onClick={() => navigate("/doctors")}>
                Quay lại danh sách bác sĩ
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleBookConsultation = () => {
    message.success(
      `Đã gửi yêu cầu đặt lịch tư vấn với ${doctor.name}. Chúng tôi sẽ liên hệ với bạn trong 24h!`
    );
  };
  const handleContactDoctor = () => {
    message.info(
      "Tính năng nhắn tin trực tiếp với bác sĩ sẽ được phát triển trong phiên bản tiếp theo."
    );
  };

  return (
    <MainLayout>
      <div className="doctor-profile-page">
        <div className="doctor-profile-container">
          {" "}
          {/* Navigation Bar with Breadcrumb and Back Button */}
          <div className="navigation-bar">
            {/* Breadcrumb */}
            <div className="breadcrumb-section">
              <Breadcrumb>
                <Breadcrumb.Item>
                  {" "}
                  <a href="/" className="breadcrumb-link">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      stroke="currentColor"
                      fill="none"
                      className="breadcrumb-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                    Trang chủ
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {" "}
                  <a href="/doctors" className="breadcrumb-link">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      stroke="currentColor"
                      fill="none"
                      className="breadcrumb-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    Danh sách bác sĩ
                  </a>
                </Breadcrumb.Item>{" "}
                <Breadcrumb.Item className="breadcrumb-current">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    stroke="currentColor"
                    fill="none"
                    className="breadcrumb-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  {doctor.name}
                </Breadcrumb.Item>
              </Breadcrumb>{" "}
            </div>
          </div>{" "}
          {/* Doctor Header */}
          <Card className="doctor-header-card" data-aos="fade-up">
            {" "}
            <div className="doctor-header-content">
              <div className="doctor-avatar-section">
                <div className="doctor-avatar-image-container">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="doctor-main-photo"
                  />
                </div>
                <div className="specialty-badge">
                  <MedicineBoxOutlined style={{ marginRight: "6px" }} />
                  {doctor.specialty}
                </div>
              </div>{" "}
              <div className="doctor-info-section">
                {" "}
                <div>
                  <Title level={1} className="doctor-profile-name">
                    {doctor.name}
                  </Title>
                </div>{" "}
                <div className="doctor-quick-stats">
                  <div className="stat-item">
                    <span className="stat-number stat-number-experience">
                      {doctor.experience.split(" ")[0]}
                    </span>
                    <span className="stat-label">Năm kinh nghiệm</span>
                    <div className="stat-background stat-background-experience"></div>
                  </div>{" "}
                  <div className="stat-item">
                    <span className="stat-number stat-number-success">
                      {doctor.successfulCases}+
                    </span>
                    <span className="stat-label">Ca thành công</span>
                    <div className="stat-background stat-background-success"></div>
                  </div>{" "}
                  <div className="stat-item">
                    <span className="stat-number stat-number-patients">
                      {doctor.patientsCount}+
                    </span>
                    <span className="stat-label">Bệnh nhân</span>
                    <div className="stat-background stat-background-patients"></div>{" "}
                  </div>
                </div>{" "}
                <Paragraph className="doctor-overview">
                  <div className="quote-mark">❝</div>
                  {doctor.description}
                </Paragraph>
                <div className="action-buttons">
                  {" "}
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    className="book-consultation-btn"
                    onClick={handleBookConsultation}
                  >
                    Đặt lịch tư vấn
                  </Button>{" "}
                  <Button
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
          </Card>{" "}
          {/* Details Section */}
          <div className="details-section">
            {/* Achievements & Education */}{" "}
            <Card
              className="detail-card education-achievements-card"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {" "}
              <Title level={3} className="detail-card-title">
                {" "}
                <div className="detail-card-icon">
                  <TrophyOutlined style={{ color: "#fff", fontSize: "18px" }} />
                </div>
                <span>Học vấn & Thành tựu</span>
              </Title>{" "}
              <div className="education-achievements-container">
                {/* Education and Hospital section with improved layout */}{" "}
                <div className="education-section">
                  {" "}
                  <div className="info-section info-section-education">
                    {" "}
                    <div className="info-background-circle-large"></div>
                    <div className="info-background-circle-small"></div>{" "}
                    <Text strong className="info-title info-title-education">
                      <div className="info-icon-container info-icon-container-education">
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          stroke="currentColor"
                          fill="none"
                          style={{ verticalAlign: "middle" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                          ></path>
                        </svg>
                      </div>
                      Học vấn
                    </Text>{" "}
                    <div className="info-content">
                      <Text className="info-text">{doctor.education}</Text>
                    </div>
                  </div>{" "}
                  <div className="info-section info-section-hospital">
                    {" "}
                    <div className="info-background-circle-large"></div>
                    <div className="info-background-circle-small"></div>{" "}
                    <Text strong className="info-title info-title-hospital">
                      <div className="info-icon-container info-icon-container-hospital">
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          stroke="currentColor"
                          fill="none"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          ></path>
                        </svg>
                      </div>
                      Bệnh viện/Phòng khám
                    </Text>{" "}
                    <div className="hospital-info-container">
                      <Text className="hospital-info-text">
                        {doctor.hospital}
                      </Text>
                    </div>
                  </div>
                </div>
                {/* Achievements section */}{" "}
                <div className="achievements-section">
                  <div className="achievement-background-circle-large"></div>
                  <div className="achievement-background-circle-medium"></div>
                  <div className="achievement-background-circle-small"></div>
                  <Text strong className="achievement-title">
                    <div className="achievement-icon-container">
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                    </div>
                    Thành tựu nổi bật
                    <div className="achievement-title-underline"></div>
                  </Text>
                  <div className="achievement-grid">
                    {" "}
                    {doctor.achievements.map((achievement, index) => (
                      <div key={index} className="achievement-item">
                        <div className="achievement-icon">
                          {" "}
                          <CheckCircleOutlined className="achievement-check-icon" />
                        </div>
                        <Text className="achievement-text">{achievement}</Text>
                      </div>
                    ))}{" "}
                  </div>
                </div>
                {/* Specializations section */}{" "}
                <div className="specializations-section">
                  <div className="specialization-background-circle"></div>
                  <Text strong className="specializations-title">
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      stroke="currentColor"
                      fill="none"
                      className="specializations-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      ></path>
                    </svg>
                    Chuyên môn & Kỹ thuật
                  </Text>
                  <div className="specializations-list">
                    {doctor.specializations.map((spec, index) => (
                      <Tag
                        key={index}
                        color="default"
                        className="specialization-tag"
                      >
                        <span className="specialization-dot"></span>
                        {spec}
                      </Tag>
                    ))}
                  </div>{" "}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorProfile;
