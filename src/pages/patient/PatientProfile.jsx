import React, { useState } from 'react';
import { Card, Row, Col, Avatar, Button, Input, Space, Select, DatePicker } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    firstName: 'Nguyễn Văn A',
    lastName: 'A',
    email: 'example@gmail.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận XYZ',
    healthStatus: 'Có sức khỏe tốt',
    gender: 'Nam',
    birthDate: '01/01/1985'
  });

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleGenderChange = value => {
    setFormData({ ...formData, gender: value });
  };

  const handleSave = () => {
    console.log('Thông tin đã được lưu:', formData);
  };

  return (
    <Card
      title="Thông Tin Hồ Sơ Bệnh Nhân"
      style={{
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '24px',
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Avatar */}
        <Col xs={24} sm={6} md={4} className="avatar-col">
          <Avatar size={128} icon={<UserOutlined />} style={{ marginBottom: '16px' }} />
          <Space direction="vertical" size="small" style={{ display: 'block' }}>
            <Button type="link">Change picture</Button>
            <Button type="link">Delete picture</Button>
          </Space>
        </Col>

        {/* Thông tin bệnh nhân */}
        <Col xs={24} sm={18} md={20}>
          <Row gutter={[16, 16]}>
            {/* Họ tên */}
            <Col xs={24} sm={12}>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, 'firstName')}
                placeholder="Họ"
                style={{ marginBottom: '16px' }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, 'lastName')}
                placeholder="Tên"
                style={{ marginBottom: '16px' }}
              />
            </Col>
          </Row>

          {/* Ngày sinh */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <DatePicker
                value={formData.birthDate ? moment(formData.birthDate, 'DD/MM/YYYY') : null}
                onChange={(date, dateString) => setFormData({ ...formData, birthDate: dateString })}
                style={{ width: '100%', marginBottom: '16px' }}
                placeholder="Ngày sinh"
              />
            </Col>
          </Row>

          {/* Giới tính */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Select
                value={formData.gender}
                onChange={handleGenderChange}
                style={{ width: '100%', marginBottom: '16px' }}
              >
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </Col>
          </Row>

          {/* Email */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange(e, 'email')}
                prefix={<MailOutlined />}
                placeholder="Email"
                style={{ marginBottom: '16px' }}
              />
            </Col>
          </Row>

          {/* Số điện thoại */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
                prefix={<PhoneOutlined />}
                placeholder="Số điện thoại"
                style={{ marginBottom: '16px' }}
              />
            </Col>
          </Row>

          {/* Địa chỉ */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Địa chỉ"
                style={{ marginBottom: '16px' }}
              />
            </Col>
          </Row>

          {/* Nút Lưu */}
          <Row justify="center" style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              onClick={handleSave}
              icon={<EditOutlined />}
            >
              Lưu Thay Đổi
            </Button>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default PatientProfile;