import React from 'react';
import { List, Typography, Button, Tag, Row, Col, Card, Space } from 'antd';
import { CheckCircleOutlined, HourglassOutlined, CloseCircleOutlined } from '@ant-design/icons'; // Thêm icon cho trạng thái

const { Title, Text } = Typography;

const appointments = [
  { date: '2022-12-01', doctor: 'Dr. Nguyễn Văn B', status: 'Hoàn tất', time: '10:00 AM', location: 'Phòng khám A' },
  { date: '2023-01-15', doctor: 'Dr. Trần Thị C', status: 'Chờ xác nhận', time: '03:00 PM', location: 'Phòng khám B' },
];

const AppointmentHistory = () => {
  return (
    <div>
      <Title level={2}>Lịch Sử Cuộc Hẹn</Title>

      <Row gutter={16}>
        {appointments.map((appointment, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              style={{ borderRadius: '10px', marginBottom: '16px' }}
              title={`Ngày: ${appointment.date}`}
            >
              <Text strong>Bác sĩ: </Text>
              <Text>{appointment.doctor}</Text><br />
              <Text strong>Giờ: </Text>
              <Text>{appointment.time}</Text><br />
              <Text strong>Địa điểm: </Text>
              <Text>{appointment.location}</Text><br />
              <Text strong>Trạng thái: </Text>
              {appointment.status === 'Hoàn tất' && (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  {appointment.status}
                </Tag>
              )}
              {appointment.status === 'Chờ xác nhận' && (
                <Tag color="orange" icon={<HourglassOutlined />}>
                  {appointment.status}
                </Tag>
              )}
              {appointment.status === 'Hủy' && (
                <Tag color="red" icon={<CloseCircleOutlined />}>
                  {appointment.status}
                </Tag>
              )}
              <br />
              {/* Sử dụng Space để căn chỉnh nút */}
              <Space style={{ marginTop: '10px' }}>
                <Button type="link">
                  Xem chi tiết
                </Button>
                <Button type="link">
                  Hủy cuộc hẹn
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AppointmentHistory;
