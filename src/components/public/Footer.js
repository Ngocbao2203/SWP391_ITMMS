import React from 'react';
import { Layout, Row, Col } from 'antd';
import {
  FacebookFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import '../../styles/Footer.css';

const { Footer } = Layout;

const AppFooter = () => {
  const year = new Date().getFullYear();
  return (
    <Footer className="app-footer">
      <Row gutter={[16, 16]} justify="space-between">
        <Col xs={24} md={8}>
          <h3>Contact Us</h3>
          <p><EnvironmentOutlined /> 123 Clinic St, City, Country</p>
          <p><PhoneOutlined /> 0123-456-789</p>
          <p><MailOutlined /> info@myclinic.com</p>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookFilled style={{ fontSize: 22, color: '#1877f3', marginRight: 8 }} />
          </a>
          {/* Add Zalo or other social links here */}
        </Col>
        <Col xs={24} md={8}>
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/services">Services</a></li>
            <li><a href="/doctors">Doctors</a></li>
            <li><a href="/feedback">Feedback</a></li>
          </ul>
        </Col>
        <Col xs={24} md={8} className="copyright">
          <p>Copyright © {year} My Clinic. All rights reserved.</p>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;