import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Switch,
  Tooltip,
  Tag,
  Avatar,
  InputNumber,
  Typography,
  Divider,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  StarOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import doctorService from "../../services/doctorService";
import authService from "../../services/authService";

const { Option } = Select;
const { Title, Text } = Typography;

const Doctors = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (searchParams = {}) => {
    setLoading(true);
    try {
      const response = await doctorService.getAllManagement(searchParams);
      let filteredDoctors = response.doctors || [];
      if (searchParams.name) {
        filteredDoctors = filteredDoctors.filter((manager) =>
          manager.fullName.toLowerCase().includes(searchParams.name.toLowerCase())
        );
      }
      setData(filteredDoctors);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách quản lý");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDoctor = async (values) => {
    try {
      const response = await doctorService.updateDoctor(editingDoctor.id, values);
      if (response.success) {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingDoctor.id ? { ...item, ...values } : item
          )
        );
        message.success(response.message);
        setIsModalVisible(false);
        form.resetFields();
        setEditingDoctor(null);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật quản lý");
    }
  };

  const handleStatusChange = async (id, checked) => {
    console.log("handleStatusChange called with id:", id, "checked:", checked);
    try {
      const result = await doctorService.updateManagementAvailability(id, checked);
      if (result.success) {
        message.success(result.message);
        fetchDoctors(); // Cập nhật danh sách sau khi thay đổi trạng thái
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
    fetchDoctors({ name: value });
  }, 300);

  const handleRegisterDoctor = async (values) => {
    try {
      setLoading(true);
      const userData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: "Doctor",
        specialization: values.specialization,
        phone: values.phone,
        address: values.address,
        username: values.username,
      };
      console.log("📤 Sending registration data:", userData);
      const response = await authService.register(userData);
      if (response.success) {
        message.success(response.message || "Đăng ký quản lý thành công!");
        setIsRegisterModalVisible(false);
        registerForm.resetFields();
        fetchDoctors();
      } else {
        message.error(response.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      message.error("Lỗi khi đăng ký: " + error.message);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Thông tin quản lý",
      width: "30%",
      render: (_, record) => (
        <Space>
          <Avatar size={64} src={record.avatarUrl} icon={<UserOutlined />} />
          <div>
            <Typography.Text strong style={{ fontSize: "16px" }}>
              {record.fullName}
            </Typography.Text>
            <div>
              <Tag color="blue">{record.specialization}</Tag>
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>
              <MedicineBoxOutlined /> Chuyên gia {record.specialization}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      width: "20%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>
            <MailOutlined /> {record.email}
          </span>
          <span>
            <PhoneOutlined /> {record.phone}
          </span>
        </Space>
      ),
    },
    {
      title: "Chi tiết",
      width: "25%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>
            <CalendarOutlined /> {record.experienceYears || 0} năm kinh nghiệm
          </span>
          {record.consultationFee > 0 && (
            <span>
              <DollarOutlined /> {record.consultationFee?.toLocaleString()}đ
            </span>
          )}
          {record.averageRating > 0 && record.totalAppointments > 0 && (
            <span>
              <StarOutlined /> {record.averageRating}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      width: "15%",
      render: (_, record) => (
        <Space direction="vertical" align="center">
          <Switch
            checked={record.isAvailable}
            onChange={(checked) => handleStatusChange(record.id, checked)}
            checkedChildren="Đang làm việc"
            unCheckedChildren="Tạm nghỉ"
          />
          <Tag color={record.isAvailable ? "success" : "error"}>
            {record.isAvailable ? "Đang hoạt động" : "Tạm ngưng"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      width: "10%",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa thông tin">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingDoctor(record);
                setIsModalVisible(true);
                form.setFieldsValue(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="doctors-container">
      <div className="doctors-header">
        <div className="doctors-header-left">
          <UserOutlined style={{ fontSize: 28, marginRight: 12, color: "#fff" }} />
          <h2 className="doctors-title">Danh sách quản lý</h2>
        </div>
        <p className="doctors-subtitle">
          Có <span className="doctors-count">{data.length}</span> quản lý được
          hiển thị.
        </p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsRegisterModalVisible(true)}
          style={{ marginLeft: 16 }}
        >
          Tạo tài khoản Bác Sĩ
        </Button>
      </div>

      <div className="doctors-toolbar">
        <Input.Search
          className="doctors-search"
          placeholder="Tìm kiếm theo tên hoặc chuyên môn"
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Table
        className="doctors-table"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />

      <Modal
        className="doctors-modal"
        title="Chỉnh sửa quản lý"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingDoctor(null);
          form.resetFields();
        }}
        onOk={() => {
          form
            .validateFields()
            .then(handleEditDoctor)
            .catch((info) => console.log("Validate Failed:", info));
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        closable={false}
        centered
        width={600}
      >
        <Form form={form} layout="vertical" className="doctors-form">
          <Form.Item
            name="fullName"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên quản lý" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="specialization"
            label="Chuyên môn"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Sản phụ khoa">Sản phụ khoa</Option>
              <Option value="Nam học">Nam học</Option>
              <Option value="Hiếm muộn - IVF">Hiếm muộn - IVF</Option>
              <Option value="Nội tiết sinh sản">Nội tiết sinh sản</Option>
            </Select>
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input prefix={<MailOutlined />} disabled />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input prefix={<PhoneOutlined />} disabled />
          </Form.Item>

          <Divider />

          <Form.Item name="education" label="Trình độ học vấn">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="experienceYears" label="Số năm kinh nghiệm">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="consultationFee" label="Phí tư vấn (VNĐ/giờ)">
            <InputNumber
              min={0}
              step={50000}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Tạo tài khoản quản lý"
        open={isRegisterModalVisible}
        onCancel={() => {
          setIsRegisterModalVisible(false);
          registerForm.resetFields();
        }}
        onOk={() => {
          registerForm
            .validateFields()
            .then(handleRegisterDoctor)
            .catch((info) => console.log("Validate Failed:", info));
        }}
        okText="Đăng ký"
        cancelText="Hủy"
        closable={false}
        centered
        width={600}
      >
        <Form form={registerForm} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="specialization"
            label="Chuyên môn"
            rules={[{ required: true, message: "Vui lòng chọn chuyên môn!" }]}
          >
            <Select>
              <Option value="Sản phụ khoa">Sản phụ khoa</Option>
              <Option value="Nam học">Nam học</Option>
              <Option value="Hiếm muộn - IVF">Hiếm muộn - IVF</Option>
              <Option value="Nội tiết sinh sản">Nội tiết sinh sản</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .doctors-container {
          padding: 24px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .doctors-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1890ff;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          color: #fff;
        }
        .doctors-header-left {
          display: flex;
          align-items: center;
        }
        .doctors-title {
          margin: 0;
          font-size: 24px;
          color: #fff;
        }
        .doctors-subtitle {
          margin: 0;
          font-size: 14px;
          color: #fff;
        }
        .doctors-count {
          font-weight: bold;
          color: #fff;
        }
        .doctors-toolbar {
          margin-bottom: 24px;
        }
        .doctors-search {
          width: 300px;
        }
        .doctors-table {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .doctors-modal .ant-modal-content {
          border-radius: 12px;
        }
        .doctors-form .ant-form-item-label > label {
          font-weight: 500;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Doctors;