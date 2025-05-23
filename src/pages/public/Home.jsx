import React from 'react';
import { Button, Card, Carousel, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/Home.css'; 

const { Title, Paragraph } = Typography;

const services = [
  {
    title: 'IUI - Intrauterine Insemination',
    desc: 'Safe, effective reproductive support for couples.',
    icon: '🧬',
  },
  {
    title: 'IVF - In Vitro Fertilization',
    desc: 'Advanced fertilization technology for your family.',
    icon: '👶',
  },
  {
    title: 'Reproductive Support',
    desc: 'Comprehensive care and consultation.',
    icon: '🤰',
  },
];

const doctors = [
  { name: 'Dr. Nguyen Van A', specialty: 'IVF Specialist' },
  { name: 'Dr. Tran Thi B', specialty: 'IUI Expert' },
  { name: 'Dr. Le Van C', specialty: 'Reproductive Endocrinologist' },
];

const articles = [
  {
    title: 'Successful IVF Stories',
    desc: 'Real experiences from our patients.',
    link: '/bai-viet/ivf-stories',
  },
  {
    title: 'Tips for Fertility Health',
    desc: 'How to prepare for your journey.',
    link: '/bai-viet/fertility-tips',
  },
  {
    title: 'Understanding IUI',
    desc: 'What to expect from the procedure.',
    link: '/bai-viet/understanding-iui',
  },
];

const Home = () => (
  <MainLayout>
    <div className="home-page">
      {/* Banner */}
      <div className="banner-section">
        <div className="banner-content">
          <Title level={2} className="banner-title">
            Accompanying the act of parenthood - Prestige, Professionalism, and dedication
          </Title>
        </div>
      </div>

      {/* Featured Services */}
      <div className="section services-section">
        <Title level={3}>Featured Services</Title>
        <Row gutter={[24, 24]} justify="center">
          {services.map((service) => (
            <Col xs={24} sm={12} md={8} key={service.title}>
              <Card className="service-card" bordered>
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

      {/* Doctors Carousel/Grid */}
      <div className="section doctors-section">
        <Title level={3}>Our Doctors</Title>
        <Carousel autoplay dots={false} className="doctors-carousel">
          {doctors.map((doc) => (
            <div key={doc.name} className="doctor-card">
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

      {/* Articles */}
      <div className="section articles-section">
        <Title level={3}>Experience Sharing</Title>
        <Row gutter={[24, 24]}>
          {articles.slice(0, 3).map((art) => (
            <Col xs={24} sm={12} md={8} key={art.title}>
              <Card title={art.title} bordered>
                <Paragraph>{art.desc}</Paragraph>
                <Link to={art.link}>
                  <Button type="link">Read more</Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
        <Link to="/bai-viet">
          <Button type="link" className="see-more-btn">
            See more
          </Button>
        </Link>
      </div>
    </div>
  </MainLayout>
);

export default Home;