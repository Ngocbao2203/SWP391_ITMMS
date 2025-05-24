import React, { useState } from 'react';
import {
  Card,
  Timeline,
  Select,
  Progress as AntdProgress,
  Empty,
} from 'antd';
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  MinusCircleTwoTone,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const patients = [
  { id: 'p1', name: 'Nguyễn Thị A' },
  { id: 'p2', name: 'Trần Văn B' },
];

const progressData = {
  p1: [
    { step: 'Tiêm kích thích buồng trứng', time: '2025-05-20', status: 'done', note: 'Liều thấp, không phản ứng phụ' },
    { step: 'Siêu âm theo dõi', time: '2025-05-22', status: 'done' },
    { step: 'Chọc hút trứng', time: '2025-05-24', status: 'done', note: '12 trứng thu được' },
    { step: 'Chuyển phôi', time: '2025-05-26', status: 'doing' },
    { step: 'Xét nghiệm βhCG', time: '2025-06-05', status: 'pending' },
  ],
  p2: [
    { step: 'Khám lâm sàng', time: '2025-05-21', status: 'done' },
    { step: 'Siêu âm đầu dò', time: '2025-05-23', status: 'doing' },
    { step: 'Lên phác đồ điều trị', time: '', status: 'pending' },
  ],
};

const statusColor = {
  done: 'green',
  doing: 'blue',
  pending: 'gray',
};

const statusIcon = {
  done: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginLeft: 8 }} />,
  doing: <ClockCircleTwoTone twoToneColor="#1890ff" style={{ marginLeft: 8 }} />,
  pending: <MinusCircleTwoTone twoToneColor="#999" style={{ marginLeft: 8 }} />,
};

const Progress = () => {
  const [selectedPatient, setSelectedPatient] = useState('p1');
  const patient = patients.find((p) => p.id === selectedPatient);
  const currentSteps = (progressData[selectedPatient] || [])
    .slice()
    .sort((a, b) => new Date(a.time || '2100-01-01') - new Date(b.time || '2100-01-01'));

  const doneCount = currentSteps.filter((s) => s.status === 'done').length;
  const percent = currentSteps.length > 0 ? Math.round((doneCount / currentSteps.length) * 100) : 0;

  const globalStatus =
    currentSteps.every((s) => s.status === 'done')
      ? 'Hoàn thành'
      : currentSteps.some((s) => s.status === 'doing')
      ? 'Đang điều trị'
      : 'Chưa bắt đầu';

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Tiến độ điều trị</h2>

      <Select
        placeholder="Chọn bệnh nhân"
        value={selectedPatient}
        style={{ width: 280, marginBottom: 16 }}
        onChange={(val) => setSelectedPatient(val)}
      >
        {patients.map((p) => (
          <Option key={p.id} value={p.id}>
            {p.name}
          </Option>
        ))}
      </Select>

      <AntdProgress
        percent={percent}
        status={globalStatus === 'Hoàn thành' ? 'success' : 'active'}
        format={(p) => `${globalStatus} – ${p}%`}
        style={{ marginBottom: 24 }}
      />

      <Card
        title={`Tiến độ của ${patient?.name}`}
        style={{ maxHeight: 420, overflowY: 'auto' }}
      >
        {currentSteps.length === 0 ? (
          <Empty description="Chưa có tiến trình điều trị" />
        ) : (
          <Timeline mode="alternate">
            {currentSteps.map((step, index) => (
              <Timeline.Item color={statusColor[step.status]} key={index}>
                <strong>{step.step}</strong>
                {step.time && (
                  <div style={{ color: '#6b7280' }}>
                    {dayjs(step.time).format('DD/MM/YYYY')}
                  </div>
                )}
                <div style={{ marginTop: 4 }}>
                  {step.status === 'doing' && <>Đang thực hiện {statusIcon.doing}</>}
                  {step.status === 'pending' && <>Chưa thực hiện {statusIcon.pending}</>}
                  {step.status === 'done' && <>Hoàn thành {statusIcon.done}</>}
                </div>
                {step.note && (
                  <div style={{ fontStyle: 'italic', color: '#999', marginTop: 4 }}>
                    Ghi chú: {step.note}
                  </div>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default Progress;
