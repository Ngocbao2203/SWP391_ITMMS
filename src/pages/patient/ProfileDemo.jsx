import React from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const { Title, Paragraph } = Typography;

const ProfileDemo = () => {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate('/user-profile');
  };

  return (
    <MainLayout>
      <div style={{ 
        padding: '48px 24px', 
        maxWidth: 800, 
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <Card style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <UserOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
          
          <Title level={2}>Hồ Sơ Bệnh Nhân</Title>
          
          <Paragraph style={{ fontSize: 16, color: '#595959', marginBottom: 32 }}>
            Chào mừng đến với hệ thống quản lý hồ sơ bệnh nhân của chúng tôi. 
            Tại đây bạn có thể quản lý thông tin cá nhân, theo dõi lịch điều trị, 
            và xem các cập nhật từ bác sĩ.
          </Paragraph>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>Tính năng chính:</Title>
              <ul style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
                <li>✅ Chỉnh sửa thông tin cá nhân</li>
                <li>✅ Theo dõi hồ sơ bệnh được cập nhật bởi bác sĩ</li>
                <li>✅ Xem lịch điều trị và lịch hẹn</li>
                <li>✅ Quản lý tài liệu y tế</li>
                <li>✅ Theo dõi tiến độ điều trị</li>
              </ul>
            </div>

            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />}
              onClick={handleGoToProfile}
              style={{ 
                height: 48, 
                minWidth: 200,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500
              }}
            >
              Xem Hồ Sơ Của Tôi
            </Button>
          </Space>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfileDemo; 