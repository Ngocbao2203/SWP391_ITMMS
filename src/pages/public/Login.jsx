// Trang đăng nhập cho người dùng hệ thống
// Sử dụng Ant Design cho UI, quản lý state bằng React hook
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Divider, Row, Col } from "antd";
import { UserOutlined, LockOutlined, MedicineBoxOutlined, HomeOutlined } from "@ant-design/icons";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services";
import { formatErrorMessage } from "../../services/authService";

const { Title } = Typography;

// Component chính trang đăng nhập
const Login = () => {
  // State loading cho nút đăng nhập
  const [loading, setLoading] = useState(false);
  // Form instance của Ant Design
  const [form] = Form.useForm();
  // Hook điều hướng
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng về trang phù hợp
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (authService.isAuthenticated() && currentUser?.token) {
      switch (currentUser.role) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Manager":
          navigate("/manager/doctors");
          break;
        case "Doctor":
          navigate("/doctor/dashboard");
          break;
        case "Customer":
          navigate("/profile");
          break;
        default:
          navigate("/");
      }
    }

    // Reset lại form khi vào trang
    form.resetFields();

    // Tắt autocomplete cho input (fix trình duyệt tự động điền)
    setTimeout(() => {
      const inputs = document.querySelectorAll(".medical-login-form input");
      inputs.forEach((input) => {
        input.setAttribute("autocomplete", "new-password");
      });
    }, 100);
  }, []);

  // Xử lý khi submit form đăng nhập
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const result = await authService.login(values);

      if (result.success && result.user?.token) {
        toast.success(result.message || "Đăng nhập thành công!");
        const user = result.user;

        // Điều hướng theo vai trò người dùng
        switch (user.role) {
          case "Admin":
            navigate("/admin/dashboard");
            break;
          case "Manager":
            navigate("/manager/doctors");
            break;
          case "Doctor":
            navigate("/doctor/dashboard");
            break;
          case "Customer":
            navigate("/profile");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error(result.message || "Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render giao diện đăng nhập
  return (
    <div className="medical-login-container">
      <div className="medical-login-card">
        {/* Banner bên trái */}
        <div className="medical-login-left">
          <div className="login-banner">
            <MedicineBoxOutlined className="medical-banner-icon" />
            <h2>
              Phần mềm quản lý và theo dõi
              <br />
              điều trị hiếm muộn
            </h2>
            <p>Đồng hành cùng bạn trên hành trình làm cha mẹ</p>
          </div>
        </div>

        {/* Form đăng nhập bên phải */}
        <div className="medical-login-right">
          <div className="home-icon-container">
            <Link to="/">
              <HomeOutlined className="home-icon" />
            </Link>
          </div>
          <Title level={2}>Đăng nhập</Title>
          <p className="login-subtitle">Vui lòng đăng nhập để tiếp tục</p>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="medical-login-form"
            autoComplete="off"
          >
            {/* Input email */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="login-icon" />}
                placeholder="Email"
                type="email"
                className="login-input"
                autoComplete="new-email"
              />
            </Form.Item>

            {/* Input password */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="login-icon" />}
                placeholder="Mật khẩu"
                className="login-input"
                autoComplete="new-password"
              />
            </Form.Item>

            {/* Quên mật khẩu */}
            <Row justify="space-between" align="middle" className="login-options">
              <Col>
                <Link to="/ReqPass" className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </Col>
            </Row>

            {/* Nút đăng nhập */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="medical-login-button"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>

            <Divider plain>Hoặc</Divider>

            {/* Đăng ký tài khoản */}
            <div className="register-prompt">
              <p>
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="register-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </Form>

          {/* Footer bản quyền */}
          <div className="login-footer">
            <p>© 2025 Phần mềm quản lý và theo dõi điều trị hiếm muộn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
// Kết thúc file Login.jsx