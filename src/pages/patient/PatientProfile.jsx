import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Avatar, Button, Space,
  Typography, Tabs, Descriptions, Tag, Divider, Statistic,
  Dropdown, List, Empty, Input,
  DatePicker, message, Upload
} from 'antd';
import {
  UserOutlined, EditOutlined,
  CalendarOutlined, FileTextOutlined, MedicineBoxOutlined,
  SafetyOutlined, CheckCircleOutlined,
  HourglassOutlined,
  InfoCircleOutlined, ClockCircleOutlined,
  LogoutOutlined, UploadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import authService from '../../services/authService';
import treatmentService from '../../services/treatmentService';
import guestService from '../../services/guestService';
import patientService from '../../services/patientService'; // Thêm import
import '../../styles/PatientProfile.css';
import 'moment/locale/vi';

moment.locale('vi');

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]); // Thêm state cho lịch sử y tế
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.id) {
      setLoading(true);
      authService.getUserProfile(storedUser.id)
        .then(profile => {
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

  useEffect(() => {
    if (userData && userData.id) {
      console.log("🧪 Fetching medical history for user ID:", userData.id);
      treatmentService.getCustomerTreatmentPlans(userData.id)
        .then(data => setTreatments(Array.isArray(data) ? data : []))
        .catch(() => setTreatments([]));
      guestService.getMyAppointments()
        .then(response => {
          console.log("Appointments loaded:", response.data.appointments);
          setAppointments(Array.isArray(response.data.appointments) ? response.data.appointments : []);
        })
        .catch(error => {
          console.error('Failed to fetch appointments:', error);
          setAppointments([]);
        });
      patientService.getPatientMedicalHistory(userData.id)
        .then(response => {
          const records = response?.data?.medicalRecords || response?.data || []; // fallback hợp lý
          console.log("Medical history loaded:", records);
          setMedicalHistory(Array.isArray(response.data) ? response.data : []);
        })
        .catch(error => {
          console.error('Failed to fetch medical history:', error);
          setMedicalHistory([]);
        });
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

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done' || info.file.status === 'uploading' || info.file.originFileObj) {
      const reader = new FileReader();
      reader.onload = e => setAvatarUrl(e.target.result);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!userData) return <div>Không có dữ liệu hồ sơ.</div>;

  const displayBirthDate = userData.birthDate && moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid()
    ? moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('DD/MM/YYYY')
    : 'Chưa cập nhật';

  const displayAge = userData.birthDate && moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).isValid()
    ? `${moment().diff(moment(userData.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']), 'years')} tuổi`
    : 'Chưa cập nhật';

  return (
    <div className="patient-profile-container">
      {/* Phần đầu trang với thông tin cơ bản và avatar */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <Dropdown menu={{
              items: [
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
              ]
            }} placement="bottomRight" trigger={['click']}>
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
                  {appointments.filter(app => app.status === 'scheduled').length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={appointments.filter(app => app.status === 'scheduled')}
                      renderItem={appointment => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar icon={<CalendarOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                            title={`${moment(appointment.date).format('DD/MM/YYYY')} - ${appointment.time}`}
                            description={`${appointment.purpose || ''} với ${appointment.doctorName || appointment.doctor || '---'}`}
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
            <Card className="treatments-list-card" title="Lịch sử điều trị">
              {medicalHistory.length === 0 ? (
                <div>Chưa có quá trình điều trị nào.</div>
              ) : (
                <List
                  dataSource={medicalHistory}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={`Điều trị ngày ${item.recordDate ? moment(item.recordDate).format('DD/MM/YYYY') : '---'}`}
                        description={
                          <>
                            <div>Bác sĩ: {item.doctorName || '---'}</div>
                            <div>Chẩn đoán: {item.diagnosis || '---'}</div>
                            <div>Phác đồ điều trị: {item.treatment || '---'}</div>
                            <div>Loại cuộc hẹn: {item.appointmentType || '---'}</div>
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
                        title={`Lịch hẹn ${item.type || ''}`}
                        description={
                          <>
                            <div>Thời gian: {item.appointmentDate ? moment(item.appointmentDate).format('DD/MM/YYYY') : '---'} {item.timeSlot || ''}</div>
                            <div>Loại: {item.type || '---'}</div>
                            <div>Bác sĩ ID: {item.doctorId || '---'}</div>
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
                dataSource={medicalHistory} // Sử dụng medicalHistory thay vì userData.medicalTests
                renderItem={record => (
                  <List.Item
                    actions={[
                      <Button type="link">Xem kết quả chi tiết</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title={
                        <div className="test-title">
                          <span>{record.name || record.testName || 'Kết quả xét nghiệm'}</span>
                          {record.result === 'Bình thường' ? (
                            <Tag color="success">Bình thường</Tag>
                          ) : (
                            <Tag color="warning">Cần theo dõi</Tag>
                          )}
                        </div>
                      }
                      description={
                        <div className="test-details">
                          <div><ClockCircleOutlined /> Ngày thực hiện: {moment(record.date || record.recordDate).format('DD/MM/YYYY')}</div>
                          <div><UserOutlined /> Bác sĩ: {record.doctor || record.doctorName || '---'}</div>
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