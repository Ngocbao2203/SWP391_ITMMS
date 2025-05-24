import React, { useState } from 'react';
import { Table, Button, Space, Switch, Modal, Form, Input, InputNumber } from 'antd';
import '../../styles/Services.css'; 
const Services = () => {
  const [services, setServices] = useState([
    {
      id: '01',
      key: '1',
      name: 'General Checkup',
      description: 'Basic health examination',
      price: 50,
      status: true,
      image: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    },
    {
      id: '02',
      key: '2',
      name: 'Dental Cleaning',
      description: 'Teeth cleaning and polishing',
      price: 75,
      status: false,
      image: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    },
    {
      id: '03',
      key: '3',
      name: 'Eye Examination',
      description: 'Vision and eye health check',
      price: 60,
      status: true,
      image: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleToggleStatus = (key) => {
    setServices((prev) =>
      prev.map((service) =>
        service.key === key ? { ...service, status: !service.status } : service
      )
    );
  };

  const handleAddService = () => {
    form.validateFields().then((values) => {
      const newService = {
        ...values,
        id: (services.length + 1).toString().padStart(2, '0'),
        key: (services.length + 1).toString(),
        status: true,
      };
      setServices([...services, newService]);
      form.resetFields();
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <code>{id}</code>,
      responsive: ['md'],
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (url) => (
        <img
          src={url}
          alt="service"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={() => handleToggleStatus(record.key)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Services</h2>

      <Button type="primary" className="mb-4" onClick={() => setIsModalOpen(true)}>
        Add Service
      </Button>

      <Table columns={columns} dataSource={services} />

      <Modal
        title="Thêm Dịch Vụ Mới"
        open={isModalOpen}
        onOk={handleAddService}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Link hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập link hình ảnh!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
