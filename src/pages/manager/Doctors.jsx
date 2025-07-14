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
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
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
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => (
        <span style={{ color: "#333", fontWeight: "500" }}>{text}</span>
      ),
    },
    {
      title: "Chuyên môn",
      dataIndex: "specialization",
      key: "specialization",
      render: (text) => <span className="doctor-specialty">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (_, record) => (
        <Switch
          checked={record.isAvailable}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space className="doctors-actions">
          <Tooltip title="Chỉnh sửa">
            <Button
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
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Chuyên môn"
            rules={[{ required: true, message: "Vui lòng nhập chuyên môn" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="phone">
            <Input disabled />
          </Form.Item>
          <Form.Item name="licenseNumber">
            <Input />
          </Form.Item>
          <Form.Item name="education">
            <Input />
          </Form.Item>
          <Form.Item name="experienceYears">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Doctors;
// Kết thúc file Doctors.jsx
