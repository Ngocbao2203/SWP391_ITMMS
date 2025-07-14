import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
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
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate('/');
    }
    
    setTimeout(() => {
      form.resetFields();
      const inputs = document.querySelectorAll('.medical-register-form input');
      inputs.forEach(input => {
        input.setAttribute('autocomplete', 'new-password');
      });
    }, 100);
  }, [navigate, form]);
  
  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      const result = await authService.register(values);
      
      if (result.success) {
        toast.success('Đăng ký thành công! Đang đăng nhập...');
        
        try {
          const loginResult = await authService.login({
            email: values.email,
            password: values.password
          });
          
          if (loginResult.success) {
            toast.success('Chào mừng bạn đến với ITMMS!');
            
            const user = authService.getCurrentUser();
            if (user) {
              switch (user.role) {
                case 'Admin':
                  navigate('/admin/dashboard');
                  break;
                case 'Manager':
                  navigate('/manager/doctors');
                  break;
                case 'Doctor':
                  navigate('/doctor/dashboard');
                  break;
                case 'Customer':
                  navigate('/');
                  break;
                default:
                  navigate('/');
              }
            } else {
              navigate('/');
            }
          } else {
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
          }
        } catch (loginError) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          navigate('/login');
        }
      } else {
        let errorText = result.message || 'Đăng ký thất bại';
        
        if (result.errors && Object.keys(result.errors).length > 0) {
          const errorList = [];
          Object.keys(result.errors).forEach(field => {
            const errorMessages = result.errors[field];
            const fieldName = getFieldDisplayName(field);
            
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach(msg => {
                errorList.push(`${fieldName}: ${msg}`);
              });
            } else {
              errorList.push(`${fieldName}: ${errorMessages}`);
            }
          });
          
          if (errorList.length > 0) {
            errorText = errorList.join(' • ');
          }
        }
        
        toast.error(errorText); // Dùng toast thay cho setErrorMessage
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký: ' + error.message); // Dùng toast
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error('Vui lòng kiểm tra và điền đầy đủ thông tin!');
  };

  const getFieldDisplayName = (field) => {
    const fieldNames = {
      fullName: 'Họ và tên',
      username: 'Tên đăng nhập', 
      email: 'Email',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu'
    };
    return fieldNames[field] || field;
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
        
        <div className="medical-register-right">
          <div className="home-icon-container">
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
            onFinishFailed={onFinishFailed}
            layout="vertical"
            size="large"
            className="medical-register-form"
            scrollToFirstError
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                >
                  <Input 
                    prefix={<UserOutlined className="register-icon" />} 
                    placeholder="Họ và tên đầy đủ"
                    className="register-input"
                    autoComplete="new-name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="username"
                  required
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                    { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined className="register-icon" />} 
                    placeholder="Tên đăng nhập"
                    className="register-input"
                    autoComplete="new-username"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"  
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" }, 
                    { type: 'email', message: "Email không hợp lệ!" }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="register-icon" />} 
                    placeholder="Email"
                    className="register-input"
                    autoComplete="new-email"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone" // Đổi từ phoneNumber sang phone
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" }
                  ]}
                >
                  <Input 
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
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input 
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
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" }
                  ]}
                >
                  <Input.Password 
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