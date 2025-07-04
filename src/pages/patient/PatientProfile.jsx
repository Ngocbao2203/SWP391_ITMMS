import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Avatar, Button, Space, 
  Typography, Tabs, Descriptions, Tag, Divider, Statistic,
  Menu, Dropdown, List, Timeline, Empty, Input, Form,
  DatePicker, Select, message
} from 'antd';
import { 
  UserOutlined, EditOutlined, 
  CalendarOutlined, FileTextOutlined, MedicineBoxOutlined,
  SafetyOutlined, CheckCircleOutlined,
  HourglassOutlined, SettingOutlined,
  InfoCircleOutlined, ClockCircleOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import moment from 'moment';
import authService from '../../services/authService';
import '../../styles/PatientProfile.css';
import 'moment/locale/vi';

moment.locale('vi');

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data - sẽ được thay thế bằng API calls thực tế
const patientData = {
  id: 'BN123456',
  firstName: 'Nguyễn',
  lastName: 'Thị B',
  fullName: 'Nguyễn Thị B',
  email: 'patient@example.com',
  phone: '0987654321',
  address: '234 Đường XYZ, Quận ABC, Thành phố HCM',
  gender: 'Nữ',
  birthDate: '1990-05-15',
  age: 35,
  healthInsurance: 'BH123456789',
  bloodType: 'O+',
  weight: '52kg',
  height: '160cm',
  allergies: ['Penicillin'],
  lastUpdated: '2025-06-20',
  status: 'Đang điều trị',
  treatments: [
    {
      id: 'DT001',
      name: 'Thụ tinh trong ống nghiệm (IVF)',
      startDate: '2025-05-01',
      endDate: null,
      status: 'in-progress',
      doctor: 'BS. Nguyễn Văn A',
      progress: 60,
      nextAppointment: '2025-06-28',
      notes: 'Đang trong quá trình theo dõi sau chuyển phôi'
    },
    {
      id: 'DT002',
      name: 'Theo dõi nội tiết',
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      status: 'completed',
      doctor: 'BS. Trần Thị C',
      progress: 100,
      nextAppointment: null,
      notes: 'Hoàn thành điều trị, chuyển sang IVF'
    }
  ],
  appointments: [
    {
      id: 'LH001',
      date: '2025-06-28',
      time: '09:30',
      doctor: 'BS. Nguyễn Văn A',
      department: 'Khoa Hiếm muộn',
      purpose: 'Kiểm tra sau chuyển phôi',
      status: 'scheduled'
    },
    {
      id: 'LH002',
      date: '2025-06-10',
      time: '14:00',
      doctor: 'BS. Trần Thị C',
      department: 'Khoa Nội tiết',
      purpose: 'Tái khám định kỳ',
      status: 'completed'
    }
  ],
  medicalTests: [
    {
      id: 'XN001',
      name: 'Xét nghiệm nội tiết',
      date: '2025-06-10',
      result: 'Bình thường',
      doctor: 'BS. Trần Thị C'
    },
    {
      id: 'XN002',
      name: 'Siêu âm buồng trứng',
      date: '2025-06-05',
      result: 'Bình thường',
      doctor: 'BS. Nguyễn Văn A'
    }
  ]
};

const PatientProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(patientData);
  const [editableData, setEditableData] = useState({...patientData});
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      // Merge stored user data with patient data
      setUserData(prevData => ({
        ...prevData,
        fullName: storedUser.name || prevData.fullName,
        firstName: storedUser.firstName || prevData.firstName,
        lastName: storedUser.lastName || prevData.lastName,
        email: storedUser.email || prevData.email,
      }));
      setEditableData(prevData => ({
        ...prevData,
        fullName: storedUser.name || prevData.fullName,
        firstName: storedUser.firstName || prevData.firstName,
        lastName: storedUser.lastName || prevData.lastName,
        email: storedUser.email || prevData.email,
      }));
    }
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Discard changes if canceling
      setEditableData({...userData});
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = () => {
    // Save the changes
    const updatedUserData = {...editableData};
    setUserData(updatedUserData);
    
    // Update localStorage to persist changes
    const user = authService.getCurrentUser() || {};
    const updatedUser = { 
      ...user, 
      name: updatedUserData.fullName,
      firstName: updatedUserData.firstName || updatedUserData.fullName.split(' ')[0],
      lastName: updatedUserData.lastName || updatedUserData.fullName.split(' ').slice(1).join(' '),
      email: updatedUserData.email || user.email
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Dispatch a custom event to notify other components of the update
    window.dispatchEvent(new CustomEvent('userDataUpdated'));
    
    setEditMode(false);
    message.success('Thông tin cá nhân đã được cập nhật');
  };

  const handleInputChange = (fieldName, value) => {
    setEditableData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div className="patient-profile-container">
      {/* Phần đầu trang với thông tin cơ bản và avatar */}
      <div className="profile-header">
        <div className="profile-header-content">          <div className="profile-avatar-section">
            <Dropdown menu={{ items: [
              {
                key: 'name',
                label: userData.fullName,
                disabled: true,
                style: { color: '#1890ff', fontWeight: 'bold' }
              },
              { type: 'divider' },
              {
                key: 'profile',
                label: 'Hồ sơ cá nhân',
                icon: <UserOutlined />
              },
              { type: 'divider' },
              {
                key: 'logout',
                label: 'Đăng xuất',
                icon: <LogoutOutlined />
              }
            ]}} placement="bottomRight" trigger={['click']}>
              <div className="avatar-dropdown-trigger">
                <Avatar 
                  size={90} 
                  icon={<UserOutlined />} 
                  className="patient-avatar"
                />
              </div>
            </Dropdown>
            <div className="patient-basic-info">
              <div className="patient-name-id">
                <Title level={3} className="patient-name">{userData.fullName}</Title>
                <Tag color="blue" className="patient-id">ID: {userData.id}</Tag>
              </div>
              <div className="patient-metadata">
                <Tag icon={<CalendarOutlined />}>{moment(userData.birthDate).format('DD/MM/YYYY')} ({userData.age} tuổi)</Tag>
                <Tag icon={<SafetyOutlined />}>{userData.bloodType}</Tag>
                {userData.status === 'Đang điều trị' && (
                  <Tag color="processing" icon={<HourglassOutlined />}>Đang điều trị</Tag>
                )}
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <Space>
              <Button 
                type={editMode ? "default" : "primary"}
                icon={editMode ? null : <EditOutlined />}
                onClick={handleEditToggle}
              >
                {editMode ? "Hủy" : "Chỉnh sửa"}
              </Button>
              {editMode && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSaveChanges}>
                  Lưu thay đổi
                </Button>
              )}
            </Space>
          </div>
        </div>

        {/* Tabs điều hướng chính */}
        <Tabs 
          activeKey={activeTab}
          onChange={handleTabChange}
          className="profile-navigation-tabs"
        >
          <TabPane tab={<span><InfoCircleOutlined /> Tổng quan</span>} key="overview" />
          <TabPane tab={<span><MedicineBoxOutlined /> Điều trị</span>} key="treatments" />
          <TabPane tab={<span><CalendarOutlined /> Lịch hẹn</span>} key="appointments" />
          <TabPane tab={<span><FileTextOutlined /> Kết quả xét nghiệm</span>} key="tests" />
        </Tabs>
      </div>
      
      {/* Phần nội dung chính */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <Row gutter={[24, 24]} className="overview-content">
            <Col xs={24} lg={16}>
              <Card title="Thông tin cá nhân" className="info-card">
                <Descriptions 
                  bordered 
                  column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                  labelStyle={{ fontWeight: '500' }}
                >
                  <Descriptions.Item label="Họ và tên">
                    {editMode ? (
                      <Input 
                        value={editableData.fullName} 
                        onChange={e => handleInputChange('fullName', e.target.value)}
                      />
                    ) : userData.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {editMode ? (
                      <DatePicker 
                        value={moment(editableData.birthDate)} 
                        onChange={date => handleInputChange('birthDate', date ? date.format('YYYY-MM-DD') : null)}
                        format="DD/MM/YYYY"
                      />
                    ) : moment(userData.birthDate).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {editMode ? (
                      <Select 
                        value={editableData.gender} 
                        onChange={value => handleInputChange('gender', value)}
                      >
                        <Select.Option value="Nam">Nam</Select.Option>
                        <Select.Option value="Nữ">Nữ</Select.Option>
                        <Select.Option value="Khác">Khác</Select.Option>
                      </Select>
                    ) : userData.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhóm máu">
                    {editMode ? (
                      <Select 
                        value={editableData.bloodType} 
                        onChange={value => handleInputChange('bloodType', value)}
                      >
                        <Select.Option value="A+">A+</Select.Option>
                        <Select.Option value="A-">A-</Select.Option>
                        <Select.Option value="B+">B+</Select.Option>
                        <Select.Option value="B-">B-</Select.Option>
                        <Select.Option value="AB+">AB+</Select.Option>
                        <Select.Option value="AB-">AB-</Select.Option>
                        <Select.Option value="O+">O+</Select.Option>
                        <Select.Option value="O-">O-</Select.Option>
                      </Select>
                    ) : userData.bloodType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {editMode ? (
                      <Input 
                        value={editableData.phone} 
                        onChange={e => handleInputChange('phone', e.target.value)}
                      />
                    ) : userData.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {editMode ? (
                      <Input 
                        value={editableData.email} 
                        onChange={e => handleInputChange('email', e.target.value)}
                      />
                    ) : userData.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ" span={2}>
                    {editMode ? (
                      <Input.TextArea 
                        value={editableData.address} 
                        onChange={e => handleInputChange('address', e.target.value)}
                        rows={2}
                      />
                    ) : userData.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bảo hiểm y tế">
                    {editMode ? (
                      <Input 
                        value={editableData.healthInsurance} 
                        onChange={e => handleInputChange('healthInsurance', e.target.value)}
                      />
                    ) : userData.healthInsurance}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dị ứng">
                    {editMode ? (
                      <Input 
                        value={editableData.allergies?.join(', ')} 
                        onChange={e => handleInputChange('allergies', e.target.value.split(',').map(a => a.trim()))}
                      />
                    ) : userData.allergies?.length > 0 ? userData.allergies.join(', ') : 'Không'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card title="Thông tin y tế" className="medical-stats-card">
                <div className="medical-statistics">
                  <Statistic 
                    title="Chiều cao" 
                    value={userData.height} 
                    prefix={<InfoCircleOutlined />} 
                  />
                  <Statistic 
                    title="Cân nặng" 
                    value={userData.weight}
                    prefix={<InfoCircleOutlined />} 
                  />
                </div>
                
                <Divider />
                
                <div className="upcoming-appointment">
                  <Title level={5}>Lịch hẹn sắp tới</Title>
                  {userData.appointments.filter(app => app.status === 'scheduled').length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={userData.appointments.filter(app => app.status === 'scheduled')}
                      renderItem={appointment => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar icon={<CalendarOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                            title={`${moment(appointment.date).format('DD/MM/YYYY')} - ${appointment.time}`}
                            description={`${appointment.purpose} với ${appointment.doctor}`}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="Không có lịch hẹn sắp tới" />
                  )}
                </div>
              </Card>
            </Col>
            
            <Col xs={24}>
              <Card title="Điều trị hiện tại" className="current-treatment-card">
                {userData.treatments.filter(t => t.status === 'in-progress').length > 0 ? (
                  userData.treatments
                    .filter(t => t.status === 'in-progress')
                    .map(treatment => (
                      <div key={treatment.id} className="treatment-progress">
                        <div className="treatment-header">
                          <div>
                            <Title level={5}>{treatment.name}</Title>
                            <Text type="secondary">Bắt đầu: {moment(treatment.startDate).format('DD/MM/YYYY')}</Text>
                          </div>
                          <Tag color="processing">Đang điều trị</Tag>
                        </div>
                        
                        <div className="treatment-details">
                          <div className="treatment-detail-item">
                            <Text strong>Bác sĩ:</Text> {treatment.doctor}
                          </div>
                          <div className="treatment-detail-item">
                            <Text strong>Ghi chú:</Text> {treatment.notes}
                          </div>
                          <div className="treatment-detail-item">
                            <Text strong>Lịch hẹn tiếp theo:</Text> {treatment.nextAppointment ? moment(treatment.nextAppointment).format('DD/MM/YYYY') : 'Chưa có'}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <Empty description="Không có điều trị đang diễn ra" />
                )}
              </Card>
            </Col>
          </Row>
        )}
        
        {activeTab === 'treatments' && (
          <div className="treatments-content">
            <Card className="treatments-list-card" title="Quá trình điều trị">
              <Timeline mode="left">
                {userData.treatments.map(treatment => (
                  <Timeline.Item 
                    key={treatment.id} 
                    color={treatment.status === 'in-progress' ? 'blue' : 'green'}
                    label={moment(treatment.startDate).format('DD/MM/YYYY')}
                  >
                    <Card className="treatment-timeline-card">
                      <Title level={5}>{treatment.name}</Title>
                      <div className="treatment-timeline-details">
                        <div className="treatment-timeline-item">
                          <Text strong>Trạng thái:</Text> 
                          {treatment.status === 'in-progress' ? (
                            <Tag color="processing" icon={<HourglassOutlined />}>Đang điều trị</Tag>
                          ) : (
                            <Tag color="success" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>
                          )}
                        </div>
                        <div className="treatment-timeline-item">
                          <Text strong>Bác sĩ:</Text> {treatment.doctor}
                        </div>
                        <div className="treatment-timeline-item">
                          <Text strong>Ghi chú:</Text> {treatment.notes}
                        </div>
                        {treatment.endDate && (
                          <div className="treatment-timeline-item">
                            <Text strong>Kết thúc:</Text> {moment(treatment.endDate).format('DD/MM/YYYY')}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        )}
        
        {activeTab === 'appointments' && (
          <div className="appointments-content">
            <Card className="appointments-list-card" title="Lịch hẹn">
              <List
                className="appointments-list"
                itemLayout="horizontal"
                dataSource={patientData.appointments}
                renderItem={appointment => (
                  <List.Item
                    actions={[
                      <Button type="link">Xem chi tiết</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<CalendarOutlined />} style={{ backgroundColor: appointment.status === 'scheduled' ? '#1890ff' : '#52c41a' }} />}
                      title={
                        <div className="appointment-title">
                          <span>{moment(appointment.date).format('DD/MM/YYYY')} - {appointment.time}</span>
                          {appointment.status === 'scheduled' ? (
                            <Tag color="processing">Sắp đến</Tag>
                          ) : (
                            <Tag color="success">Hoàn thành</Tag>
                          )}
                        </div>
                      }
                      description={
                        <div className="appointment-details">
                          <div><Text strong>Mục đích:</Text> {appointment.purpose}</div>
                          <div><Text strong>Bác sĩ:</Text> {appointment.doctor}</div>
                          <div><Text strong>Khoa:</Text> {appointment.department}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
        
        {activeTab === 'tests' && (
          <div className="tests-content">
            <Card className="tests-list-card" title="Kết quả xét nghiệm">
              <List
                className="tests-list"
                itemLayout="horizontal"
                dataSource={patientData.medicalTests}
                renderItem={test => (
                  <List.Item
                    actions={[
                      <Button type="link">Xem kết quả chi tiết</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title={
                        <div className="test-title">
                          <span>{test.name}</span>
                          {test.result === 'Bình thường' ? (
                            <Tag color="success">Bình thường</Tag>
                          ) : (
                            <Tag color="warning">Cần theo dõi</Tag>
                          )}
                        </div>
                      }
                      description={
                        <div className="test-details">
                          <div><ClockCircleOutlined /> Ngày thực hiện: {moment(test.date).format('DD/MM/YYYY')}</div>
                          <div><UserOutlined /> Bác sĩ: {test.doctor}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;