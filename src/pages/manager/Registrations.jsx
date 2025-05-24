import React, { useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  message,
  Select,
} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const initialData = [
  {
    key: '1',
    patient: 'Nguyễn Thị A',
    method: 'IVF',
    date: '2025-05-27',
    status: 'Pending',
  },
  {
    key: '2',
    patient: 'Trần Văn B',
    method: 'IUI',
    date: '2025-05-26',
    status: 'Pending',
  },
];

const Registrations = () => {
  const [data, setData] = useState(initialData);
  const [modal, contextHolder] = Modal.useModal();
  const [filterStatus, setFilterStatus] = useState(null);

  const updateStatus = (key, status) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, status } : item
      )
    );
    message.success(`Đã cập nhật hồ sơ: ${status === 'Approved' ? 'Duyệt' : 'Từ chối'}`);
  };

  const confirmAction = (key, action) => {
    modal.confirm({
      title: `${action === 'Approved' ? 'Duyệt hồ sơ' : 'Từ chối hồ sơ'}?`,
      content: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      okText: 'Xác nhận',
      cancelText: 'Huỷ',
      onOk: () => updateStatus(key, action),
    });
  };

  const filteredData = filterStatus
    ? data.filter((item) => item.status === filterStatus)
    : data;

  const columns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: 'Phương pháp',
      dataIndex: 'method',
      key: 'method',
      render: (text) => (
        <Tag color={text === 'IVF' ? 'volcano' : 'geekblue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';
        return <Tag color={color}>{status === 'Pending' ? 'Chờ duyệt' : status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) =>
        record.status === 'Pending' ? (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => confirmAction(record.key, 'Approved')}
            >
              Duyệt
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => confirmAction(record.key, 'Rejected')}
            >
              Từ chối
            </Button>
          </Space>
        ) : (
          <Tag color={record.status === 'Approved' ? 'green' : 'red'}>
            Đã xử lý
          </Tag>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Duyệt đơn đăng ký điều trị
      </h2>
      {contextHolder}

      {/* Bộ lọc trạng thái */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          onChange={(value) => setFilterStatus(value)}
        >
          <Option value="Pending">Chờ duyệt</Option>
          <Option value="Approved">Đã duyệt</Option>
          <Option value="Rejected">Đã từ chối</Option>
        </Select>

        <p style={{ margin: 0 }}>
          Tổng đơn đăng ký: <strong>{filteredData.length}</strong>
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'Không có đơn đăng ký nào.' }}
      />
    </div>
  );
};

export default Registrations;
