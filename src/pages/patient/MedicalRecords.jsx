import React from 'react';
import { Card, Typography, Row, Col, Button, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'; // Thêm icon cho trạng thái
import '../../styles/MedicalRecords.css'; // Giả sử bạn có một file CSS để tùy chỉnh giao diện

const { Title, Text } = Typography;

const medicalRecords = [
  { testName: 'Siêu âm', date: '2022-12-01', result: 'Bình thường' },
  { testName: 'X-quang', date: '2023-01-15', result: 'Không bình thường' },
];

const MedicalRecords = () => {
  return (
    <div>
      <Title level={2}>Hồ Sơ Y Tế</Title>
      <Row gutter={16}>
        {medicalRecords.map((record, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              style={{ borderRadius: '10px', marginBottom: '16px' }}
              title={`Xét nghiệm: ${record.testName}`}
            >
              <Text strong>Ngày: </Text>
              <Text>{record.date}</Text><br />
              <Text strong>Kết quả: </Text>
              {record.result === 'Bình thường' && (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  {record.result}
                </Tag>
              )}
              {record.result === 'Không bình thường' && (
                <Tag color="red" icon={<CloseCircleOutlined />}>
                  {record.result}
                </Tag>
              )}
              <br />
              <Button type="link" style={{ marginTop: '8px' }}>
                Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MedicalRecords;
