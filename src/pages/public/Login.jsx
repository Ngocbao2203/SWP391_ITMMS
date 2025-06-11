import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Divider, Row, Col } from "antd";
import { UserOutlined, LockOutlined, MedicineBoxOutlined, HomeOutlined } from "@ant-design/icons";
import "../../styles/Login.css";
import { Link } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Đăng nhập thành công!");
      localStorage.setItem("user", JSON.stringify(values)); // ✅ Lưu thông tin đăng nhập
      window.location.href = "/"; // ✅ Chuyển đến trang Home
    }, 1000);
  };
  return (
    <div className="medical-login-container">
      <div className="medical-login-card">
        <div className="medical-login-left">
          <div className="login-banner">
            <MedicineBoxOutlined className="medical-banner-icon" />
            <h2>Phần mềm quản lý và theo dõi<br />điều trị hiếm muộn</h2>
            <p>Đồng hành cùng bạn trên hành trình làm cha mẹ</p>
          </div>
        </div>
          <div className="medical-login-right">          <div className="home-icon-container">
            <Link to="/">
              <HomeOutlined className="home-icon" />
            </Link>
          </div>
          <Title level={2}>Đăng nhập</Title>
          <p className="login-subtitle">Vui lòng đăng nhập để tiếp tục</p>
          <Form name="login" onFinish={onFinish} layout="vertical" size="large" className="medical-login-form">
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email" 
                type="email" 
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu" 
              />
            </Form.Item>
            
            <Row justify="space-between" align="middle" className="login-options">
              <Col>
                <Link to={"/ReqPass"} className="forgot-password">Quên mật khẩu?</Link> 
              </Col>
            </Row>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className="medical-login-button">
                Đăng nhập
              </Button>
            </Form.Item>
            
            <Divider plain>Hoặc</Divider>
            
            <div className="register-prompt">
              <p>Bạn chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký ngay</Link></p>
            </div>
          </Form>
          
          <div className="login-footer">
            <p>© 2025 Phần mềm quản lý và theo dõi điều trị hiếm muộn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
