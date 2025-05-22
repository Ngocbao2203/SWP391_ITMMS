import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import '../../styles/Login.css';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Login successful!');
      localStorage.setItem('user', JSON.stringify(values)); // ✅ Thêm dòng này
      window.location.href = "/"; // ✅ Reload lại trang về Home
    }, 1000);
  };

  return (
    <div className="login-container">
      <Title level={2}>Login</Title>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;