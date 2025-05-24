import React, { useState } from 'react';
import { Table, Select, Tag, Input } from 'antd';

const { Option } = Select;

// Danh sách bác sĩ (giả lập)
const doctors = [
  { id: 'd1', name: 'Dr. Nguyễn Văn A' },
  { id: 'd2', name: 'Dr. Trần Thị B' },
  { id: 'd3', name: 'Dr. Lê Quốc C' },
];

// Dữ liệu lịch khám (giả lập)
const allSchedules = [
  {
    key: '1',
    doctorId: 'd1',
    doctorName: 'Dr. Nguyễn Văn A',
    time: 'Thứ 2, 8:00 - 10:00',
    patient: 'Nguyễn Thị Lan',
    type: 'IUI',
  },
  {
    key: '2',
    doctorId: 'd2',
    doctorName: 'Dr. Trần Thị B',
    time: 'Thứ 3, 13:30 - 15:30',
    patient: 'Trần Thị Mai',
    type: 'IVF',
  },
  {
    key: '3',
    doctorId: 'd1',
    doctorName: 'Dr. Nguyễn Văn A',
    time: 'Thứ 5, 9:00 - 11:00',
    patient: 'Phạm Văn Huy',
    type: 'IUI',
  },
];

const Schedules = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchText, setSearchText] = useState('');

  const filteredData = allSchedules.filter((s) => {
    const matchDoctor = selectedDoctor ? s.doctorId === selectedDoctor : true;
    const matchPatient = s.patient.toLowerCase().includes(searchText.toLowerCase());
    return matchDoctor && matchPatient;
  });

  const columns = [
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: 'Phương pháp',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'IVF' ? 'volcano' : 'geekblue'}>
          {type}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Lịch khám</h2>

      {/* Bộ lọc và tìm kiếm */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <Select
          placeholder="Chọn bác sĩ để lọc"
          style={{ width: 240 }}
          allowClear
          onChange={(value) => setSelectedDoctor(value)}
        >
          {doctors.map((doc) => (
            <Option key={doc.id} value={doc.id}>
              {doc.name}
            </Option>
          ))}
        </Select>

        <Input.Search
          placeholder="Tìm theo tên bệnh nhân"
          allowClear
          style={{ width: 240 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Hiển thị số lịch khám */}
      <p style={{ marginBottom: 8 }}>
        Tổng số lịch khám: <strong>{filteredData.length}</strong>
      </p>

      {/* Bảng */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'Không có lịch khám nào.' }}
      />
    </div>
  );
};

export default Schedules;
