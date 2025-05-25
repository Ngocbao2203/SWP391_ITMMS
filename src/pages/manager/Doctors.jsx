import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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

  const handleAddDoctor = (values) => {
    const newDoctor = {
      key: Date.now().toString(),
      ...values,
    };
    setData((prev) => [...prev, newDoctor]);
    setIsModalVisible(false);
    form.resetFields();
  };

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
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'specialty',
      key: 'specialty',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'volcano'}>
          {status === 'Active' ? 'Đang hoạt động' : 'Tạm nghỉ'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">Xem</Button>
          <Button type="link" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Danh sách bác sĩ</h2>

      {/* Thanh công cụ: Tìm kiếm + Thêm bác sĩ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <Input.Search
          placeholder="Tìm kiếm theo tên hoặc chuyên môn"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Thêm bác sĩ
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredData} />

      {/* Form thêm bác sĩ */}
      <Modal
        title="Thêm bác sĩ mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then(handleAddDoctor)
            .catch((info) => console.log('Validate Failed:', info));
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
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
