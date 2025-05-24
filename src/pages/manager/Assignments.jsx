import React, { useState } from 'react';
import { Table, Select, Button, Tag, message, Input, Popconfirm } from 'antd';

const { Option } = Select;

const initialData = [
  {
    key: '1',
    patientName: 'Nguyễn Thị A',
    treatmentType: 'IVF',
    status: 'Chờ phân công',
    assignedDoctor: null,
  },
  {
    key: '2',
    patientName: 'Trần Văn B',
    treatmentType: 'IUI',
    status: 'Chờ phân công',
    assignedDoctor: null,
  },
];

const doctors = [
  { id: 'd1', name: 'Dr. Nguyễn Văn A' },
  { id: 'd2', name: 'Dr. Trần Thị B' },
  { id: 'd3', name: 'Dr. Lê Quốc C' },
];

const Assignments = () => {
  const [assignments, setAssignments] = useState(initialData);
  const [selectedDoctors, setSelectedDoctors] = useState({});
  const [searchText, setSearchText] = useState('');

  const handleSelectDoctor = (recordKey, doctorId) => {
    setSelectedDoctors((prev) => ({ ...prev, [recordKey]: doctorId }));
  };

  const handleAssign = (recordKey) => {
    const doctorId = selectedDoctors[recordKey];
    if (!doctorId) {
      message.warning('Vui lòng chọn bác sĩ.');
      return;
    }

    const doctorName = doctors.find((d) => d.id === doctorId)?.name;

    setAssignments((prev) =>
      prev.map((item) =>
        item.key === recordKey
          ? {
              ...item,
              status: 'Đã phân công',
              assignedDoctor: doctorName,
            }
          : item
      )
    );

    message.success(`Đã phân công ${doctorName} cho hồ sơ bệnh nhân.`);
  };

  const filteredData = assignments.filter((item) =>
    item.patientName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Phương pháp điều trị',
      dataIndex: 'treatmentType',
      key: 'treatmentType',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'Đã phân công' ? 'green' : 'blue'}>{text}</Tag>
      ),
    },
    {
      title: 'Bác sĩ phụ trách',
      key: 'assignedDoctor',
      render: (_, record) => record.assignedDoctor || '-',
    },
    {
      title: 'Chọn bác sĩ',
      key: 'selectDoctor',
      render: (_, record) => (
        <Select
          placeholder="Chọn bác sĩ"
          style={{ width: 200 }}
          onChange={(value) => handleSelectDoctor(record.key, value)}
          value={selectedDoctors[record.key] || record.assignedDoctor}
          disabled={record.status === 'Đã phân công'}
        >
          {doctors.map((doc) => (
            <Option key={doc.id} value={doc.id}>
              {doc.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận phân công bác sĩ?"
          onConfirm={() => handleAssign(record.key)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            disabled={record.status === 'Đã phân công'}
          >
            Phân công
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Phân công bác sĩ
      </h2>

      <Input.Search
        placeholder="Tìm kiếm tên bệnh nhân"
        allowClear
        style={{ width: 300, marginBottom: 16 }}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Table columns={columns} dataSource={filteredData} pagination={false} />
    </div>
  );
};

export default Assignments;
