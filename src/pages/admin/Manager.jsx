// filepath: d:\FPT\Kì_5\SWP391\SWP391_ITMMS\src\pages\admin\Manager.jsx
import React, { useState } from 'react';
import { Table, Card, Tag, Space, Button, Modal, Form, Input, Select, Tooltip, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import '../../styles/Manager.css';

const { Option } = Select;

// Dữ liệu mẫu cho danh sách quản lý
const initialData = [
  {
    key: '1',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0912345678',
    department: 'Khoa Hiếm Muộn',
    status: 'active',
  },
  {
    key: '2',
    name: 'Trần Thị Bình',
    email: 'tranthiminh@gmail.com',
    phone: '0923456789',
    department: 'Khoa Sản',
    status: 'inactive',
  },
  {
    key: '3',
    name: 'Lê Hoàng Dương',
    email: 'lehoangduong@gmail.com',
    phone: '0934567890',
    department: 'Khoa Nam Học',
    status: 'active',
  },
  {
    key: '4',
    name: 'Phạm Minh Tú',
    email: 'phamminhthu@gmail.com',
    phone: '0945678901',
    department: 'Khoa Hiếm Muộn',
    status: 'active',
  },
  {
    key: '5',
    name: 'Hoàng Thị Linh',
    email: 'hoangthilinh@gmail.com',
    phone: '0956789012',
    department: 'Khoa Hiếm Muộn',
    status: 'inactive',
  },
];

const Manager = () => {
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Xử lý thêm quản lý mới
  const handleAddManager = (values) => {
    const newManager = {
      key: Date.now().toString(),
      ...values,
    };
    setData([...data, newManager]);
    setIsModalVisible(false);
    form.resetFields();
  };

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.department.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.includes(searchText)
  );

  // Cấu hình cột
  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Button type="link" style={{ padding: 0 }}>{text}</Button>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'volcano'}>
          {status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button type="primary" size="small">Chi tiết</Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="default" size="small">Sửa</Button>
          </Tooltip>
          <Tooltip title="Vô hiệu hóa">
            <Button type="danger" size="small">Khóa</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2 className="manager-title">Quản lý người quản lý</h2>
      </div>

      <Card className="manager-card">
        {/* Thanh công cụ: Tìm kiếm + Thêm quản lý */}
        <div className="manager-actions">
          <Input.Search
            placeholder="Tìm kiếm theo tên, email, phòng ban hoặc SĐT"
            allowClear
            className="manager-search"
            prefix={<SearchOutlined />}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
          >
            Thêm quản lý
          </Button>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Bảng danh sách quản lý */}
        <div className="manager-table">
          <Table 
            columns={columns} 
            dataSource={filteredData}
            pagination={{ 
              pageSize: 8,
              position: ['bottomCenter'],
              showSizeChanger: false
            }}
          />
        </div>
      </Card>

      {/* Form thêm quản lý mới */}
      <Modal
        title="Thêm quản lý mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then(handleAddManager)
            .catch((info) => console.log('Validate Failed:', info));
        }}
        okText="Thêm"
        cancelText="Hủy"
        className="manager-modal"
      >
        <Form form={form} layout="vertical" className="manager-form">
          <Form.Item
            name="name"
            label="Họ và Tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="Phòng ban"
            rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
          >
            <Select placeholder="Chọn phòng ban">
              <Option value="Khoa Hiếm Muộn">Khoa Hiếm Muộn</Option>
              <Option value="Khoa Sản">Khoa Sản</Option>
              <Option value="Khoa Nam Học">Khoa Nam Học</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="active"
          >
            <Select>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Tạm khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Manager;