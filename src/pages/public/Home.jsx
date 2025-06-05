import React, { useState, useEffect } from "react";
import { Button, Card, Carousel, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Home.css";
import { getPublishedBlogs } from "../../services/blogService";

const { Title, Paragraph } = Typography;

const services = [
  {
    title: "IUI - Bơm tinh trùng vào buồng tử cung",
    desc: "Hỗ trợ sinh sản an toàn, hiệu quả cho các cặp vợ chồng.",
    icon: "🧬",
    image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    title: "IVF - Thụ tinh trong ống nghiệm",
    desc: "Công nghệ thụ tinh tiên tiến giúp gia đình bạn trọn vẹn.",
    icon: "👶",
    image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    title: "Hỗ trợ sinh sản toàn diện",
    desc: "Chăm sóc và tư vấn toàn diện cho hành trình của bạn.",
    icon: "🤰",
    image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
];

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
];

// Removed static articles as we'll use real blogs from blogService

const testimonials = [
  {
    content:
      "Nhờ IVF tại đây, tôi đã đón con trai đầu lòng sau 7 năm hiếm muộn. Cảm ơn đội ngũ bác sĩ tận tâm!",
    author: "- Chị Mai (Hà Nội)",
  },
  {
    content:
      "Quy trình IUI rõ ràng, tư vấn dễ hiểu. Tôi thấy an tâm khi chọn My Clinic.",
    author: "- Anh Hưng (TP.HCM)",
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

      {/* Featured Services */}
      <div className="section services-section">
        <Title level={3}>Dịch vụ nổi bật</Title>
        <Row gutter={[24, 24]} justify="center">
          {services.map((service) => (
            <Col xs={24} sm={12} md={8} key={service.title}>
              <Card
                className="service-card"
                bordered
                cover={<img src={service.image} alt={service.title} />}
              >
                <div className="service-icon">{service.icon}</div>
                <Title level={4}>{service.title}</Title>
                <Paragraph>{service.desc}</Paragraph>
                <Link to="/dich-vu">
                  <Button type="primary" size="small">
                    Xem tất cả dịch vụ
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Why Choose Us */}
      <div className="section why-us-section">
        <Title level={3}>Tại sao chọn chúng tôi?</Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="why-us-box">
              <div className="why-icon">🏥</div>
              <Title level={5}>Cơ sở hiện đại</Title>
              <Paragraph>
                Trang thiết bị tiên tiến và môi trường đạt chuẩn quốc tế.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="why-us-box">
              <div className="why-icon">👨‍⚕️</div>
              <Title level={5}>Đội ngũ chuyên gia hàng đầu</Title>
              <Paragraph>
                Hơn 10 năm kinh nghiệm trong lĩnh vực điều trị hiếm muộn.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="why-us-box">
              <div className="why-icon">💯</div>
              <Title level={5}>Tỉ lệ thành công cao</Title>
              <Paragraph>
                Phác đồ điều trị cá nhân hóa cho từng bệnh nhân.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Doctors */}
      <div className="section doctors-section">
        <Title level={3}>Đội ngũ bác sĩ</Title>
        <Carousel autoplay dots={false} className="doctors-carousel">
          {doctors.map((doc) => (
            <div key={doc.name} className="doctor-card">
              <img
                src={doc.photo}
                alt={doc.name}
                className="doctor-photo"
              />
              <Title level={5}>{doc.name}</Title>
              <Paragraph>{doc.specialty}</Paragraph>
            </div>
          ))}
        </Carousel>
        <Link to="/bac-si">
          <Button type="link" className="see-more-btn">
            Xem thêm
          </Button>
        </Link>
      </div>

      {/* Testimonials */}
      <div className="section testimonials-section">
        <Title level={3}>Cảm nhận của bệnh nhân</Title>
        <Carousel autoplay className="testimonials-carousel">
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-item">
              <Paragraph>"{t.content}"</Paragraph>
              <p>{t.author}</p>
            </div>
          ))}
        </Carousel>
      </div>      {/* Blog Posts */}
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

      {/* Call to Action */}
      <div className="section cta-section">
        <Card className="cta-box">
          <Title level={4}>Cần thêm thông tin?</Title>
          <Paragraph>
            Hãy để lại thông tin liên hệ, chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
          </Paragraph>
          <Link to="/register">
            <Button type="primary" size="large">
              Đăng ký tư vấn miễn phí
            </Button>
          </Link>
        </Card>
      </div>    </div>
  </MainLayout>
  );
};

export default Home;
