import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Nhập toast
import { authService } from "../../services";
import { formatErrorMessage } from "../../services/authService";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate("/");
    }

    form.resetFields();

    setTimeout(() => {
      const inputs = document.querySelectorAll(".medical-login-form input");
      inputs.forEach((input) => {
        input.setAttribute("autocomplete", "new-password");
      });
    }, 100);
  }, [navigate, form]);

  const onFinish = async (values) => {
    console.log("Login attempt with values:", values);
    setLoading(true);

    try {
      console.log("Calling authService.login...");
      const result = await authService.login(values);
      console.log("Login result:", result);

      if (result && result.success) {
        toast.success(result.message || "Đăng nhập thành công!"); // Dùng toast

        const user = authService.getCurrentUser();
        if (user) {
          console.log("User logged in:", user);
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
          navigate("/");
        }
      } else {
        const errorMessage = result?.message || "Email hoặc mật khẩu không đúng!";
        toast.error(errorMessage); // Dùng toast
        console.error("Login failed:", result);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage); // Dùng toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-login-container">
      <div className="medical-login-card">
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

            <Row justify="space-between" align="middle" className="login-options">
              <Col>
                <Link to={"/ReqPass"} className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </Col>
            </Row>

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

            <div className="register-prompt">
              <p>
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="register-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </Form>

          <div className="login-footer">
            <p>© 2025 Phần mềm quản lý và theo dõi điều trị hiếm muộn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;