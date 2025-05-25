import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const RequestPasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gọi API để gửi email đặt lại mật khẩu
      // Ví dụ: await api.sendPasswordResetEmail(values.email);

      message.success(
        "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn"
      );
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h1>Quên mật khẩu</h1>
      <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Gửi liên kết
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/login">Quay lại đăng nhập</Link>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
