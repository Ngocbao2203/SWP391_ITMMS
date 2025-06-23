import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Button, Input, Space, Select, DatePicker, message, Spin } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { authService } from '../../services';

const { Option } = Select;

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    gender: 'Nam',
    birthDate: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        message.error('Vui lòng đăng nhập để xem profile');
        return;
      }

      setUser(currentUser);
      
      // Try to load profile from API, fallback to current user data
      try {
        const response = await authService.getUserProfile(currentUser.id);
        
        if (response) {
          setFormData({
            fullName: response.fullName || currentUser.fullName || '',
            email: response.email || currentUser.email || '',
            phone: response.phone || currentUser.phone || '',
            address: response.address || '',
            gender: response.gender || 'Nam',
            birthDate: response.birthDate ? moment(response.birthDate) : null
          });
        } else {
          // Fallback to current user data
          setFormData({
            fullName: currentUser.fullName || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            address: '',
            gender: 'Nam',
            birthDate: null
          });
        }
      } catch (apiError) {
        // API profile endpoint not available, using current user data
        
        // Fallback to current user data if API fails
        setFormData({
          fullName: currentUser.fullName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: '',
          gender: 'Nam',
          birthDate: null
        });
      }
    } catch (error) {
      message.error('Không thể tải thông tin profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleGenderChange = value => {
    setFormData({ ...formData, gender: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, birthDate: date });
  };

  const handleSave = async () => {
    if (!user) {
      message.error('Không tìm thấy thông tin user');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birthDate: formData.birthDate ? formData.birthDate.format('YYYY-MM-DD') : null
      };

      const result = await authService.updateProfile(user.id, updateData);
      
      if (result && result.success) {
        message.success('Cập nhật profile thành công!');
        // Reload profile to show updated data
        await loadUserProfile();
      } else {
        message.error(result?.message || 'Không thể cập nhật profile');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải thông tin profile...</p>
      </div>
    );
  }

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
            <Col span={24}>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange(e, 'fullName')}
                placeholder="Họ và tên đầy đủ"
                style={{ marginBottom: '16px' }}
              />
            </Col>
          </Row>

          {/* Ngày sinh */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <DatePicker
                value={formData.birthDate}
                onChange={handleDateChange}
                style={{ width: '100%', marginBottom: '16px' }}
                placeholder="Ngày sinh"
                format="DD/MM/YYYY"
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
                prefix={<MailOutlined />}
                placeholder="Email"
                style={{ marginBottom: '16px' }}
                disabled
                title="Email không thể thay đổi"
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
              loading={saving}
              icon={<EditOutlined />}
              size="large"
            >
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default PatientProfile;