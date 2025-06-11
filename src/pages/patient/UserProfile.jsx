import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Avatar, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Form,
  Tabs,
  Timeline,
  Tag,
  Statistic,
  Progress,
  Divider,
  Modal,
  Upload,
  message,
  Badge,
  Alert,
  List,
  Space
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  SaveOutlined,
  CameraOutlined,
  HeartOutlined,
  CalendarOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/UserProfile.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Mock data - trong thực tế sẽ lấy từ API
  const [userInfo, setUserInfo] = useState({
    id: 'BN001',
    firstName: 'Nguyễn Văn',
    lastName: 'An',
    email: 'nguyenvanan@gmail.com',
    phone: '0123456789',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    dateOfBirth: dayjs('1990-05-15'),
    gender: 'Nam',
    bloodType: 'O+',
    weight: 70,
    height: 175,
    emergencyContact: '0987654321',
    insurance: 'BHYT123456789',
    allergies: 'Không có',
    avatar: null
  });

  const [medicalHistory, setMedicalHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      doctor: 'BS. Nguyễn Thị Mai',
      diagnosis: 'Vô sinh nguyên phát',
      treatment: 'Điều trị IUI',
      status: 'Đang điều trị',
      notes: 'Bệnh nhân cần theo dõi định kỳ, tuân thủ thuốc theo chỉ định',
      nextAppointment: '2024-01-30'
    },
    {
      id: 2,
      date: '2024-01-01',
      doctor: 'BS. Trần Văn Đức',
      diagnosis: 'Xét nghiệm hormone',
      treatment: 'Xét nghiệm tổng quát',
      status: 'Hoàn thành',
      notes: 'Kết quả xét nghiệm bình thường',
      nextAppointment: null
    }
  ]);

  const [treatmentSchedule, setTreatmentSchedule] = useState([
    {
      id: 1,
      date: '2024-01-30',
      time: '09:00',
      type: 'Khám tái khám',
      doctor: 'BS. Nguyễn Thị Mai',
      location: 'Phòng 201',
      status: 'Sắp tới',
      preparation: 'Nhịn ăn 8 tiếng trước khám'
    },
    {
      id: 2,
      date: '2024-02-15',
      time: '14:00',
      type: 'Thực hiện IUI',
      doctor: 'BS. Nguyễn Thị Mai',
      location: 'Phòng thủ thuật',
      status: 'Đã lên lịch',
      preparation: 'Chuẩn bị theo hướng dẫn của bác sĩ'
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Kết quả xét nghiệm hormone.pdf',
      date: '2024-01-15',
      type: 'Xét nghiệm',
      size: '2.1 MB'
    },
    {
      id: 2,
      name: 'Siêu âm buồng trứng.jpg',
      date: '2024-01-10',
      type: 'Hình ảnh',
      size: '1.5 MB'
    }
  ]);

  const handleSaveProfile = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserInfo({...userInfo, ...values});
      setEditMode(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = (info) => {
    if (info.file.status === 'done') {
      message.success('Cập nhật ảnh đại diện thành công!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang điều trị': return 'processing';
      case 'Hoàn thành': return 'success';
      case 'Sắp tới': return 'warning';
      case 'Đã lên lịch': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Đang điều trị': return <ClockCircleOutlined />;
      case 'Hoàn thành': return <CheckCircleOutlined />;
      case 'Sắp tới': return <WarningOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  // Tab 1: Thông tin cá nhân
  const PersonalInfoTab = () => (
    <Card title="Thông tin cá nhân" 
          extra={
            !editMode ? (
              <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
                Chỉnh sửa
              </Button>
            ) : null
          }>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>
          <Badge count={editMode ? <CameraOutlined style={{ color: '#1890ff' }} /> : 0}>
            <Avatar 
              size={120} 
              src={userInfo.avatar} 
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
          </Badge>
          {editMode && (
            <Upload
              showUploadList={false}
              onChange={handleUploadAvatar}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />} size="small">
                Đổi ảnh
              </Button>
            </Upload>
          )}
          <div style={{ marginTop: 16 }}>
            <Text strong style={{ fontSize: 16 }}>
              {userInfo.firstName} {userInfo.lastName}
            </Text>
            <br />
            <Text type="secondary">Mã BN: {userInfo.id}</Text>
          </div>
        </Col>

        <Col xs={24} sm={16} md={18}>
          <Form
            form={form}
            layout="vertical"
            initialValues={userInfo}
            onFinish={handleSaveProfile}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Họ" name="firstName">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Tên" name="lastName">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Email" name="email">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Số điện thoại" name="phone">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Địa chỉ" name="address">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Ngày sinh" name="dateOfBirth">
                  <DatePicker 
                    disabled={!editMode} 
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Giới tính" name="gender">
                  <Select disabled={!editMode}>
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Nhóm máu" name="bloodType">
                  <Select disabled={!editMode}>
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Cân nặng (kg)" name="weight">
                  <Input disabled={!editMode} type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Chiều cao (cm)" name="height">
                  <Input disabled={!editMode} type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Liên hệ khẩn cấp" name="emergencyContact">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Số BHYT" name="insurance">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Dị ứng" name="allergies">
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
            </Row>

            {editMode && (
              <Row justify="center" style={{ marginTop: 24 }}>
                <Space>
                  <Button onClick={() => setEditMode(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    Lưu thay đổi
                  </Button>
                </Space>
              </Row>
            )}
          </Form>
        </Col>
      </Row>
    </Card>
  );

  // Tab 2: Hồ sơ bệnh
  const MedicalRecordsTab = () => (
    <div>
      <Alert
        message="Thông tin được cập nhật bởi bác sĩ"
        description="Hồ sơ bệnh của bạn được bác sĩ cập nhật sau mỗi lần khám. Vui lòng theo dõi thường xuyên."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <Timeline>
        {medicalHistory.map((record) => (
          <Timeline.Item 
            key={record.id}
            dot={getStatusIcon(record.status)}
            color={getStatusColor(record.status)}
          >
            <Card 
              size="small" 
              style={{ marginBottom: 16 }}
              title={
                <Space>
                  <Text strong>{dayjs(record.date).format('DD/MM/YYYY')}</Text>
                  <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Text strong>Bác sĩ điều trị: </Text>
                  <Text>{record.doctor}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Chẩn đoán: </Text>
                  <Text>{record.diagnosis}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Phương pháp điều trị: </Text>
                  <Text>{record.treatment}</Text>
                </Col>
                {record.nextAppointment && (
                  <Col xs={24} sm={12}>
                    <Text strong>Lịch hẹn tiếp theo: </Text>
                    <Text type="warning">
                      {dayjs(record.nextAppointment).format('DD/MM/YYYY')}
                    </Text>
                  </Col>
                )}
                <Col xs={24}>
                  <Text strong>Ghi chú: </Text>
                  <Paragraph>{record.notes}</Paragraph>
                </Col>
              </Row>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );

  // Tab 3: Lịch điều trị
  const TreatmentScheduleTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Statistic
            title="Lịch hẹn sắp tới"
            value={treatmentSchedule.filter(item => item.status === 'Sắp tới').length}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Đã lên lịch"
            value={treatmentSchedule.filter(item => item.status === 'Đã lên lịch').length}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Tiến độ điều trị"
            value={75}
            suffix="%"
            prefix={<HeartOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
      </Row>

      <Progress 
        percent={75} 
        status="active" 
        strokeColor="#52c41a"
        style={{ marginBottom: 24 }}
      />

      <List
        dataSource={treatmentSchedule}
        renderItem={(item) => (
          <List.Item>
            <Card 
              style={{ width: '100%' }}
              title={
                <Space>
                  <CalendarOutlined />
                  <Text strong>
                    {dayjs(item.date).format('DD/MM/YYYY')} - {item.time}
                  </Text>
                  <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Text strong>Loại điều trị: </Text>
                  <Text>{item.type}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Bác sĩ: </Text>
                  <Text>{item.doctor}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Địa điểm: </Text>
                  <Text>{item.location}</Text>
                </Col>
                <Col xs={24}>
                  <Text strong>Chuẩn bị: </Text>
                  <Text type="warning">{item.preparation}</Text>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );

  // Tab 4: Tài liệu y tế
  const DocumentsTab = () => (
    <div>
      <Card 
        title="Tài liệu y tế" 
        extra={
          <Button type="primary" icon={<UploadOutlined />}>
            Tải lên tài liệu
          </Button>
        }
      >
        <List
          dataSource={documents}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button icon={<EyeOutlined />} type="text">Xem</Button>,
                <Button icon={<DownloadOutlined />} type="text">Tải về</Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                title={item.name}
                description={
                  <Space>
                    <Text type="secondary">{item.type}</Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">{item.date}</Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">{item.size}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          <UserOutlined /> Hồ sơ bệnh nhân
        </Title>

        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Thông tin cá nhân
              </span>
            }
            key="1"
          >
            <PersonalInfoTab />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Hồ sơ bệnh
                <Badge count={medicalHistory.length} style={{ marginLeft: 8 }} />
              </span>
            }
            key="2"
          >
            <MedicalRecordsTab />
          </TabPane>

          <TabPane
            tab={
              <span>
                <CalendarOutlined />
                Lịch điều trị
                <Badge 
                  count={treatmentSchedule.filter(item => item.status === 'Sắp tới').length} 
                  style={{ marginLeft: 8 }} 
                />
              </span>
            }
            key="3"
          >
            <TreatmentScheduleTab />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Tài liệu
                <Badge count={documents.length} style={{ marginLeft: 8 }} />
              </span>
            }
            key="4"
          >
            <DocumentsTab />
          </TabPane>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserProfile; 