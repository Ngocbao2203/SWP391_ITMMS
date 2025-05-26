import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { 
  LockOutlined, 
  MailOutlined, 
  MedicineBoxOutlined, 
  HeartOutlined 
} from "@ant-design/icons";
import '../../styles/Register.css';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Register = ({ onRegister }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      message.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      window.location.href = '/login';
    }, 1000);
  };

  return (    <div className="medical-register-container">
      <div className="medical-register-card">
        <div className="medical-register-left">
          <div className="register-banner">
            <MedicineBoxOutlined className="medical-banner-icon" />
            <h2>Phần mềm quản lý và theo dõi<br />điều trị hiếm muộn</h2>
            <p>Đồng hành cùng bạn trên hành trình làm cha mẹ</p>
          </div>
        </div>
        
        <div className="medical-register-right">
          <div className="medical-register-logo">
            <div className="logo-icon-container">
              <HeartOutlined className="logo-icon" />
              <h3 className="logo-text">ITMMS</h3>
            </div>
          </div>
          <Title level={2}>Đăng ký tài khoản</Title>
          <p className="register-subtitle">Vui lòng điền đầy đủ thông tin để đăng ký</p>
            <Form 
            form={form}
            name="medical_register" 
            onFinish={onFinish} 
            layout="vertical"
            size="large"
            className="medical-register-form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" }, 
                { type: 'email', message: "Email không hợp lệ!" }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="site-form-item-icon" />} 
                placeholder="Email" 
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu" 
              />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
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
            >
              <Input.Password 
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Xác nhận mật khẩu" 
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block                className="medical-register-button"
              >
                Đăng ký
              </Button>
            </Form.Item>
              <div className="login-prompt">
              <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
            </div>
          </Form>
          
          <div className="register-footer">
            <p>© 2025 Phần mềm quản lý và theo dõi điều trị hiếm muộn. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;