import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Tag, 
  Row, 
  Col, 
  Card, 
  Space, 
  Tabs, 
  Modal, 
  Empty, 
  Spin, 
  message,
  Descriptions, 
  Divider 
} from 'antd';
import { 
  CheckCircleOutlined, 
  HourglassOutlined, 
  CloseCircleOutlined, 
  PlusOutlined, 
  CalendarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import '../../styles/AppointmentHistory.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock data - lịch sử cuộc hẹn và các yêu cầu đang chờ duyệt
const mockAppointments = [
  { 
    id: 1,
    date: '2025-05-20', 
    requestedDate: '2025-05-20',
    requestedTime: '10:00',
    doctor: 'Dr. Nguyễn Văn A', 
    service: 'Khám tổng quát',
    reason: 'Khám kiểm tra định kỳ',
    status: 'completed', 
    time: '10:00', 
    location: 'Phòng khám A',
    notes: 'Cần tái khám sau 6 tháng'
  },
  { 
    id: 2,
    date: '2025-05-28', 
    requestedDate: '2025-05-28',
    requestedTime: '15:00',
    doctor: 'Dr. Trần Thị B', 
    service: 'Tẩy trắng răng',
    reason: 'Răng bị ố vàng',
    status: 'approved', 
    time: '15:00', 
    location: 'Phòng khám B',
    notes: 'Xác nhận lịch hẹn'
  },
  { 
    id: 3,
    date: '2025-06-10', 
    requestedDate: '2025-06-10',
    requestedTime: '09:30',
    doctor: null, 
    service: 'Nhổ răng khôn',
    reason: 'Răng khôn mọc lệch gây đau nhức',
    status: 'pending', 
    time: '09:30', 
    location: null,
    notes: ''
  },
  { 
    id: 4,
    date: '2025-04-15', 
    requestedDate: '2025-04-15',
    requestedTime: '14:00',
    doctor: 'Dr. Lê Quốc C', 
    service: 'Trám răng',
    reason: 'Răng bị sâu',
    status: 'cancelled', 
    time: '14:00', 
    location: 'Phòng khám C',
    notes: 'Hủy bởi bệnh nhân'
  },
];

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Giả lập việc gọi API để lấy dữ liệu
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Trong thực tế sẽ gọi API để lấy dữ liệu
        // const response = await axios.get('/api/patient/appointments');
        // setAppointments(response.data);
        
        // Mock data
        setTimeout(() => {
          setAppointments(mockAppointments);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Lỗi khi tải lịch hẹn:', error);
        message.error('Không thể tải lịch hẹn. Vui lòng thử lại sau!');
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  // Lọc các cuộc hẹn sắp tới (pending và approved)
  const upcomingAppointments = appointments.filter(
    app => (app.status === 'pending' || app.status === 'approved') && 
    dayjs(app.date).isAfter(dayjs())
  );
  
  // Lịch sử cuộc hẹn đã hoàn thành hoặc hủy
  const pastAppointments = appointments.filter(
    app => app.status === 'completed' || app.status === 'cancelled' || 
    (app.status === 'approved' && dayjs(app.date).isBefore(dayjs()))
  );
  
  // Xử lý hiển thị chi tiết cuộc hẹn
  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };
  
  // Xử lý hiển thị modal hủy cuộc hẹn
  const showCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalVisible(true);
  };
  
  // Xử lý đóng modal
  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setCancelModalVisible(false);
    setSelectedAppointment(null);
    setCancelReason('');
  };
  
  // Xử lý hủy cuộc hẹn
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    // Trong thực tế sẽ gọi API để hủy cuộc hẹn
    // axios.post(`/api/appointments/${selectedAppointment.id}/cancel`, { reason: cancelReason })
    
    // Mock hủy cuộc hẹn
    const updatedAppointments = appointments.map(app => {
      if (app.id === selectedAppointment.id) {
        return { ...app, status: 'cancelled', notes: `Lý do hủy: ${cancelReason}` };
      }
      return app;
    });
    
    setAppointments(updatedAppointments);
    message.success('Hủy lịch hẹn thành công');
    handleCloseModal();
  };
  
  // Lấy tag trạng thái dựa trên status của cuộc hẹn
  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn tất</Tag>;
      case 'approved':
        return <Tag color="blue" icon={<CheckCircleOutlined />}>Đã xác nhận</Tag>;
      case 'pending':
        return <Tag color="orange" icon={<HourglassOutlined />}>Chờ xác nhận</Tag>;
      case 'cancelled':
        return <Tag color="red" icon={<CloseCircleOutlined />}>Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };
  
  // Chuyển hướng đến trang đặt lịch hẹn mới
  const navigateToBooking = () => {
    navigate('/bookappointment');
  };

  return (
    <div className="appointment-history-container">
      <div className="appointment-header">
        <Title level={3}>Lịch Hẹn</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={navigateToBooking}
        >
          Đặt lịch hẹn mới
        </Button>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="appointment-tabs"
      >
        <TabPane 
          tab={
            <span>
              <CalendarOutlined /> Lịch hẹn sắp tới ({upcomingAppointments.length})
            </span>
          } 
          key="upcoming"
        >
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <Row gutter={[16, 16]}>
              {upcomingAppointments.map((appointment) => (
                <Col xs={24} sm={12} md={8} key={appointment.id}>
                  <Card
                    hoverable
                    className="appointment-card"
                    title={
                      <div className="appointment-card-title">
                        <Text strong>{appointment.service}</Text>
                        <div>{getStatusTag(appointment.status)}</div>
                      </div>
                    }
                  >
                    <div className="appointment-info">
                      <div className="appointment-info-item">
                        <Text strong>Ngày: </Text>
                        <Text>{dayjs(appointment.date).format('DD/MM/YYYY')}</Text>
                      </div>
                      <div className="appointment-info-item">
                        <Text strong>Giờ: </Text>
                        <Text>{appointment.time}</Text>
                      </div>
                      {appointment.doctor && (
                        <div className="appointment-info-item">
                          <Text strong>Bác sĩ: </Text>
                          <Text>{appointment.doctor}</Text>
                        </div>
                      )}
                      {appointment.location && (
                        <div className="appointment-info-item">
                          <Text strong>Địa điểm: </Text>
                          <Text>{appointment.location}</Text>
                        </div>
                      )}
                    </div>
                    
                    <div className="appointment-actions">
                      <Button 
                        type="primary"
                        icon={<InfoCircleOutlined />}
                        onClick={() => showAppointmentDetails(appointment)}
                      >
                        Chi tiết
                      </Button>
                      {appointment.status !== 'cancelled' && (
                        <Button 
                          type="danger"
                          onClick={() => showCancelModal(appointment)}
                        >
                          Hủy lịch hẹn
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="Không có lịch hẹn sắp tới" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={navigateToBooking}
              >
                Đặt lịch hẹn ngay
              </Button>
            </Empty>
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined /> Lịch sử cuộc hẹn ({pastAppointments.length})
            </span>
          } 
          key="history"
        >
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : pastAppointments.length > 0 ? (
            <Row gutter={[16, 16]}>
              {pastAppointments.map((appointment) => (
                <Col xs={24} sm={12} md={8} key={appointment.id}>
                  <Card
                    hoverable
                    className="appointment-card"
                    title={
                      <div className="appointment-card-title">
                        <Text strong>{appointment.service}</Text>
                        <div>{getStatusTag(appointment.status)}</div>
                      </div>
                    }
                  >
                    <div className="appointment-info">
                      <div className="appointment-info-item">
                        <Text strong>Ngày: </Text>
                        <Text>{dayjs(appointment.date).format('DD/MM/YYYY')}</Text>
                      </div>
                      <div className="appointment-info-item">
                        <Text strong>Giờ: </Text>
                        <Text>{appointment.time}</Text>
                      </div>
                      {appointment.doctor && (
                        <div className="appointment-info-item">
                          <Text strong>Bác sĩ: </Text>
                          <Text>{appointment.doctor}</Text>
                        </div>
                      )}
                    </div>
                    
                    <div className="appointment-actions">
                      <Button 
                        type="primary"
                        icon={<InfoCircleOutlined />}
                        onClick={() => showAppointmentDetails(appointment)}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="Không có lịch sử cuộc hẹn" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </TabPane>
      </Tabs>
      
      {/* Modal Chi tiết cuộc hẹn */}
      <Modal
        title="Chi tiết cuộc hẹn"
        open={detailModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedAppointment && (
          <Descriptions bordered column={{ xs: 1, sm: 2 }} layout="vertical">
            <Descriptions.Item label="Dịch vụ">{selectedAppointment.service}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{getStatusTag(selectedAppointment.status)}</Descriptions.Item>
            
            <Descriptions.Item label="Ngày hẹn">
              {dayjs(selectedAppointment.date).format('DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ hẹn">
              {selectedAppointment.time}
            </Descriptions.Item>
            
            <Descriptions.Item label="Bác sĩ">
              {selectedAppointment.doctor || 'Chưa phân công'}
            </Descriptions.Item>
            <Descriptions.Item label="Địa điểm">
              {selectedAppointment.location || 'Chưa xác định'}
            </Descriptions.Item>
            
            <Descriptions.Item label="Lý do khám" span={2}>
              {selectedAppointment.reason}
            </Descriptions.Item>
            
            <Descriptions.Item label="Ghi chú" span={2}>
              {selectedAppointment.notes || 'Không có ghi chú'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      
      {/* Modal Hủy lịch hẹn */}
      <Modal
        title="Xác nhận hủy lịch hẹn"
        open={cancelModalVisible}
        onOk={handleCancelAppointment}
        onCancel={handleCloseModal}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        {selectedAppointment && (
          <>
            <Paragraph>
              Bạn có chắc chắn muốn hủy lịch hẹn này không?
            </Paragraph>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Dịch vụ">{selectedAppointment.service}</Descriptions.Item>
              <Descriptions.Item label="Ngày giờ">
                {dayjs(selectedAppointment.date).format('DD/MM/YYYY')} - {selectedAppointment.time}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: '1rem' }}>
              <Text strong>Lý do hủy:</Text>
              <textarea
                className="cancel-reason"
                rows={4}
                placeholder="Nhập lý do hủy lịch hẹn"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentHistory;
