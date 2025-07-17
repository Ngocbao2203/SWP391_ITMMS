import React from "react";
import { Layout, Row, Col, Tooltip } from "antd";
import {
  FacebookFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "../../styles/Footer.css";

const { Footer } = Layout;

const FooterComponent = () => {
  const year = new Date().getFullYear();

  return (
    <Footer className="site-footer">
      <Row gutter={[32, 32]}>
        {/* Giới thiệu */}
        <Col xs={24} md={6}>
          <h3>Về chúng tôi</h3>
          <p>
            <strong>ITMMS</strong> là phòng khám chuyên khoa hỗ trợ sinh
            sản.
          </p>
          <p>
            Chúng tôi mang đến dịch vụ IUI, IVF uy tín với đội ngũ chuyên gia
            hơn 10 năm kinh nghiệm.
          </p>
          <p>Sứ mệnh: Đồng hành cùng bạn trên hành trình làm cha mẹ.</p>
        </Col>

        {/* Liên kết nhanh */}
        <Col xs={24} md={6}>
          <h3>Liên kết nhanh</h3>
          <ul className="footer-links">
            <li>
              <a href="/userservice">Dịch vụ</a>
            </li>
            <li>
              <a href="/doctors">Bác sĩ</a>
            </li>
            <li>
              <a href="/register">Đăng ký tư vấn</a>
            </li>
          </ul>
        </Col>

        {/* Liên hệ */}
        <Col xs={24} md={6}>
          <h3>Liên hệ</h3>
          <p>
            <EnvironmentOutlined /> Quận 9, TP.HCM
          </p>
          <p>
            <PhoneOutlined /> 0123-456-789
          </p>
          <p>
            <MailOutlined /> vfclinic@gmail.com
          </p>
          <Tooltip title="Facebook">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookFilled className="social-icon" />
            </a>
          </Tooltip>
        </Col>

        {/* Bản đồ vị trí */}
        <Col xs={24} md={6}>
          <h3>Vị trí phòng khám</h3>
          <div className="map-container">
            <iframe
              title="clinic-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.68174231239!2d106.70042301533415!3d10.762622362417325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1e22a1b6e7%3A0x51d3773f58685adf!2zMzAgxJAuIFRy4bqnbiBDaMOtbmgsIFBoxrDhu51uZyA3LCBRdeG6rW4gMywgVMOibiBCaOG7aSBDaMOtbmgsIFRow6BuaCBwaOG7kSBI4buNYyBN4bu5LCBWaeG7h3QgTmFt!5e0!3m2!1sen!2s!4v1685178863602!5m2!1sen!2s"
              width="100%"
              height="180"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Col>
      </Row>

      <div className="copyright">
        <p>
          © {year} ITMMS. Được phát triển bởi đội ngũ chuyên gia IVF Việt
          Nam.
        </p>
      </div>
    </Footer>
  );
};

export default FooterComponent;
