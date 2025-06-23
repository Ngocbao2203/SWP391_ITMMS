import React, { useState, useEffect } from 'react';
import { List, Typography, Button, Card, Tag, Row, Col, Spin, message, Empty } from 'antd';
import { CheckCircleOutlined, HourglassOutlined, CloseCircleOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { authService, formatErrorMessage } from '../../services';
import "../../styles/TreatmentHistory.css";
const { Title, Text } = Typography;

const TreatmentHistory = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatmentHistory = async () => {
      try {
        setLoading(true);
        const user = authService.getCurrentUser();
        
        if (!user) {
          message.error('Vui lòng đăng nhập để xem lịch sử điều trị');
          return;
        }

        const historyData = await authService.getUserHistory(user.id);
        
        if (historyData && Array.isArray(historyData)) {
          setTreatments(historyData);
        } else {
          setTreatments([]);
        }
      } catch (error) {
        message.error('Không thể tải lịch sử điều trị: ' + formatErrorMessage(error));
        setTreatments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentHistory();
  }, []);

  const getStatusTag = (treatment) => {
    // Determine status based on data
    if (treatment.status === 'Completed') {
      return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
    } else if (treatment.status === 'Active') {
      return <Tag color="orange" icon={<HourglassOutlined />}>Đang điều trị</Tag>;
    } else {
      return <Tag color="red" icon={<CloseCircleOutlined />}>Tạm dừng</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải lịch sử điều trị...</p>
      </div>
    );
  }
  if (treatments.length === 0) {
    return (
      <div>
        <Title level={2}>Lịch Sử Điều Trị</Title>
        <Empty 
          description="Chưa có lịch sử điều trị nào"
          style={{ marginTop: '50px' }}
        />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Lịch Sử Điều Trị</Title>

      <Row gutter={16}>
        {treatments.map((treatment, index) => (
          <Col span={8} key={treatment.id || index}>
            <Card
              hoverable
              style={{ borderRadius: '10px', marginBottom: '16px' }}
              title={
                <div>
                  {treatment.services?.[0]?.serviceName || treatment.treatmentType || 'Điều trị'}
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {treatment.services?.[0]?.serviceCode || ''}
                  </Text>
                </div>
              }
            >
              <Text strong>Bác sĩ: </Text>
              <Text>
                <UserOutlined style={{ marginRight: '4px' }} />
                {treatment.doctor?.name || 'Chưa xác định'}
              </Text>
              <br />
              
              <Text strong>Chuyên khoa: </Text>
              <Text>{treatment.doctor?.specialization || 'Chưa xác định'}</Text>
              <br />
              
              <Text strong>Chi phí: </Text>
              <Text>
                <DollarOutlined style={{ marginRight: '4px' }} />
                {treatment.totalCost ? `${treatment.totalCost.toLocaleString()} VNĐ` : 'Chưa xác định'}
              </Text>
              <br />
              
              <Text strong>Trạng thái: </Text>
              {getStatusTag(treatment)}
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
