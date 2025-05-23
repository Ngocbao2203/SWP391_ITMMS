import React, { useState } from 'react';
import { Table, Tag, Rate, Button, Space } from 'antd';
import '../../styles/Feedback.css'
const Feedback = () => {
  const [feedbacks] = useState([
    {
      key: '1',
      user: 'John Doe',
      service: 'General Checkup',
      rating: 5,
      feedback: 'Excellent service and friendly staff.',
      date: '2024-05-20',
      status: 'Approved',
    },
    {
      key: '2',
      user: 'Jane Smith',
      service: 'Dental Cleaning',
      rating: 4,
      feedback: 'Very satisfied with the consultation.',
      date: '2024-05-18',
      status: 'Pending',
    },
  ]);

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      render: (service) => <Tag color="blue">{service}</Tag>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      key: 'feedback',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Approved' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">View</Button>
          <Button type="link" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">User Feedback</h2>
      <Table columns={columns} dataSource={feedbacks} />
    </div>
  );
};

export default Feedback;
