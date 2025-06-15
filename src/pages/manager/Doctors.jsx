import React, { useState } from 'react';
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
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import '../../styles/Doctors.css';

const { Option } = Select;

const initialData = [
  {
    key: '1',
    name: 'Dr. Nguyễn Văn A',
    specialty: 'Sản phụ khoa',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Dr. Trần Thị B',
    specialty: 'Nam học',
    status: 'Inactive',
  },
  {
    key: '3',
    name: 'Dr. Lê Quốc C',
    specialty: 'Hiếm muộn',
    status: 'Active',
  },
];

const Doctors = () => {
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null);

  const handleAddOrEditDoctor = (values) => {
    if (editingDoctor) {
      const updated = data.map((item) =>
        item.key === editingDoctor.key ? { ...item, ...values } : item
      );
      setData(updated);
      message.success('Đã cập nhật thông tin bác sĩ');
    } else {
      const newDoctor = {
        key: Date.now().toString(),
        ...values,
      };
      setData((prev) => [...prev, newDoctor]);
      message.success('Thêm bác sĩ thành công');
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingDoctor(null);
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Đã xóa bác sĩ');
  };

  const handleStatusChange = (key, checked) => {
    const newData = data.map((item) =>
      item.key === key ? { ...item, status: checked ? 'Active' : 'Inactive' } : item
    );
    setData(newData);
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
  }, 300);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.specialty.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="doctor-name">{text}</span>,
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'specialty',
      key: 'specialty',
      render: (text) => <span className="doctor-specialty">{text}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          className="doctors-status-switch"
          checked={status === 'Active'}
          onChange={(checked) => handleStatusChange(record.key, checked)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm nghỉ"
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
          <Popconfirm
            title="Bạn có chắc muốn xóa bác sĩ này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
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
          Có <span className="doctors-count">{filteredData.length}</span> bác sĩ được hiển thị.
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
        <Button
          className="doctors-add-btn"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDoctor(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm bác sĩ
        </Button>
      </div>

      <Table
        className="doctors-table"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        className="doctors-modal"
        title={editingDoctor ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingDoctor(null);
        }}
        onOk={() => {
          form
            .validateFields()
            .then(handleAddOrEditDoctor)
            .catch((info) => console.log('Validate Failed:', info));
        }}
        okText={editingDoctor ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="doctors-form">
          <Form.Item
            name="name"
            label="Họ và Tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên bác sĩ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialty"
            label="Chuyên môn"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Chọn trạng thái hoạt động' }]}
          >
            <Select>
              <Option value="Active">Đang hoạt động</Option>
              <Option value="Inactive">Tạm nghỉ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Doctors;
