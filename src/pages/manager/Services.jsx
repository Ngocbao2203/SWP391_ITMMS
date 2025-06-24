import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Switch,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import '../../styles/ServicesManager.css';

const Services = () => {
  const [services, setServices] = useState([
    {
      id: '01',
      key: '1',
      name: 'Khám Tổng Quát',
      description: 'Kiểm tra sức khỏe cơ bản',
      price: 50,
      status: true,
      image: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    },
    {
      id: '02',
      key: '2',
      name: 'Vệ Sinh Răng',
      description: 'Làm sạch và đánh bóng răng',
      price: 75,
      status: false,
      image: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    },
    {
      id: '03',
      key: '3',
      name: 'Khám Mắt',
      description: 'Kiểm tra thị lực và sức khỏe mắt',
      price: 60,
      status: true,
      image: 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Tránh shift layout khi mở modal
  useEffect(() => {
    document.body.classList.toggle('modal-open', isModalOpen);
  }, [isModalOpen]);

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
      message.success('Thêm dịch vụ thành công!');
    });
  };

  const handleDeleteService = (key) => {
    setServices((prev) => prev.filter((s) => s.key !== key));
    message.success('Đã xóa dịch vụ!');
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <code>{id}</code>,
      responsive: ['md'],
    },
    {
      title: 'Hình Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (url) => (
        <img
          src={url}
          alt="dịch vụ"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Tên Dịch Vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price} VNĐ`,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={() => handleToggleStatus(record.key)}
          checkedChildren="Kích Hoạt"
          unCheckedChildren="Tắt"
        />
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
            onConfirm={() => handleDeleteService(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="services-container">
      <h2 className="services-title">Dịch Vụ</h2>

      <Button
        type="primary"
        className="add-service-button"
        onClick={() => setIsModalOpen(true)}
        icon={<PlusOutlined />}
      >
        Thêm Dịch Vụ
      </Button>

      <Table
        columns={columns}
        dataSource={services}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <Modal
        title="Thêm Dịch Vụ Mới"
        open={isModalOpen}
        onOk={handleAddService}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
        centered
        closable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Dịch Vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô Tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <InputNumber min={1} className="full-width" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Link Hình Ảnh"
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
