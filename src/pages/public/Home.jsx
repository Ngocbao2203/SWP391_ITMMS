import React, { useState, useEffect } from "react";
import { Button, Card, Carousel, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getPublishedBlogs } from "../../services/blogService";

const { Title, Paragraph } = Typography;

const doctors = [
  {
    name: "Bác sĩ Nguyễn Văn A",
    specialty: "Chuyên gia IVF",
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    name: "Bác sĩ Trần Thị B",
    specialty: "Chuyên gia IUI",
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    name: "Bác sĩ Lê Văn C",
    specialty: "Chuyên gia nội tiết sinh sản",
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    name: "Bác sĩ Lê Văn D",
    specialty: "Chuyên gia nội tiết sinh sản",
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
];

// Removed static articles as we'll use real blogs from blogService
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
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogData = await getPublishedBlogs();
      setBlogs(blogData);
    };
    fetchBlogs();

    // Save current path to sessionStorage when on the home page
    sessionStorage.setItem('previousPath', window.location.pathname);
  }, []);

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
              Điều trị hiếm muộn – Chuyên sâu & Tận tâm
            </Title>
            <Paragraph className="home-subtext">
              My Clinic là địa chỉ tin cậy trong lĩnh vực điều trị vô sinh – hiếm muộn tại Việt Nam, nơi bạn được đồng hành và chăm sóc toàn diện trên hành trình tìm kiếm con yêu.
            </Paragraph>
          </div>
        </div>

        {/* Lý do nên chọn My Clinic */}
        <div className="section why-my-clinic">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={10}>
              <img
                src="https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png" // Đặt file `acfabdfb-0dd2-41f8-a2c6-f5298d3c157c.png` trong public/images/
                alt="Nhân viên y tế"
                className="clinic-hero-image"
              />
            </Col>
            <Col xs={24} md={14}>
              <Title level={3}>Tại sao nên chọn My Clinic?</Title>
              <Row gutter={[16, 24]}>
                <Col xs={24} sm={12}>
                  <div className="clinic-box">
                    <div className="clinic-icon">👩‍⚕️</div>
                    <Title level={5}>Chuyên gia hiếm muộn</Title>
                    <Paragraph>
                      My Clinic quy tụ đội ngũ bác sĩ và điều dưỡng có chuyên môn sâu trong lĩnh vực IVF, IUI, nội tiết sinh sản.
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


        <div className="section doctors-section">
          <Title level={3} style={{ textAlign: "center" }}>ĐỘI NGŨ CHUYÊN GIA</Title>
          <Carousel dots={false} arrows infinite slidesToShow={4} responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}>
            {doctors.map((doc, index) => (
              <div className="doctor-profile" key={index}>
                <img src={doc.photo} alt={doc.name} className="doctor-img" />
                <div className="doctor-info">
                  <div className="doctor-name">{doc.name}</div>
                  <div className="doctor-title">{doc.specialty}</div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

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
                  <div className="quote-mark">“</div>
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
        <div className="section articles-section">
          <Title level={3}>Chia sẻ kinh nghiệm</Title>
          <Row gutter={[24, 24]}>
            {blogs.slice(0, 3).map((blog) => (
              <Col xs={24} sm={12} md={8} key={blog.id}>
                <Card
                  title={blog.title}
                  bordered
                  cover={<img alt={blog.title} src={blog.coverImage} />}
                >
                  <Paragraph ellipsis={{ rows: 2 }}>{blog.summary}</Paragraph>
                  <Link to={`/blog/${blog.id}?from=home`}>
                    <Button type="link">Đọc thêm</Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>        <Link to="/blog">
            <Button type="link" className="see-more-btn">
              Xem thêm bài viết
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
