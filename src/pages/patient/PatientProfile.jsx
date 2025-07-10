import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Avatar, Button, Space, 
  Typography, Tabs, Descriptions, Tag, Divider, Statistic,
  Menu, Dropdown, List, Timeline, Empty, Input, Form,
  DatePicker, Select, message, Upload
} from 'antd';
import { 
  UserOutlined, EditOutlined, 
  CalendarOutlined, FileTextOutlined, MedicineBoxOutlined,
  SafetyOutlined, CheckCircleOutlined,
  HourglassOutlined, SettingOutlined,
  InfoCircleOutlined, ClockCircleOutlined,
  LogoutOutlined, UploadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import authService from '../../services/authService';
import treatmentService from '../../services/treatmentService';
import appointmentService from '../../services/appointmentService';
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
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Lấy userId từ localStorage chỉ để xác định id
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.id) {
      setLoading(true);
      authService.getUserProfile(storedUser.id)
        .then(profile => {
          // Đảm bảo các trường mảng luôn là mảng rỗng nếu không có
          setUserData({
            ...profile,
            treatments: profile.treatments || [],
            appointments: profile.appointments || [],
            medicalTests: profile.medicalTests || [],
            allergies: profile.allergies || [],
          });
          setEditableData({
            ...profile,
            treatments: profile.treatments || [],
            appointments: profile.appointments || [],
            medicalTests: profile.medicalTests || [],
            allergies: profile.allergies || [],
          });
        })
        .catch(() => message.error('Không thể tải thông tin hồ sơ!'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Khi userData đã có id, lấy treatment plans
  useEffect(() => {
    if (userData && userData.id) {
      treatmentService.getCustomerTreatmentPlans(userData.id)
        .then(data => setTreatments(Array.isArray(data) ? data : []))
        .catch(() => setTreatments([]));
      appointmentService.getCustomerAppointments(userData.id)
        .then(data => setAppointments(Array.isArray(data) ? data : []))
        .catch(() => setAppointments([]));
    }
  }, [userData]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditableData({ ...userData });
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    const storedUser = authService.getCurrentUser();
    if (!storedUser || !storedUser.id) return;
    setLoading(true);
    try {
      const res = await authService.updateProfile(storedUser.id, {
        fullName: editableData.fullName,
        phone: editableData.phone,
        address: editableData.address,
      });
      if (res.success) {
        setUserData({ ...userData, ...editableData });
        setEditMode(false);
        message.success('Cập nhật hồ sơ thành công!');
      } else {
        message.error(res.message || 'Cập nhật thất bại!');
      }
    } catch (err) {
      message.error('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setEditableData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Hàm xử lý chọn ảnh đại diện
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done' || info.file.status === 'uploading' || info.file.originFileObj) {
      const reader = new FileReader();
      reader.onload = e => setAvatarUrl(e.target.result);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!userData) return <div>Không có dữ liệu hồ sơ.</div>;

  // Tính toán ngày sinh và tuổi hiển thị
  const displayBirthDate = userData.birthDate && moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid()
    ? moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('DD/MM/YYYY')
    : 'Chưa cập nhật';

  const displayAge = userData.birthDate && moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid()
    ? `${moment().diff(moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']), 'years')} tuổi`
    : 'Chưa cập nhật';

  // Khi render, luôn dùng (userData.treatments || []).map/filter, v.v.
  return (
    <div className="patient-profile-container">
      {/* Phần đầu trang với thông tin cơ bản và avatar */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
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
                <div className="avatar-upload-wrapper">
                  <Avatar 
                    size={90} 
                    icon={<UserOutlined />} 
                    className="patient-avatar"
                    src={avatarUrl || userData.avatar || null}
                  />
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAvatarChange}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />} size="small" style={{ marginTop: 8 }}>Chọn ảnh</Button>
                  </Upload>
                </div>
              </div>
            </Dropdown>
            <div className="patient-basic-info">
              <div className="patient-name-id">
                <Title level={3} className="patient-name">{userData.fullName}</Title>
                <Tag color="blue" className="patient-id">ID: {userData.id}</Tag>
              </div>
              <div className="patient-metadata">
                {userData.birthDate && moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid() && (
                  <Tag icon={<CalendarOutlined />}>{`${moment().diff(moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']), 'years')} tuổi`}</Tag>
                )}
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
        {/* Tabs điều hướng chính giữ nguyên */}
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
                      <Input value={editableData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} />
                    ) : userData.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên đăng nhập">
                    {editMode ? (
                      <Input value={editableData.username} onChange={e => handleInputChange('username', e.target.value)} disabled />
                    ) : userData.username}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {editMode ? (
                      <Input value={editableData.email} onChange={e => handleInputChange('email', e.target.value)} />
                    ) : userData.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {editMode ? (
                      <Input value={editableData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                    ) : userData.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ liên hệ">
                    {editMode ? (
                      <Input value={editableData.address} onChange={e => handleInputChange('address', e.target.value)} />
                    ) : userData.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {editMode ? (
                      <DatePicker
                        value={editableData.birthDate ? moment(editableData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']) : null}
                        onChange={date => handleInputChange('birthDate', date ? date.format('YYYY-MM-DD') : null)}
                        format="DD/MM/YYYY"
                      />
                    ) : displayBirthDate}
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
              {treatments.length === 0 ? (
                <div>Chưa có quá trình điều trị nào.</div>
              ) : (
                <List
                  dataSource={treatments}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.planName || item.name || 'Kế hoạch điều trị'}
                        description={
                          <>
                            <div>Bắt đầu: {item.startDate ? moment(item.startDate).format('DD/MM/YYYY') : '---'}</div>
                            <div>Trạng thái: {item.status || '---'}</div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </div>
        )}
        
        {activeTab === 'appointments' && (
          <div className="appointments-content">
            <Card className="appointments-list-card" title="Lịch hẹn">
              {appointments.length === 0 ? (
                <div>Chưa có lịch hẹn nào.</div>
              ) : (
                <List
                  dataSource={appointments}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title || 'Lịch hẹn'}
                        description={
                          <>
                            <div>Thời gian: {item.date ? moment(item.date).format('DD/MM/YYYY') : '---'} {item.time || ''}</div>
                            <div>Bác sĩ: {item.doctorName || '---'}</div>
                            <div>Trạng thái: {item.status || '---'}</div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </div>
        )}
        
        {activeTab === 'tests' && (
          <div className="tests-content">
            <Card className="tests-list-card" title="Kết quả xét nghiệm">
              <List
                className="tests-list"
                itemLayout="horizontal"
                dataSource={userData.medicalTests}
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