import React, { useState, useEffect } from "react";
import { Button, Card, Carousel, Row, Col, Typography, Spin, message } from "antd";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { guestService, formatErrorMessage } from "../../services";

const { Title, Paragraph } = Typography;

// Fallback testimonials nếu không có data từ API
const testimonials = [
  {
    title: "LƯƠNG Y NHƯ TỪ MẪU",
    content: `Tâm sáng, thông phương, tài dược\nĐiều trị bệnh như có phép tiên\nNhư tuôn nước nóng tan liền tuyết băng\nHỏi bao lần chòng mắt quầng đen\nPhải không những đêm dài thức trắng`,
    author: "Lương y như từ mẫu",
  },
  {
    title: "LỜI CẢM ƠN",
    content: `Mười ngày điều trị tại khoa (khoa ngoại)\nRa về chỉ có món quà bằng thơ\nThời gian đếm ngược từng giờ\nMong cho bệnh khỏi để còn về quê`,
    author: "Lời cảm ơn Mười ngày điều trị tại khoa (khoa ngoại)",
  },
];

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Lấy tất cả data cần thiết cho trang chủ
        const [
          homePageInfo,
          publicDoctors,
          featuredServices,
          recentBlogs
        ] = await Promise.all([
          guestService.getHomePageInfo(),
          guestService.getTopRatedDoctors(4),
          guestService.getPopularServices(6),
          guestService.getRecentBlogPosts(3)
        ]);

        setHomeData(homePageInfo);
        setDoctors(publicDoctors.doctors || []);
        setServices(featuredServices.services || []);
        setBlogs(recentBlogs.posts || []);

      } catch (error) {
        console.error('Error fetching home data:', error);
        message.error(formatErrorMessage(error));
        
        // Fallback để trang vẫn hiển thị được nếu API lỗi
        setHomeData({
          clinicInfo: {
            name: "ITMMS Fertility Clinic",
            description: "Chuyên khoa điều trị hiếm muộn",
          },
          stats: {
            totalDoctors: 5,
            totalPatients: 150,
            successRate: 85.5
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();

    // Save current path to sessionStorage when on the home page
    sessionStorage.setItem('previousPath', window.location.pathname);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="home-page">
        {/* Banner */}
        <div
          className="banner-section"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png)",
          }}
        >
          <div className="banner-content">
            <Title level={2} className="banner-title">
              {homeData?.clinicInfo?.name || "ITMMS"} – Chuyên sâu & Tận tâm
            </Title>
            <Paragraph className="home-subtext">
              {homeData?.clinicInfo?.description || 
               "ITMMS là địa chỉ tin cậy trong lĩnh vực điều trị vô sinh – hiếm muộn tại Việt Nam, nơi bạn được đồng hành và chăm sóc toàn diện trên hành trình tìm kiếm con yêu."}
            </Paragraph>
            
            {/* Hiển thị thống kê nếu có */}
            {homeData?.stats && (
              <div className="clinic-stats">
                <Row gutter={16} justify="center">
                  <Col>
                    <div className="stat-item">
                      <div className="stat-number">{homeData.stats.totalDoctors}+</div>
                      <div className="stat-label">Bác sĩ chuyên khoa</div>
                    </div>
                  </Col>
                  <Col>
                    <div className="stat-item">
                      <div className="stat-number">{homeData.stats.totalPatients}+</div>
                      <div className="stat-label">Bệnh nhân tin tưởng</div>
                    </div>
                  </Col>
                  <Col>
                    <div className="stat-item">
                      <div className="stat-number">{homeData.stats.successRate}%</div>
                      <div className="stat-label">Tỷ lệ thành công</div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </div>

        {/* Lý do nên chọn My Clinic */}
        <div className="section why-my-clinic">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={10}>
              <img
                src="https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png"
                alt="Nhân viên y tế"
                className="clinic-hero-image"
              />
            </Col>
            <Col xs={24} md={14}>
              <Title level={3}>Tại sao nên chọn {homeData?.clinicInfo?.name || 'My Clinic'}?</Title>
              <Row gutter={[16, 24]}>
                <Col xs={24} sm={12}>
                  <div className="clinic-box">
                    <div className="clinic-icon">👩‍⚕️</div>
                    <Title level={5}>Chuyên gia hiếm muộn</Title>
                    <Paragraph>
                      Quy tụ đội ngũ bác sĩ và điều dưỡng có chuyên môn sâu trong lĩnh vực IVF, IUI, nội tiết sinh sản.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="clinic-box">
                    <div className="clinic-icon">🌍</div>
                    <Title level={5}>Tiêu chuẩn quốc tế</Title>
                    <Paragraph>
                      Quy trình điều trị và chăm sóc được kiểm soát nghiêm ngặt theo các tiêu chuẩn quốc tế về hỗ trợ sinh sản.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="clinic-box">
                    <div className="clinic-icon">🔬</div>
                    <Title level={5}>Công nghệ hiện đại</Title>
                    <Paragraph>
                      Ứng dụng công nghệ xét nghiệm và thụ tinh tiên tiến nhằm tăng tỉ lệ thành công cho từng ca điều trị.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="clinic-box">
                    <div className="clinic-icon">💡</div>
                    <Title level={5}>Nghiên cứu & cá thể hóa</Title>
                    <Paragraph>
                      Áp dụng nghiên cứu mới và xây dựng phác đồ cá nhân hóa giúp tối ưu hiệu quả điều trị cho từng bệnh nhân.
                    </Paragraph>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* Featured Services */}
        {services.length > 0 && (
          <div className="section services-section">
            <Title level={3} style={{ textAlign: "center" }}>DỊCH VỤ NỔI BẬT</Title>
            <Row gutter={[24, 24]}>
              {services.slice(0, 3).map((service) => (
                <Col xs={24} sm={12} md={8} key={service.id}>
                  <Card
                    title={service.serviceName}
                    bordered
                    hoverable
                    className="service-card"
                  >
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {service.description}
                    </Paragraph>
                    <div className="service-info">
                      <p><strong>Thời gian:</strong> {service.durationDays} ngày</p>
                      <p><strong>Tỷ lệ thành công:</strong> {service.successRate}%</p>
                    </div>
                    <Link to={`/services/${service.id}`}>
                      <Button type="primary" block>
                        Tìm hiểu thêm
                      </Button>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/userservice">
                <Button type="link" size="large">
                  Xem tất cả dịch vụ
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Doctors Section */}
        {doctors.length > 0 && (
          <div className="section doctors-section">
            <Title level={3} style={{ textAlign: "center" }}>ĐỘI NGŨ CHUYÊN GIA</Title>
            <Carousel 
              dots={false} 
              arrows 
              infinite 
              slidesToShow={Math.min(doctors.length, 4)} 
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: Math.min(doctors.length, 2),
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                  },
                },
              ]}
            >
              {doctors.map((doctor) => (
                <div className="doctor-profile" key={doctor.id}>
                  <img 
                    src={doctor.profileImage || "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png"} 
                    alt={doctor.name} 
                    className="doctor-img" 
                  />
                  <div className="doctor-info">
                    <div className="doctor-name">{doctor.name}</div>
                    <div className="doctor-title">{doctor.specialization}</div>
                    <div className="doctor-rating">
                      ⭐ {doctor.averageRating?.toFixed(1) || 'N/A'} ({doctor.experienceYears} năm kinh nghiệm)
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/doctors">
                <Button type="link" size="large">
                  Xem tất cả bác sĩ
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Testimonials */}
        <Slider
          arrows
          dots={false}
          infinite
          slidesToShow={2}
          slidesToScroll={1}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
          className="gratitude-carousel"
        >
          {testimonials.map((t, index) => (
            <div key={index} className="gratitude-slide">
              <Row gutter={[32, 0]} justify="center" align="middle">
                <Col xs={24} md={12} className="gratitude-block">
                  <div className="quote-mark">"</div>
                  <Paragraph className="gratitude-text">{t.content}</Paragraph>
                  <Link to="#" className="gratitude-detail">Chi tiết...</Link>
                  <div className="gratitude-author">
                    <strong>{t.title}</strong>
                    <div>{t.author}</div>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </Slider>

        {/* Blog Posts */}
        {blogs.length > 0 && (
          <div className="section articles-section">
            <Title level={3}>Chia sẻ kinh nghiệm</Title>
            <Row gutter={[24, 24]}>
              {blogs.map((blog) => (
                <Col xs={24} sm={12} md={8} key={blog.id}>
                  <Card
                    title={blog.title}
                    bordered
                    hoverable
                    cover={
                      <img 
                        alt={blog.title} 
                        src={blog.coverImage || blog.image || "https://via.placeholder.com/300x200"} 
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                  >
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {blog.summary || blog.excerpt || blog.content}
                    </Paragraph>
                    <Link to={`/blog/${blog.id}?from=home`}>
                      <Button type="link">Đọc thêm</Button>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/blog">
                <Button type="link" size="large">
                  Xem thêm bài viết
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
