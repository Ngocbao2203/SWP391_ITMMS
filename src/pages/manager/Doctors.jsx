import React, { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Switch,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import doctorService from '../../services/doctorService';

const { Option } = Select;

const Doctors = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (searchParams = {}) => {
    setLoading(true);
    try {
      const response = await doctorService.getAllDoctors(searchParams);
      let filteredDoctors = response.doctors || [];
      if (searchParams.name) {
        filteredDoctors = filteredDoctors.filter(doctor =>
          doctor.fullName.toLowerCase().includes(searchParams.name.toLowerCase())
        );
      }
      setData(filteredDoctors);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách bác sĩ');
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
      message.error('Lỗi khi cập nhật bác sĩ');
    }
  };

  const handleStatusChange = async (id, checked) => {
    try {
      const response = await doctorService.updateDoctorAvailability(id, checked);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công');
        // fetch lại danh sách bác sĩ để đồng bộ `isAvailable`
        fetchDoctors();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
    fetchDoctors({ name: value });
  }, 300);

  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => <span className="doctor-name">{text}</span>,
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text) => <span className="doctor-specialty">{text}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (_, record) => (
        <Switch
          checked={record.isAvailable}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
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

  return (
    <div className="doctors-container">
      <div className="doctors-header">
        <div className="doctors-header-left">
          <UserOutlined style={{ fontSize: 28, marginRight: 12, color: '#fff' }} />
          <h2 className="doctors-title">Danh sách bác sĩ</h2>
        </div>
        <p className="doctors-subtitle">
          Có <span className="doctors-count">{data.length}</span> bác sĩ được hiển thị.
        </p>
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
            .catch((info) => console.log('Validate Failed:', info));
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        closable={false}
      >
        <Form form={form} layout="vertical" className="doctors-form">
          <Form.Item
            name="fullName"
            label="Họ và Tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên bác sĩ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Chuyên môn"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}
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