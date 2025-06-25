import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Button,
  message,
  Spin,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/DoctorList.css";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// Dữ liệu mẫu bác sĩ mở rộng - Chỉ giữ lại bác sĩ chuyên về IVF, IUI, ICSI
const doctorsData = [
  {
    id: 1,
    name: "Bác sĩ Nguyễn Văn An",
    specialty: "Chuyên gia IVF",
    experience: "15 năm kinh nghiệm",
    rating: 4.9,
    reviewCount: 156,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Nguyễn Văn An là chuyên gia hàng đầu trong lĩnh vực thụ tinh trong ống nghiệm (IVF) với hơn 15 năm kinh nghiệm. Ông đã giúp hàng ngàn cặp vợ chồng hiếm muộn có con thành công.",
    achievements: [
      "Tiến sĩ Y khoa",
      "Chứng chỉ IVF quốc tế",
      "Giải thưởng bác sĩ xuất sắc 2023",
    ],
    availability: "Thứ 2-6: 8:00-17:00",
  },
  {
    id: 2,
    name: "Bác sĩ Trần Thị Bình",
    specialty: "Chuyên gia IUI",
    experience: "12 năm kinh nghiệm",
    rating: 4.8,
    reviewCount: 134,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Trần Thị Bình chuyên về thụ tinh nhân tạo (IUI) và tư vấn điều trị hiếm muộn. Bà được biết đến với phong cách tư vấn tận tình và chu đáo.",
    achievements: [
      "Thạc sĩ Y khoa",
      "Chứng chỉ IUI chuyên sâu",
      "Giảng viên trường Đại học Y",
    ],
    availability: "Thứ 3-7: 8:30-16:30",
  },
  {
    id: 3,
    name: "Bác sĩ Phạm Văn Tuấn",
    specialty: "Chuyên gia ICSI",
    experience: "16 năm kinh nghiệm",
    rating: 4.9,
    reviewCount: 178,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Phạm Văn Tuấn là chuyên gia hàng đầu về kỹ thuật tiêm tinh trùng vào bào tương noãn (ICSI), đặc biệt hiệu quả trong các trường hợp vô sinh nam nghiêm trọng.",
    achievements: [
      "Tiến sĩ Y khoa",
      "Chứng chỉ ICSI quốc tế",
      "Chuyên gia đào tạo ICSI tại châu Á",
    ],
    availability: "Thứ 2,3,5,6: 8:30-17:00",
  },
  {
    id: 4,
    name: "Bác sĩ Nguyễn Thị Minh",
    specialty: "Chuyên gia IVF",
    experience: "14 năm kinh nghiệm",
    rating: 4.8,
    reviewCount: 145,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Nguyễn Thị Minh là chuyên gia IVF với nhiều kinh nghiệm trong điều trị các ca hiếm muộn phức tạp và lâu năm. Bà đã nghiên cứu và áp dụng nhiều phương pháp điều trị tiên tiến.",
    achievements: [
      "Tiến sĩ Nội tiết sinh sản",
      "Chứng chỉ IVF nâng cao",
      "Giải thưởng nghiên cứu khoa học 2022",
    ],
    availability: "Thứ 2,4,6: 8:00-16:30",
  },
  {
    id: 5,
    name: "Bác sĩ Lê Minh Tâm",
    specialty: "Chuyên gia IUI & ICSI",
    experience: "13 năm kinh nghiệm",
    rating: 4.7,
    reviewCount: 121,
    photo:
      "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
    description:
      "Bác sĩ Lê Minh Tâm chuyên về cả hai kỹ thuật IUI và ICSI, giúp tư vấn linh hoạt phương pháp điều trị phù hợp nhất cho từng cặp vợ chồng dựa trên tình trạng cụ thể.",
    achievements: [
      "Thạc sĩ Y khoa",
      "Chứng chỉ IUI và ICSI quốc tế",
      "Nghiên cứu sinh tại Pháp",
    ],
    availability: "Thứ 3-7: 9:00-17:30",
  },
];

const specialties = [
  "Tất cả chuyên khoa",
  "Chuyên gia IVF",
  "Chuyên gia IUI",
  "Chuyên gia ICSI",
  "Chuyên gia IUI & ICSI",
];

const DoctorList = () => {
  const [doctors, setDoctors] = useState(doctorsData);
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] =
    useState("Tất cả chuyên khoa");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "Tất cả chuyên khoa") {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === selectedSpecialty
      );
    }

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, sortBy, doctors]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSpecialtyChange = (value) => {
    setSelectedSpecialty(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleBookAppointment = (doctorId, doctorName) => {
    message.success(
      `Đã gửi yêu cầu đặt lịch với ${doctorName}. Chúng tôi sẽ liên hệ với bạn sớm nhất!`
    );
  };

  const handleViewProfile = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  return (
    <MainLayout>
      <div className="doctor-list-page">
        <div className="doctor-list-container">
          {/* Header */}
          <div className="doctor-list-header" data-aos="fade-up">
            <Title level={1} className="doctor-list-title">
              <TeamOutlined style={{ marginRight: "12px" }} />
              Đội Ngũ Bác Sĩ Chuyên Khoa
            </Title>
            <Paragraph className="doctor-list-subtitle">
              Gặp gỡ đội ngũ bác sĩ giàu kinh nghiệm và tận tâm của chúng tôi.
              Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe sinh sản tốt
              nhất cho bạn.
            </Paragraph>
          </div>

          {/* Search and Filter */}
          <div
            className="search-filter-section"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Row gutter={[16, 16]} className="filter-row">
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  size="large"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Chọn chuyên khoa"
                  value={selectedSpecialty}
                  onChange={handleSpecialtyChange}
                  size="large"
                  style={{ width: "100%" }}
                >
                  {specialties.map((specialty) => (
                    <Option key={specialty} value={specialty}>
                      {specialty}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Sắp xếp theo"
                  value={sortBy}
                  onChange={handleSortChange}
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Option value="name">Tên A-Z</Option>
                  <Option value="rating">Đánh giá cao nhất</Option>
                  <Option value="experience">Kinh nghiệm nhiều nhất</Option>
                  <Option value="reviews">Nhiều đánh giá nhất</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Text strong style={{ color: "#1890ff" }}>
                  Tìm thấy: {filteredDoctors.length} bác sĩ
                </Text>
              </Col>
            </Row>
          </div>

          {/* Doctor Grid */}
          <Spin spinning={loading}>
            {filteredDoctors.length > 0 ? (
              <Row gutter={[24, 24]} className="doctor-grid">
                {filteredDoctors.map((doctor, index) => (
                  <Col xs={24} sm={12} lg={8} key={doctor.id}>
                    <Card
                      className="doctor-card"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="doctor-photo-container">
                        <img
                          src={doctor.photo}
                          alt={doctor.name}
                          className="doctor-photo"
                        />
                        <div className="doctor-specialty-badge">
                          {doctor.specialty}
                        </div>
                      </div>

                      <div className="doctor-info">
                        <Title level={4} className="doctor-name">
                          {doctor.name}
                        </Title>

                        <div className="doctor-specialty">
                          <UserOutlined style={{ marginRight: "8px" }} />
                          {doctor.specialty}
                        </div>

                        <div className="doctor-experience">
                          <CalendarOutlined style={{ marginRight: "8px" }} />
                          {doctor.experience}
                        </div>

                        <Paragraph className="doctor-description">
                          {doctor.description}
                        </Paragraph>

                        <div className="doctor-actions">
                          <Button
                            type="primary"
                            className="view-profile-btn"
                            onClick={() => handleViewProfile(doctor.id)}
                            icon={<UserOutlined />}
                          >
                            Xem hồ sơ
                          </Button>
                          <Button
                            type="primary"
                            className="book-appointment-btn"
                            onClick={() =>
                              handleBookAppointment(doctor.id, doctor.name)
                            }
                            icon={<CalendarOutlined />}
                          >
                            Đặt lịch
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="empty-state" data-aos="fade-up">
                <div className="empty-icon">
                  <TeamOutlined />
                </div>
                <Title level={3} className="empty-title">
                  Không tìm thấy bác sĩ
                </Title>
                <Paragraph className="empty-description">
                  Không có bác sĩ nào phù hợp với tiêu chí tìm kiếm của bạn. Vui
                  lòng thử lại với từ khóa khác.
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSpecialty("Tất cả chuyên khoa");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </Spin>

          {/* Load More Section */}
          {filteredDoctors.length > 0 && filteredDoctors.length >= 6 && (
            <div className="load-more-section" data-aos="fade-up">
              <Button
                type="primary"
                size="large"
                className="load-more-btn"
                onClick={() =>
                  message.info(
                    "Tính năng tải thêm sẽ được phát triển trong phiên bản tiếp theo."
                  )
                }
              >
                Xem thêm bác sĩ
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorList;
