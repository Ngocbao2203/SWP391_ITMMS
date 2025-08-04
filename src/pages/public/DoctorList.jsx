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
import { doctorService } from "../../services";

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
  const [sortBy, setSortBy] = useState("name"); // Tiêu chí sắp xếp
  const navigate = useNavigate();

  // Lấy danh sách bác sĩ từ API khi component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getAllManagement();
        // console.log("Response from API:", response); 

        // Xử lý linh hoạt cấu trúc API
        let doctorsRaw = [];
        if (response.doctors) {
          doctorsRaw = response.doctors; // Lấy trực tiếp từ response
        } else if (response.data?.doctors) {
          doctorsRaw = response.data.doctors; // Nếu có data wrapper
        } else if (Array.isArray(response.data)) {
          doctorsRaw = response.data; // Nếu API trả mảng trực tiếp
        } else if (response.data?.data) {
          doctorsRaw = response.data.data;
        } else if (response.data?.result) {
          doctorsRaw = response.data.result;
        }
        // console.log("Raw Doctors Data:", doctorsRaw);

        const doctorProfiles = doctorsRaw.map((doctor) => ({
          id: doctor.id,
          name: doctor.fullName,
          specialty: doctor.specialization,
          experience: `${doctor.experienceYears} năm kinh nghiệm`,
          rating: doctor.averageRating || 0,
          reviewCount: doctor.totalAppointments || 0,
          photo:
            doctor.avatarUrl ||
            "http://res.cloudinary.com/dqnq00784/image/upload/v1753944009/znzqi0q6hn3wbanz0cie.jpg",
          description: doctor.description || "",
        }));
        console.log("Doctor Profiles:", doctorProfiles); // Debug: Xem dữ liệu đã map

        setDoctors(doctorProfiles);
        setFilteredDoctors(doctorProfiles);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bác sĩ:", error.response?.data || error.message);
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
      <div style={styles.doctorListPage}>
        <div style={styles.doctorListContainer}>
          {/* Header giới thiệu */}
          <div style={styles.doctorListHeader} data-aos="fade-up">
            <Title level={1} style={styles.doctorListTitle}>
              <TeamOutlined style={{ marginRight: "12px", color: "#1890ff" }} />
              Đội Ngũ Bác Sĩ Chuyên Khoa
            </Title>
            <Paragraph style={styles.doctorListSubtitle}>
              Gặp gỡ đội ngũ bác sĩ giàu kinh nghiệm và tận tâm của chúng tôi.
              Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe sinh sản tốt
              nhất cho bạn.
            </Paragraph>
          </div>

          {/* Khu vực filter và tìm kiếm */}
          <div
            style={styles.searchFilterSection}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Row gutter={[16, 16]} style={styles.filterRow}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  size="large"
                  style={styles.searchInput}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Chọn chuyên khoa"
                  value={selectedSpecialty}
                  onChange={handleSpecialtyChange}
                  size="large"
                  style={styles.selectInput}
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
                  style={styles.selectInput}
                >
                  <Option value="name">Tên A-Z</Option>
                  <Option value="experience">Kinh nghiệm nhiều nhất</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <div style={styles.resultCount}>
                  <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
                    Tìm thấy: {filteredDoctors.length} bác sĩ
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          {/* Danh sách bác sĩ dạng lưới */}
          <Spin spinning={loading} size="large">
            {filteredDoctors.length > 0 ? (
              <Row gutter={[24, 24]} style={styles.doctorGrid}>
                {filteredDoctors.map((doctor, index) => (
                  <Col xs={24} sm={12} lg={8} key={doctor.id}>
                    <Card
                      style={styles.doctorCard}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      hoverable
                    >
                      <div style={styles.doctorPhotoContainer}>
                        <img
                          src={doctor.photo}
                          alt={doctor.name}
                          style={styles.doctorPhoto}
                        />
                        <div style={styles.doctorSpecialtyBadge}>
                          {doctor.specialty}
                        </div>
                      </div>

                      <div style={styles.doctorInfo}>
                        <Title level={4} style={styles.doctorName}>
                          {doctor.name || "Tên chưa có"}
                        </Title>

                        <div style={styles.doctorSpecialty}>
                          <UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                          {doctor.specialty}
                        </div>

                        <div style={styles.doctorExperience}>
                          <CalendarOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
                          {doctor.experience}
                        </div>

                        <Paragraph style={styles.doctorDescription}>
                          {doctor.description}
                        </Paragraph>

                        <div style={styles.doctorActions}>
                          <Button
                            type="primary"
                            style={styles.viewProfileBtn}
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
              <div style={styles.emptyState} data-aos="fade-up">
                <div style={styles.emptyIcon}>
                  <TeamOutlined />
                </div>
                <Title level={3} style={styles.emptyTitle}>
                  Không tìm thấy bác sĩ
                </Title>
                <Paragraph style={styles.emptyDescription}>
                  Không có bác sĩ nào phù hợp với tiêu chí tìm kiếm của bạn. Vui
                  lòng thử lại với từ khóa khác.
                </Paragraph>
                <Button
                  type="primary"
                  style={styles.clearFilterBtn}
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
            <div style={styles.loadMoreSection} data-aos="fade-up">
              <Button
                type="primary"
                size="large"
                style={styles.loadMoreBtn}
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

// Styles object
const styles = {
  doctorListPage: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "40px 0",
  },
  doctorListContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  doctorListHeader: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    color: "white",
  },
  doctorListTitle: {
    color: "white !important",
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "20px",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  doctorListSubtitle: {
    color: "rgba(255,255,255,0.9) !important",
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchFilterSection: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: "40px",
    border: "1px solid #f0f0f0",
  },
  filterRow: {
    alignItems: "center",
  },
  searchInput: {
    borderRadius: "8px",
    border: "2px solid #f0f0f0",
    transition: "all 0.3s ease",
  },
  selectInput: {
    width: "100%",
    borderRadius: "8px",
  },
  resultCount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "40px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "0 16px",
  },
  doctorGrid: {
    marginTop: "20px",
  },
  doctorCard: {
    borderRadius: "16px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    border: "1px solid #f0f0f0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    height: "100%",
    background: "white",
    cursor: "pointer",
    position: "relative",
  },
  doctorPhotoContainer: {
    position: "relative",
    height: "200px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  doctorPhoto: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
  },
  doctorSpecialtyBadge: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "#1890ff",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  doctorInfo: {
    padding: "24px",
  },
  doctorName: {
    color: "#1a1a1a",
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: "600",
    textAlign: "center",
  },
  doctorSpecialty: {
    display: "flex",
    alignItems: "center",
    color: "#1890ff",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "500",
  },
  doctorExperience: {
    display: "flex",
    alignItems: "center",
    color: "#52c41a",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "500",
  },
  doctorDescription: {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "20px",
    minHeight: "40px",
  },
  doctorActions: {
    textAlign: "center",
    paddingTop: "16px",
    borderTop: "1px solid #f0f0f0",
  },
  viewProfileBtn: {
    borderRadius: "8px",
    height: "40px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
    border: "none",
    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
    transition: "all 0.3s ease",
    width: "100%",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  emptyIcon: {
    fontSize: "80px",
    color: "#d9d9d9",
    marginBottom: "24px",
  },
  emptyTitle: {
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  emptyDescription: {
    color: "#666",
    fontSize: "16px",
    marginBottom: "32px",
    maxWidth: "400px",
    margin: "0 auto 32px",
  },
  clearFilterBtn: {
    borderRadius: "8px",
    height: "40px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
    border: "none",
    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
  },
  loadMoreSection: {
    textAlign: "center",
    marginTop: "40px",
  },
  loadMoreBtn: {
    borderRadius: "8px",
    height: "48px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
    border: "none",
    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
    padding: "0 40px",
  },
};

export default DoctorList;