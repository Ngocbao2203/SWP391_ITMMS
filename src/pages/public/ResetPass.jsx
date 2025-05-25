import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useParams(); // Giả sử token được truyền qua URL params

  useEffect(() => {
    // Xác thực token khi component được mount
    const validateToken = async () => {
      try {
        // Gọi API để xác thực token
        // const valid = await api.validateResetToken(token);
        const valid = true; // Giả định token hợp lệ
        setTokenValid(valid);

        if (!valid) {
          message.error(
            "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
          );
        }
      } catch (error) {
        message.error("Có lỗi xảy ra khi xác thực liên kết");
        setTokenValid(false);
        console.error(error);
      }
    };

    validateToken();
  }, [token]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gọi API để đặt lại mật khẩu
      // await api.resetPassword(token, values.password);

      message.success("Đặt lại mật khẩu thành công");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      message.error("Không thể đặt lại mật khẩu. Vui lòng thử lại sau.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <div>Đang xác thực...</div>;
  }

  if (tokenValid === false) {
    return (
      <div
        style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}
      >
        <h2>Liên kết không hợp lệ hoặc đã hết hạn</h2>
        <p>Vui lòng yêu cầu liên kết đặt lại mật khẩu mới.</p>
        <Link to="/forgot-password">
          <Button type="primary">Quên mật khẩu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h1>Đặt lại mật khẩu</h1>
      <p>Nhập mật khẩu mới của bạn</p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
