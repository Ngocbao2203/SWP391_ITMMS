// Trang hiển thị danh sách bác sĩ cho khách truy cập
// Sử dụng Ant Design cho UI, quản lý state bằng React hook
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
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/DoctorList.css";
import guestService from "../../services/guestService";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// Danh sách các chuyên khoa để filter
const specialties = [
  "Tất cả chuyên khoa",
  "Chuyên gia IVF",
  "Chuyên gia IUI",
  "Chuyên gia ICSI",
  "Chuyên gia IUI & ICSI",
];

// Component chính hiển thị danh sách bác sĩ
const DoctorList = () => {
  // State lưu trữ danh sách bác sĩ, filter, loading, v.v.
  const [doctors, setDoctors] = useState([]); // Danh sách bác sĩ gốc
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Danh sách bác sĩ sau filter
  const [loading, setLoading] = useState(true); // Đang tải dữ liệu
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả chuyên khoa"); // Chuyên khoa filter
  const [sortBy, setSortBy] = useState("doctorName"); // Tiêu chí sắp xếp
  const navigate = useNavigate();

  // Lấy danh sách bác sĩ từ API khi component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await guestService.getPublicDoctors();
        // Định dạng lại dữ liệu bác sĩ để hiển thị
        const validDoctors = (response.data || []).map((doctor) => ({
          id: doctor.id,
          name: doctor.doctorName, // Ánh xạ doctorName sang name
          specialty: doctor.specialization, // Ánh xạ specialization sang specialty
          experience: `${doctor.experienceYears} năm kinh nghiệm`, // Định dạng experience
          rating: doctor.averageRating || 0, // Ánh xạ averageRating sang rating
          reviewCount: doctor.totalFeedbacks || 0, // Ánh xạ totalFeedbacks sang reviewCount
          photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png", // Giả định ảnh mặc định
          description: doctor.description || "",
        }));
        setDoctors(validDoctors);
        setFilteredDoctors(validDoctors);
      } catch (error) {
        message.error("Không thể tải danh sách bác sĩ");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter và sort danh sách bác sĩ khi filter/sort thay đổi
  useEffect(() => {
    let filtered = doctors;

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          (doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.description?.toLowerCase().includes(searchTerm.toLowerCase())) ??
          false
      );
    }

    // Lọc theo chuyên khoa
    if (selectedSpecialty !== "Tất cả chuyên khoa") {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === selectedSpecialty
      );
    }

    // Sắp xếp danh sách bác sĩ theo tiêu chí
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "experience":
          return (
            parseInt((b.experience || "").replace(" năm kinh nghiệm", ""), 10) -
            parseInt((a.experience || "").replace(" năm kinh nghiệm", ""), 10)
          );
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, sortBy, doctors]);

  // Xử lý khi người dùng nhập tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Xử lý khi chọn chuyên khoa
  const handleSpecialtyChange = (value) => {
    setSelectedSpecialty(value);
  };

  // Xử lý khi chọn tiêu chí sắp xếp
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Xử lý khi nhấn xem hồ sơ bác sĩ
  const handleViewProfile = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  // Render giao diện danh sách bác sĩ
  return (
    <MainLayout>
      <div className="doctor-list-page">
        <div className="doctor-list-container">
          {/* Header giới thiệu */}
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

          {/* Khu vực filter và tìm kiếm */}
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
                  <Option value="doctorName">Tên A-Z</Option>
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

          {/* Danh sách bác sĩ dạng lưới */}
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
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              // Trạng thái không có bác sĩ phù hợp
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

          {/* Nút xem thêm nếu có nhiều bác sĩ */}
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