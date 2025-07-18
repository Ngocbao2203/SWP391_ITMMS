import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Tag,
  Row,
  Col,
  Card,
  Tabs,
  Modal,
  Empty,
  Spin,
  message,
  Descriptions,
  Input,
  List,
} from 'antd';
import {
  CheckCircleOutlined,
  HourglassOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  appointmentService,
  patientService,
  authService,
  formatErrorMessage,
} from '../../services';
import '../../styles/AppointmentHistory.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = authService.getCurrentUser();

        if (!user || !user.id) {
          message.error('Vui lòng đăng nhập để xem lịch hẹn');
          navigate('/login');
          return;
        }

        // Fetch appointments
        const appointmentData = await patientService.getPatientAppointments(user.id);
        setAppointments(appointmentData.appointments || []);

        // Fetch medical history
        const medicalHistory = await patientService.getPatientMedicalHistory(user.id);
        setMedicalRecords(medicalHistory.records || []);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error);
        message.error(formatErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter(
    (app) =>
      ['Scheduled', 'Confirmed'].includes(app.status) &&
      dayjs(app.appointmentDate).isAfter(dayjs())
  );

  // Filter past appointments
  const pastAppointments = appointments.filter(
    (app) =>
      ['Completed', 'Cancelled', 'No Show'].includes(app.status) ||
      (['Scheduled', 'Confirmed'].includes(app.status) &&
        dayjs(app.appointmentDate).isBefore(dayjs()))
  );

  // Show appointment details
  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };

  // Show cancel modal
  const showCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalVisible(true);
  };

  // Close modals
  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setCancelModalVisible(false);
    setSelectedAppointment(null);
    setCancelReason('');
  };

  // Cancel appointment
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelling(true);
      const result = await appointmentService.cancelAppointment(selectedAppointment.id);

      if (result.success) {
        const updatedAppointments = appointments.map((app) => {
          if (app.id === selectedAppointment.id) {
            return {
              ...app,
              status: 'Cancelled',
              notes: app.notes + (cancelReason ? ` | Lý do hủy: ${cancelReason}` : ''),
            };
          }
          return app;
        });

        setAppointments(updatedAppointments);
        message.success('Hủy lịch hẹn thành công');
        handleCloseModal();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      message.error(formatErrorMessage(error));
    } finally {
      setCancelling(false);
    }
  };

  // Get status tag
  const getStatusTag = (status) => {
    switch (status) {
      case 'Completed':
        return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn tất</Tag>;
      case 'Confirmed':
        return <Tag color="blue" icon={<CheckCircleOutlined />}>Đã xác nhận</Tag>;
      case 'Scheduled':
        return <Tag color="orange" icon={<HourglassOutlined />}>Chờ xác nhận</Tag>;
      case 'Cancelled':
        return <Tag color="red" icon={<CloseCircleOutlined />}>Đã hủy</Tag>;
      case 'No Show':
        return <Tag color="volcano" icon={<CloseCircleOutlined />}>Không đến</Tag>;
      case 'In Progress':
        return <Tag color="processing" icon={<HourglassOutlined />}>Đang khám</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Navigate to booking page
  const navigateToBooking = () => {
    navigate('/bookappointment');
  };

  // Get medical record for selected appointment
  const getMedicalRecord = (appointmentId) => {
    return medicalRecords.find((record) => record.appointmentId === appointmentId) || null;
  };

  return (
    <div className="appointment-history-container">
      <div className="appointment-header">
        <Title level={3}>Lịch Hẹn</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={navigateToBooking}>
          Đặt lịch hẹn mới
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="appointment-tabs">
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
              {upcomingAppointments.map((appointment) => {
                const appointmentDate = dayjs(appointment.appointmentDate).format('DD/MM/YYYY');
                const timeSlot = appointment.timeSlot || 'Chưa xác định';

                return (
                  <Col xs={24} sm={12} md={8} key={appointment.id}>
                    <Card
                      hoverable
                      className="appointment-card"
                      title={
                        <div className="appointment-card-title">
                          <Text strong>{appointment.type || 'Khám bệnh'}</Text>
                          <div>{getStatusTag(appointment.status)}</div>
                        </div>
                      }
                    >
                      <div className="appointment-info">
                        <div className="appointment-info-item">
                          <Text strong>Ngày: </Text>
                          <Text>{appointmentDate}</Text>
                        </div>
                        <div className="appointment-info-item">
                          <Text strong>Giờ: </Text>
                          <Text>{timeSlot}</Text>
                        </div>
                        {appointment.doctor && (
                          <div className="appointment-info-item">
                            <Text strong>Bác sĩ: </Text>
                            <Text>{appointment.doctor.name}</Text>
                          </div>
                        )}
                        {appointment.doctor?.specialization && (
                          <div className="appointment-info-item">
                            <Text strong>Chuyên khoa: </Text>
                            <Text>{appointment.doctor.specialization}</Text>
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
                        {!['Cancelled', 'No Show', 'Completed'].includes(appointment.status) && (
                          <Button type="danger" onClick={() => showCancelModal(appointment)}>
                            Hủy lịch hẹn
                          </Button>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty
              description="Không có lịch hẹn sắp tới"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" icon={<PlusOutlined />} onClick={navigateToBooking}>
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
              {pastAppointments.map((appointment) => {
                const appointmentDate = dayjs(appointment.appointmentDate).format('DD/MM/YYYY');
                const timeSlot = appointment.timeSlot || 'Chưa xác định';

                return (
                  <Col xs={24} sm={12} md={8} key={appointment.id}>
                    <Card
                      hoverable
                      className="appointment-card"
                      title={
                        <div className="appointment-card-title">
                          <Text strong>{appointment.type || 'Khám bệnh'}</Text>
                          <div>{getStatusTag(appointment.status)}</div>
                        </div>
                      }
                    >
                      <div className="appointment-info">
                        <div className="appointment-info-item">
                          <Text strong>Ngày: </Text>
                          <Text>{appointmentDate}</Text>
                        </div>
                        <div className="appointment-info-item">
                          <Text strong>Giờ: </Text>
                          <Text>{timeSlot}</Text>
                        </div>
                        {appointment.doctor && (
                          <div className="appointment-info-item">
                            <Text strong>Bác sĩ: </Text>
                            <Text>{appointment.doctor.name}</Text>
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
                );
              })}
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
          </Button>,
        ]}
        width={800}
      >
        {selectedAppointment && (
          <>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} layout="vertical">
              <Descriptions.Item label="Dịch vụ">
                {selectedAppointment.service || 'Khám bệnh'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedAppointment.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hẹn">
                {dayjs(selectedAppointment.appointmentDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ hẹn">
                {selectedAppointment.timeSlot || 'Chưa xác định'}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ">
                {selectedAppointment.doctor?.name || 'Chưa phân công'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {selectedAppointment.location || 'Chưa xác định'}
              </Descriptions.Item>
              <Descriptions.Item label="Lý do khám" span={2}>
                {selectedAppointment.reason || 'Không có lý do'}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedAppointment.notes || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>

            {selectedAppointment.status === 'Completed' && (
              <div style={{ marginTop: '20px' }}>
                <Title level={5}>Hồ sơ y tế</Title>
                {(() => {
                  const record = getMedicalRecord(selectedAppointment.id);
                  return record ? (
                    <Descriptions bordered column={{ xs: 1, sm: 2 }} layout="vertical">
                      <Descriptions.Item label="Chẩn đoán">
                        {record.diagnosis || 'Không có chẩn đoán'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày khám">
                        {dayjs(record.visitDate).format('DD/MM/YYYY')}
                      </Descriptions.Item>
                      <Descriptions.Item label="Thuốc kê đơn" span={2}>
                        {record.prescriptions?.length > 0 ? (
                          <List
                            dataSource={record.prescriptions}
                            renderItem={(item) => (
                              <List.Item>
                                {item.medication} - {item.dosage} ({item.duration})
                              </List.Item>
                            )}
                          />
                        ) : (
                          'Không có thuốc kê đơn'
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ghi chú bác sĩ" span={2}>
                        {record.notes || 'Không có ghi chú'}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Empty description="Không có hồ sơ y tế cho cuộc hẹn này" />
                  );
                })()}
              </div>
            )}
          </>
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
        okButtonProps={{ danger: true, loading: cancelling }}
      >
        {selectedAppointment && (
          <>
            <Paragraph>Bạn có chắc chắn muốn hủy lịch hẹn này không?</Paragraph>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Dịch vụ">
                {selectedAppointment.service || 'Khám bệnh'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày giờ">
                {dayjs(selectedAppointment.appointmentDate).format('DD/MM/YYYY')} -{' '}
                {selectedAppointment.timeSlot || 'Chưa xác định'}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: '1rem' }}>
              <Text strong>Lý do hủy:</Text>
              <TextArea
                rows={4}
                placeholder="Nhập lý do hủy lịch hẹn"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentHistory;