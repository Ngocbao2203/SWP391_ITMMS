import React from 'react';
import { List, Typography, Button, Card, Tag, Row, Col } from 'antd';
import { CheckCircleOutlined, HourglassOutlined, CloseCircleOutlined } from '@ant-design/icons'; // Thêm icon cho trạng thái
import "../../styles/TreatmentHistory.css"; // Giả sử bạn có một file CSS để tùy chỉnh giao diện
const { Title, Text } = Typography;

const treatments = [
  { serviceName: 'IVF', date: '2022-12-01', result: 'Thành công' },
  { serviceName: 'ICSI', date: '2023-01-15', result: 'Đang điều trị' },
  { serviceName: 'IUI', date: '2023-04-05', result: 'Thất bại' },
];

const TreatmentHistory = () => {
  return (
    <div>
      <Title level={2}>Lịch Sử Điều Trị</Title>

      <Row gutter={16}>
        {treatments.map((treatment, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              style={{ borderRadius: '10px', marginBottom: '16px' }}
              title={treatment.serviceName}
            >
              <Text strong>Ngày: </Text>
              <Text>{treatment.date}</Text>
              <br />
              <Text strong>Kết quả: </Text>
              <Text>
                {treatment.result === 'Thành công' && (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    {treatment.result}
                  </Tag>
                )}
                {treatment.result === 'Đang điều trị' && (
                  <Tag color="orange" icon={<HourglassOutlined />}>
                    {treatment.result}
                  </Tag>
                )}
                {treatment.result === 'Thất bại' && (
                  <Tag color="red" icon={<CloseCircleOutlined />}>
                    {treatment.result}
                  </Tag>
                )}
              </Text>
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

export default TreatmentHistory;
