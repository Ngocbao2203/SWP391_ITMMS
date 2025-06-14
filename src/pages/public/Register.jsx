import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Row, Col } from 'antd';
import { 
  LockOutlined, 
  MailOutlined, 
  MedicineBoxOutlined, 
  UserOutlined,
  PhoneOutlined,
  HomeOutlined
} from "@ant-design/icons";
import '../../styles/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // Kiểm tra nếu người dùng đã đăng nhập
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate('/');
    }
    
    // Xóa giá trị tự động điền khi component được mount
    setTimeout(() => {
      form.resetFields();
      // Thêm giải pháp tùy chỉnh để ngăn autofill
      const inputs = document.querySelectorAll('.medical-register-form input');
      inputs.forEach(input => {
        input.setAttribute('autocomplete', 'new-password');
      });
    }, 100);
  }, [navigate, form]);
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Xử lý đăng ký
      const result = await authService.register(values);
      
      if (result.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        navigate('/login');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-register-container">
      <div className="medical-register-card">
        <div className="medical-register-left">
          <div className="register-banner">
            <MedicineBoxOutlined className="medical-banner-icon" />
            <h2>Phần mềm quản lý và theo dõi<br />điều trị hiếm muộn</h2>
            <p>Đồng hành cùng bạn trên hành trình làm cha mẹ</p>
          </div>
        </div>
        
        <div className="medical-register-right">          <div className="home-icon-container">
            <Link to="/">
              <HomeOutlined className="home-icon" />
            </Link>
          </div>
          
          <Title level={2} className="register-title">Đăng Ký Tài Khoản</Title>
          <p className="register-subtitle">Điền thông tin cá nhân của bạn để bắt đầu</p>
            <Form 
            form={form}
            name="medical_register" 
            onFinish={onFinish} 
            layout="vertical"
            size="large"
            className="medical-register-form"
            scrollToFirstError
            autoComplete="off"
          ><Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  required
                  rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                >                  <Input 
                    prefix={<UserOutlined className="register-icon" />} 
                    placeholder="Họ và tên đầy đủ"
                    className="register-input"
                    autoComplete="new-name"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  required
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" }, 
                    { type: 'email', message: "Email không hợp lệ!" }
                  ]}
                >                  <Input 
                    prefix={<MailOutlined className="register-icon" />} 
                    placeholder="Email"
                    className="register-input"
                    autoComplete="new-email"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  required
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" }
                  ]}
                >                  <Input 
                    prefix={<PhoneOutlined className="register-icon" />} 
                    placeholder="Số điện thoại"
                    className="register-input"
                    autoComplete="new-phone"
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="address"
              label="Địa chỉ"
              required
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >              <Input 
                prefix={<HomeOutlined className="register-icon" />} 
                placeholder="Địa chỉ liên hệ"
                className="register-input"
                autoComplete="new-address"
              />
            </Form.Item>
            
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  required
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" }
                  ]}
                >                  <Input.Password 
                    prefix={<LockOutlined className="register-icon" />}
                    placeholder="Mật khẩu"
                    className="register-input"
                    autoComplete="new-password"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  required
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                      },
                    }),
                  ]}
                >                  <Input.Password 
                    prefix={<LockOutlined className="register-icon" />}
                    placeholder="Xác nhận mật khẩu"
                    className="register-input"
                    autoComplete="new-password" 
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block                
                className="medical-register-button"
              >
                Đăng ký ngay
              </Button>
            </Form.Item>
            
            <div className="login-prompt">
              <Text>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></Text>
            </div>
          </Form>
          
          <div className="register-footer">
            <p>© 2025 Phần mềm quản lý và theo dõi điều trị hiếm muộn. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;