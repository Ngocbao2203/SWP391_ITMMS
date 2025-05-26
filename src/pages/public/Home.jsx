import React, { useState, useEffect } from "react";
import { Button, Card, Carousel, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Home.css";
import { getPublishedBlogs } from "../../services/blogService";

const { Title, Paragraph } = Typography;

const services = [
  {
    title: "IUI - Intrauterine Insemination",
    desc: "Safe, effective reproductive support for couples.",
    icon: "🧬",
    image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    title: "IVF - In Vitro Fertilization",
    desc: "Advanced fertilization technology for your family.",
    icon: "👶",
    image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    title: "Reproductive Support",
    desc: "Comprehensive care and consultation.",
    icon: "🤰",
    image: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
];

const doctors = [
  {
    name: "Dr. Nguyen Van A",
    specialty: "IVF Specialist",
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    name: "Dr. Tran Thi B",
    specialty: "IUI Expert",
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
  {
    name: "Dr. Le Van C",
    specialty: "Reproductive Endocrinologist",
    photo: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
  },
];

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
        <Title level={3}>Featured Services</Title>
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
                    See all services
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Why Choose Us */}
      <div className="section why-us-section">
        <Title level={3}>Why Choose Us?</Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="why-us-box">
              <div className="why-icon">🏥</div>
              <Title level={5}>Modern Facilities</Title>
              <Paragraph>
                State-of-the-art equipment and international-standard
                environment.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="why-us-box">
              <div className="why-icon">👨‍⚕️</div>
              <Title level={5}>Top Doctors</Title>
              <Paragraph>
                10+ years of experience in fertility treatment.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="why-us-box">
              <div className="why-icon">💯</div>
              <Title level={5}>High Success Rate</Title>
              <Paragraph>
                Customized treatment plans for every patient.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Doctors */}
      <div className="section doctors-section">
        <Title level={3}>Our Doctors</Title>
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
            See more
          </Button>
        </Link>
      </div>

      {/* Testimonials */}
      <div className="section testimonials-section">
        <Title level={3}>What Our Patients Say</Title>
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
        <Title level={3}>Blog & Experience Sharing</Title>
        <Row gutter={[24, 24]}>          {blogs.map((blog) => (
            <Col xs={24} sm={12} md={8} key={blog.id || blog.key}>              <Card
                title={blog.title}
                bordered
                hoverable
                cover={<img alt={blog.title} src={blog.coverImage} />}
                onClick={() => window.location.href = `/blog/${blog.id || blog.key}?from=home`}
              >
                <Paragraph>{blog.summary}</Paragraph>                <Link to={`/blog/${blog.id || blog.key}?from=home`}>
                  <Button type="link">
                    Read more
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>        <Link to="/blog">
          <Button type="link" className="see-more-btn">
            See more
          </Button>
        </Link>
      </div>

      {/* Call to Action */}
      <div className="section cta-section">
        <Card className="cta-box">
          <Title level={4}>Need more information?</Title>
          <Paragraph>
            Leave your contact info and we’ll get back to you soon.
          </Paragraph>
          <Link to="/register">
            <Button type="primary" size="large">
              Register for Free Consultation
            </Button>
          </Link>
        </Card>
      </div>    </div>
  </MainLayout>
  );
};

export default Home;
