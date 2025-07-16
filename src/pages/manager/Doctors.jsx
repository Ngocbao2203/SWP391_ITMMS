// Quản lý danh sách bác sĩ cho admin/manager
// Sử dụng Ant Design cho UI, quản lý state bằng React hook
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
  Rate,
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
  TrophyOutlined,
  MedicineBoxOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import doctorService from "../../services/doctorService";

const { Option } = Select;

// Component chính quản lý bác sĩ
const Doctors = () => {
  // State lưu trữ danh sách bác sĩ, modal, form, filter, loading
  const [data, setData] = useState([]); // Danh sách bác sĩ
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal chỉnh sửa
  const [form] = Form.useForm(); // Form chỉnh sửa bác sĩ
  const [searchText, setSearchText] = useState(""); // Từ khóa tìm kiếm
  const [editingDoctor, setEditingDoctor] = useState(null); // Bác sĩ đang chỉnh sửa
  const [loading, setLoading] = useState(false); // Đang tải dữ liệu

  // Tải danh sách bác sĩ khi component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Gọi API lấy danh sách bác sĩ, có thể truyền searchParams để lọc
  const fetchDoctors = async (searchParams = {}) => {
    setLoading(true);
    try {
      const response = await doctorService.getAllDoctors(searchParams);
      let filteredDoctors = response.doctors || [];
      if (searchParams.name) {
        filteredDoctors = filteredDoctors.filter((doctor) =>
          doctor.fullName
            .toLowerCase()
            .includes(searchParams.name.toLowerCase())
        );
      }
      setData(filteredDoctors);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật thông tin bác sĩ
  const handleEditDoctor = async (values) => {
    try {
      const response = await doctorService.updateDoctor(
        editingDoctor.id,
        values
      );
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
      message.error("Lỗi khi cập nhật bác sĩ");
    }
  };

  // Xử lý cập nhật trạng thái hoạt động của bác sĩ
  const handleStatusChange = async (id, checked) => {
    try {
      const response = await doctorService.updateDoctorAvailability(
        id,
        checked
      );
      if (response.success) {
        message.success("Cập nhật trạng thái thành công");
        // fetch lại danh sách bác sĩ để đồng bộ `isAvailable`
        fetchDoctors();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // Xử lý tìm kiếm bác sĩ theo tên (debounce để giảm số lần gọi API)
  const handleSearch = debounce((value) => {
    setSearchText(value);
    fetchDoctors({ name: value });
  }, 300);

  // Định nghĩa các cột cho bảng bác sĩ
  const columns = [
    {
      title: "Thông tin bác sĩ",
      width: "30%",
      render: (_, record) => (
        <Space>
          <Avatar
            size={64}
            src={record.photo}
            icon={<UserOutlined />}
          />
          <div>
            <Typography.Text strong style={{ fontSize: '16px' }}>
              {record.fullName}
            </Typography.Text>
            <div>
              <Tag color="blue">{record.specialization}</Tag>
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              <MedicineBoxOutlined /> {record.licenseNumber}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: "Liên hệ",
      width: "20%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span><MailOutlined /> {record.email}</span>
          <span><PhoneOutlined /> {record.phone}</span>
        </Space>
      )
    },
    {
      title: "Chi tiết",
      width: "25%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>
            <CalendarOutlined /> {record.experienceYears} năm kinh nghiệm
          </span>
          {record.consultationFee > 0 && (
            <span>
              <DollarOutlined /> {record.consultationFee?.toLocaleString()}đ
            </span>
          )}
          {record.rating > 0 && record.reviewCount > 0 && (
            <span>
              <StarOutlined /> {record.rating}
            </span>
          )}
        </Space>
      )
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
      )
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
      )
    }
  ];

  // Render giao diện quản lý bác sĩ
  return (
    <div className="doctors-container">
      {/* Header hiển thị tổng số bác sĩ */}
      <div className="doctors-header">
        <div className="doctors-header-left">
          <UserOutlined
            style={{ fontSize: 28, marginRight: 12, color: "#fff" }}
          />
          <h2 className="doctors-title">Danh sách bác sĩ</h2>
        </div>
        <p className="doctors-subtitle">
          Có <span className="doctors-count">{data.length}</span> bác sĩ được
          hiển thị.
        </p>
      </div>

      {/* Toolbar tìm kiếm */}
      <div className="doctors-toolbar">
        <Input.Search
          className="doctors-search"
          placeholder="Tìm kiếm theo tên hoặc chuyên môn"
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Bảng danh sách bác sĩ */}
      <Table
        className="doctors-table"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />

      {/* Modal chỉnh sửa bác sĩ */}
      <Modal
        className="doctors-modal"
        title="Chỉnh sửa bác sĩ"
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
      >
        <Form form={form} layout="vertical" className="doctors-form">
          <Form.Item
            name="fullName"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên bác sĩ" }]}
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

          <Form.Item name="licenseNumber" label="Số giấy phép hành nghề">
            <Input prefix={<MedicineBoxOutlined />} />
          </Form.Item>

          <Divider />

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
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="consultationFee" label="Phí tư vấn (VNĐ/giờ)">
            <InputNumber
              min={0}
              step={50000}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Doctors;
// Kết thúc file Doctors.jsx
