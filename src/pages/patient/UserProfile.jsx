import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Upload,
  message,
  Badge,
  Alert,
  List,
  Space,
  Spin
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
  DownloadOutlined,
  ReadOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import MainLayout from '../../layouts/MainLayout';
// import { getPublishedBlogs } from '../../services/blogService';
import authService from '../../services/authService';
import '../../styles/UserProfile.css';

/* 
* LƯU Ý KHI KẾT NỐI VỚI BACKEND:
* 1. Thay thế authService bằng các API call đến backend
* 2. Thay thế dữ liệu mẫu bằng dữ liệu từ API
* 3. Cập nhật phương thức xử lý lỗi và loading state
*/

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const UserProfile = () => {  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      if (activeTab === '5') {
        setLoadingArticles(true);
        try {
          // TODO: Thay thế bằng API call đến backend
          // VD: const response = await axios.get('/api/blogs/published');
          // const data = response.data;
          // const data = await getPublishedBlogs();
          // setArticles(data);
        } catch (error) {
          console.error('Error fetching articles:', error);
          message.error('Không thể tải bài viết. Vui lòng thử lại sau.');
        } finally {
          setLoadingArticles(false);
        }
      }
    };

    fetchArticles();
  }, [activeTab]);
  const navigate = useNavigate();
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  // Lấy thông tin người dùng từ authService
  const [userInfo, setUserInfo] = useState(null);
  // Fetch user data
  useEffect(() => {
    setInitialLoading(true);
    
    try {
      // TODO: Thay thế bằng API call đến backend
      // VD: const response = await axios.get('/api/users/current');
      // const currentUser = response.data;
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        message.error('Vui lòng đăng nhập để xem thông tin cá nhân');
        navigate('/login');
        return;
      }
      
      // Chuyển đổi ngày sinh từ chuỗi sang đối tượng dayjs nếu có
      const formattedUser = {
        ...currentUser,
        dateOfBirth: currentUser.dateOfBirth ? dayjs(currentUser.dateOfBirth) : null
      };
      
      setUserInfo(formattedUser);
      form.setFieldsValue(formattedUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Có lỗi khi tải thông tin người dùng');
    } finally {
      setInitialLoading(false);
    }
  }, [form, navigate]);
  // State cho lịch sử y tế
  const [medicalHistory, setMedicalHistory] = useState([]);
  
  // Fetch medical history từ API
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (activeTab === '2' && userInfo) {
        try {
          // TODO: Thay thế bằng API call đến backend
          // VD: const response = await axios.get(`/api/patients/${userInfo.id}/medical-history`);
          // setMedicalHistory(response.data);
          
          // Dữ liệu mẫu - sẽ được thay thế bằng API call
          setMedicalHistory([
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
        } catch (error) {
          console.error('Error fetching medical history:', error);
          message.error('Không thể tải hồ sơ bệnh. Vui lòng thử lại sau.');
        }
      }
    };
    
    fetchMedicalHistory();
  }, [activeTab, userInfo]);
  // State cho lịch điều trị
  const [treatmentSchedule, setTreatmentSchedule] = useState([]);
  
  // Fetch treatment schedule từ API
  useEffect(() => {
    const fetchTreatmentSchedule = async () => {
      if (activeTab === '3' && userInfo) {
        try {
          // TODO: Thay thế bằng API call đến backend
          // VD: const response = await axios.get(`/api/patients/${userInfo.id}/treatment-schedules`);
          // setTreatmentSchedule(response.data);
          
          // Dữ liệu mẫu - sẽ được thay thế bằng API call
          setTreatmentSchedule([
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
        } catch (error) {
          console.error('Error fetching treatment schedule:', error);
          message.error('Không thể tải lịch điều trị. Vui lòng thử lại sau.');
        }
      }
    };
    
    fetchTreatmentSchedule();
  }, [activeTab, userInfo]);  // State cho tài liệu y tế
  const [documents, setDocuments] = useState([]);
  const [setLoadingDocuments] = useState(false);
  
  // Fetch documents từ API
  useEffect(() => {
    const fetchDocuments = async () => {
      if (activeTab === '4' && userInfo) {
        setLoadingDocuments(true);
        try {
          // TODO: Thay thế bằng API call đến backend
          // VD: const response = await axios.get(`/api/patients/${userInfo.id}/documents`);
          // setDocuments(response.data);
          
          // Dữ liệu mẫu - sẽ được thay thế bằng API call
          setDocuments([
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
        } catch (error) {
          console.error('Error fetching documents:', error);
          message.error('Không thể tải tài liệu. Vui lòng thử lại sau.');
        } finally {
          setLoadingDocuments(false);
        }
      }
    };
    
    fetchDocuments();
  }, [activeTab, userInfo]);  const handleSaveProfile = async (values) => {
    setLoading(true);
    try {
      // Chuyển đổi ngày sinh từ dayjs về chuỗi để lưu vào localStorage
      const updatedData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
      };
      
      // TODO: Thay thế bằng API call đến backend
      // VD: const response = await axios.put(`/api/patients/${userInfo.id}`, updatedData);
      // const result = response.data;
      
      // Cập nhật thông tin user thông qua authService
      const result = await authService.updateUserProfile(userInfo.id, updatedData);
      
      if (result.success) {
        // TODO: Thay thế bằng API call đến backend
        // VD: const userResponse = await axios.get(`/api/users/current`);
        // const updatedUser = userResponse.data;
        
        // Lấy thông tin user mới nhất
        const updatedUser = authService.getCurrentUser();
        
        // Cập nhật state và form với thông tin mới
        const formattedUser = {
          ...updatedUser,
          dateOfBirth: updatedUser.dateOfBirth ? dayjs(updatedUser.dateOfBirth) : null
        };
        
        setUserInfo(formattedUser);
        form.setFieldsValue(formattedUser);
        setEditMode(false);
        message.success('Cập nhật thông tin thành công!');
      } else {
        message.error(result.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleUploadAvatar = (info) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      // Lấy base64 từ file
      getBase64(info.file.originFileObj, async (imageUrl) => {
        try {
          // TODO: Thay thế bằng API call đến backend
          // VD: const formData = new FormData();
          // formData.append('avatar', info.file.originFileObj);
          // const response = await axios.post(`/api/users/${userInfo.id}/avatar`, formData, {
          //   headers: { 'Content-Type': 'multipart/form-data' }
          // });
          // const result = response.data;
          
          // Cập nhật avatar cho user thông qua authService
          const result = await authService.updateUserProfile(userInfo.id, { avatar: imageUrl });
          
          if (result.success) {
            // TODO: Thay thế bằng API call đến backend
            // VD: const userResponse = await axios.get('/api/users/current');
            // const updatedUser = userResponse.data;
            
            // Lấy thông tin user mới nhất
            const updatedUser = authService.getCurrentUser();
            setUserInfo({
              ...userInfo,
              avatar: updatedUser.avatar
            });
            message.success('Cập nhật ảnh đại diện thành công!');
          } else {
            message.error(result.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện');
          }
        } catch (error) {
          console.error('Error updating avatar:', error);
          message.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
        } finally {
          setAvatarLoading(false);
        }
      });
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
    <Card 
      className="profile-card"
      title="Thông tin cá nhân" 
      extra={
        !editMode ? (
          <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
            Chỉnh sửa
          </Button>
        ) : null
      }>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>          <Badge count={editMode ? <CameraOutlined style={{ color: '#1890ff' }} /> : 0}>
            <Avatar 
              size={120} 
              src={userInfo?.avatar} 
              icon={!userInfo?.avatar && <UserOutlined />}
              style={{ marginBottom: 16 }}
            />
          </Badge>
          {editMode && (            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" // TODO: Thay thế bằng API endpoint từ backend
              beforeUpload={beforeUpload}
              onChange={handleUploadAvatar}
            >
              {avatarLoading ? (
                <div>
                  <LoadingOutlined />
                  <div style={{ marginTop: 8 }}>Đang tải...</div>
                </div>
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Đổi ảnh</div>
                </div>
              )}
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
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            // TODO: Thay thế bằng hàm xử lý tải tài liệu kết nối đến backend API
            // onClick={() => handleUploadDocument()}
          >
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

  // Tab 5: Bài viết
  const ArticlesTab = () => (
    <div>
      {loadingArticles ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <span>Đang tải bài viết...</span>
        </div>
      ) : (
        <Card title="Bài viết và Chia sẻ">
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                window.scrollTo(0, 0);
              },
              pageSize: 5,
            }}
            dataSource={articles}
            renderItem={item => (
              <List.Item
                key={item.id}
                extra={
                  item.coverImage && (
                    <img
                      width={272}
                      alt={item.title}
                      src={item.coverImage}
                    />
                  )
                }
                actions={[
                  <Link to={`/blog/${item.id}`}>Xem chi tiết</Link>
                ]}
              >
                <List.Item.Meta
                  title={<Link to={`/blog/${item.id}`}>{item.title}</Link>}
                  description={
                    <Space direction="vertical">
                      <Space>
                        <Tag color="blue">{item.category}</Tag>
                        <span>{item.createdAt}</span>
                      </Space>
                      <span>Tác giả: {item.author}</span>
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 3 }} style={{ marginTop: 16 }}>
                  {item.summary}
                </Paragraph>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          <UserOutlined /> Hồ sơ bệnh nhân
        </Title>
        
        {initialLoading ? (
          <div style={{ textAlign: 'center', margin: '100px 0' }}>
            <Spin size="large" tip="Đang tải thông tin..." />
          </div>
        ) : !userInfo ? (
          <Alert 
            message="Lỗi tải thông tin" 
            description="Không thể tải thông tin người dùng. Vui lòng thử lại sau."
            type="error"
            showIcon
          />
        ) : (
          <div className="profile-content">
            {/* Thông tin cá nhân */}
            <PersonalInfoTab />

            {/* Lịch điều trị */}
            <div className="profile-section" style={{ marginTop: 24 }}>
              <Title level={4}>
                <CalendarOutlined /> Lịch điều trị 
                <Badge 
                  count={treatmentSchedule.filter(item => item.status === 'Sắp tới').length} 
                  style={{ marginLeft: 8 }} 
                />
              </Title>
              <TreatmentScheduleTab />
            </div>

            {/* Hồ sơ bệnh */}
            <div className="profile-section" style={{ marginTop: 24 }}>
              <Title level={4}>
                <FileTextOutlined /> Hồ sơ bệnh
                <Badge count={medicalHistory.length} style={{ marginLeft: 8 }} />
              </Title>
              <MedicalRecordsTab />
            </div>

            {/* Tabs cho nội dung khác */}
            <div className="profile-section" style={{ marginTop: 32 }}>
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab} 
                size="large" 
                className="user-profile-tabs">
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
                <TabPane
                  tab={
                    <span>
                      <ReadOutlined />
                      Bài viết
                      <Badge count={articles.length} style={{ marginLeft: 8 }} />
                    </span>
                  }
                  key="5"
                >
                  <ArticlesTab />
                </TabPane>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserProfile;