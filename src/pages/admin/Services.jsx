import React, { useState } from 'react';
import { Table, Button, Space, Switch } from 'antd';

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

  const handleToggleStatus = (key) => {
    setServices((prev) =>
      prev.map((service) =>
        service.key === key ? { ...service, status: !service.status } : service
      )
    );
  };

  const columns = [
    // (Optional) ID column – hidden on mobile
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
      <Table columns={columns} dataSource={services} />
    </div>
  );
};

export default Services;
