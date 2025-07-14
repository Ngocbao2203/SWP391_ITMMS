import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Spin, 
  message, 
  Button, 
  Tag, 
  Avatar, 
  List, 
  Space, 
  Empty,
  DatePicker
} from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  MedicineBoxOutlined,
  EyeOutlined,
  HeartOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { authService, appointmentService } from '../../services';
import ConsultationModal from '../../components/doctor/ConsultationModal';
import '../../styles/DoctorDashboard.css';

const { Title, Text, Paragraph } = Typography;

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [consultationModalVisible, setConsultationModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // State cho ngày được chọn
  const [allAppointments, setAllAppointments] = useState([]); // State cho tất cả appointments
  const [dashboardData, setDashboardData] = useState({
    doctor: null,
    todayAppointments: [],
    stats: {
      todayCount: 0,
      activePatients: 0,
      completedToday: 0,
      pendingFollowUps: 0
    },
    notifications: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update displayed appointments when allAppointments or selectedDate changes
  useEffect(() => {
    if (allAppointments.length > 0) {
      updateDisplayedAppointments();
    }
  }, [allAppointments, selectedDate]);

  // Function để filter appointments theo ngày được chọn
  const filterAppointmentsByDate = (appointments, targetDate) => {
    const targetDateStr = targetDate.format('YYYY-MM-DD');
    return appointments.filter(appointment => {
      const appointmentDateStr = dayjs(appointment.appointmentDate).format('YYYY-MM-DD');
      return appointmentDateStr === targetDateStr;
    });
  };

  // Function để cập nhật appointments được hiển thị
  const updateDisplayedAppointments = (date = selectedDate) => {
    const filteredAppointments = filterAppointmentsByDate(allAppointments, date);
    setDashboardData(prev => ({
      ...prev,
      todayAppointments: filteredAppointments,
      stats: {
        ...prev.stats,
        todayCount: filteredAppointments.length,
        completedToday: filteredAppointments.filter(apt => apt.status === 'Completed').length
      }
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateDisplayedAppointments(date);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser?.doctor?.id) {
        message.error('Không thể tải thông tin bác sĩ');
        return;
      }

      const doctorId = currentUser.doctor.id;
      const today = dayjs().format('YYYY-MM-DD');

      try {
        // Lấy lịch hẹn của doctor từ API appointments (có customerId)
        console.log('=== FETCHING DOCTOR APPOINTMENTS ===');
        console.log('DoctorId:', doctorId);
        console.log('Today:', today);
        
        // Thử nhiều cách gọi API để lấy data
        let scheduleResponse = null;
        
        // Kiểm tra backend có chạy không
        try {
          console.log('=== TESTING BACKEND CONNECTION ===');
          const testResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5037'}/api/appointments/test`);
          console.log('Backend test response status:', testResponse.status);
          if (!testResponse.ok) {
            console.warn('Backend test failed with status:', testResponse.status);
          }
        } catch (backendError) {
          console.error('Backend connection failed:', backendError);
          console.error('Make sure backend is running on port 5037');
        }
        
        // Lấy tất cả appointments của doctor (client-side filtering)
        try {
          console.log('Getting all doctor appointments...');
          scheduleResponse = await appointmentService.getDoctorAppointments(doctorId);
          console.log('All appointments result:', scheduleResponse);
        } catch (error) {
          console.warn('Failed to get all appointments:', error);
        }
        console.log('=== RAW API APPOINTMENTS RESPONSE ===');
        console.log('Full response:', scheduleResponse);
        console.log('Response type:', typeof scheduleResponse);
        console.log('Response keys:', Object.keys(scheduleResponse || {}));
        
        // Extract appointments from response structure - theo Swagger API
        let allAppointmentsData = scheduleResponse.data?.appointments || 
                                scheduleResponse.appointments || 
                                scheduleResponse.data || 
                                scheduleResponse || [];
        
        console.log('=== ALL APPOINTMENTS ARRAY ===');
        console.log('All appointments array:', allAppointmentsData);
        console.log('Is array:', Array.isArray(allAppointmentsData));
        console.log('Length:', allAppointmentsData.length);
        
        // Lưu tất cả appointments vào state
        setAllAppointments(allAppointmentsData);
        
        console.log('=== APPOINTMENTS LOADED ===');
        console.log('Selected date:', selectedDate.format('YYYY-MM-DD'));
        console.log('All appointments count:', allAppointmentsData.length);
        
        // Log first appointment structure if exists
        if (allAppointmentsData.length > 0) {
          console.log('=== FIRST APPOINTMENT DEBUG ===');
          console.log('First appointment:', allAppointmentsData[0]);
          console.log('First appointment keys:', Object.keys(allAppointmentsData[0] || {}));
          console.log('CustomerId field:', allAppointmentsData[0].CustomerId);
          console.log('customerId field:', allAppointmentsData[0].customerId);
                     console.log('CustomerId type:', typeof allAppointmentsData[0].CustomerId);
           console.log('customerId type:', typeof allAppointmentsData[0].customerId);
        }
        
        // Always process API data first - handle field mapping and missing values
        console.log('=== PROCESSING API DATA ===');
        if (Array.isArray(allAppointmentsData) && allAppointmentsData.length > 0) {
          allAppointmentsData = allAppointmentsData.map((appointment, index) => {
            console.log(`Processing appointment ${index}:`, appointment);
            
            // FIX: API structure issue - customerId thực ra là appointmentId
            console.log('=== FIXING APPOINTMENT DATA STRUCTURE ===');
            console.log('Raw appointment:', appointment);
            
            // Trích xuất customerId thật từ customerName nếu có pattern số
            let realCustomerId = null;
            if (appointment.customerName && /^cus(\d+)$/.test(appointment.customerName)) {
              // customerName có format "cus2" -> customerId = 2
              realCustomerId = parseInt(appointment.customerName.replace('cus', ''));
            } else if (appointment.customerName && /^\d+$/.test(appointment.customerName)) {
              // customerName là số thuần -> đó là customerId
              realCustomerId = parseInt(appointment.customerName);
            } else {
              // Fallback: tạm thời sử dụng một số mặc định
              console.warn('Cannot extract customerId from customerName:', appointment.customerName);
              realCustomerId = appointment.customerId; // Tạm thời giữ nguyên để test
            }
            
            const processedAppointment = {
              ...appointment,
              // Đây mới là appointmentId thật
              appointmentId: appointment.customerId, // customerId trong API thực ra là appointmentId
              // Đây mới là customerId thật
              customerId: realCustomerId,
              // Đảm bảo có customerName và customerPhone cho display
              customerName: appointment.customerName || `Customer ${realCustomerId}`,
              customerPhone: appointment.customerPhone || '',
              timeSlot: appointment.timeSlot || '',
              type: appointment.type || 'Consultation',
              status: appointment.status || 'Scheduled'
            };
            
            console.log('Processed appointment - appointmentId:', processedAppointment.appointmentId);
            console.log('Processed appointment - customerId:', processedAppointment.customerId);
            
            console.log(`Processed appointment ${index}:`, processedAppointment);
            console.log(`Final customerId: ${processedAppointment.customerId}`);
            
            return processedAppointment;
          });
        }
        
        // Sau khi process xong, lưu lại tất cả appointments và filter theo ngày
        setAllAppointments(allAppointmentsData);
        
        // Filter appointments theo ngày được chọn 
        const filteredAppointments = filterAppointmentsByDate(allAppointmentsData, selectedDate);
        
        console.log('=== FINAL PROCESSED DATA ===');
        console.log('All appointments from API:', allAppointmentsData);
        console.log('All appointments count:', allAppointmentsData.length);
        console.log('Filtered appointments for selected date:', filteredAppointments);
        console.log('Filtered appointments count:', filteredAppointments.length);
        
        // Nếu không có appointments từ API, hiển thị thông báo
        if (!Array.isArray(allAppointmentsData) || allAppointmentsData.length === 0) {
          console.warn('=== NO APPOINTMENTS FROM API ===');
          console.warn('Possible reasons:');
          console.warn('1. Backend API không chạy');
          console.warn('2. Không có appointments cho doctor này');
          console.warn('3. API endpoint/parameters không đúng');
          console.warn('4. Database không có data');
        }

        // Debug log appointment structure
        if (allAppointmentsData.length > 0) {
          console.log('Sample appointment structure:', allAppointmentsData[0]);
        }

        // Tính thống kê dựa trên appointments của ngày được chọn
        const stats = {
          todayCount: filteredAppointments.length,
          activePatients: filteredAppointments.filter(apt => apt.status === 'Confirmed' || apt.status === 'Scheduled').length,
          completedToday: filteredAppointments.filter(apt => apt.status === 'Completed').length,
          pendingFollowUps: filteredAppointments.filter(apt => apt.type === 'Follow-up' && apt.status === 'Scheduled').length
        };

        setDashboardData({
          doctor: currentUser.doctor,
          todayAppointments: filteredAppointments.slice(0, 8), // Hiển thị 8 cuộc hẹn của ngày được chọn
          stats,
          notifications: []
        });

      } catch (apiError) {
        console.error('API Error, using mock data:', apiError);
        // Fallback to mock data
        const mockAppointments = [
          {
            id: 23,
            customerId: 21,
            customerName: 'cus2',
            customerPhone: '012345',
            doctorId: doctorId,
            appointmentDate: today,
            timeSlot: '08:00-09:00',
            type: 'Điều trị',
            status: 'Scheduled',
            notes: '',
            customer: {
              id: 21,
              user: {
                fullName: 'cus2',
                phone: '012345'
              }
            }
          }
        ];

        setDashboardData({
          doctor: currentUser.doctor,
          todayAppointments: mockAppointments,
          stats: {
            todayCount: mockAppointments.length,
            activePatients: 1,
            completedToday: 0,
            pendingFollowUps: 0
          },
          notifications: []
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'blue',
      'Confirmed': 'green',
      'Completed': 'success',
      'Cancelled': 'default',
      'No-Show': 'error'
    };
    return colors[status] || 'default';
  };

  const getAppointmentTypeIcon = (type) => {
    const icons = {
      'Consultation': <MedicineBoxOutlined />,
      'Follow-up': <ClockCircleOutlined />,
      'Treatment': <HeartOutlined />,
      'Điều trị': <HeartOutlined />
    };
    return icons[type] || <CalendarOutlined />;
  };

  const handleStartConsultation = (appointment) => {
    setSelectedAppointment(appointment);
    setConsultationModalVisible(true);
  };

  const handleConsultationSuccess = () => {
    // Reload dashboard data after successful consultation
    fetchDashboardData();
  };

  const renderWelcomeHeader = () => {
    const currentHour = dayjs().hour();
    let greeting = 'Chào buổi sáng';
    if (currentHour >= 12 && currentHour < 18) {
      greeting = 'Chào buổi chiều';
    } else if (currentHour >= 18) {
      greeting = 'Chào buổi tối';
    }

    return (
      <Card className="welcome-card" style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col span={24}>
            <Space size="middle">
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {greeting}, BS. {dashboardData.doctor?.fullName || 'Doctor'}
                </Title>
                <Paragraph style={{ margin: 0, color: '#666' }}>
                  {dashboardData.doctor?.specialization} • {dayjs().format('dddd, DD/MM/YYYY')}
                </Paragraph>
              </div>
            </Space>
          </Col>

        </Row>
      </Card>
    );
  };

  const renderStatsCards = () => {
    const stats = [
      {
        title: 'Hôm nay',
        value: dashboardData.stats.todayCount,
        icon: <CalendarOutlined style={{ color: '#1976d2' }} />,
        color: '#1976d2',
        suffix: 'cuộc hẹn'
      },
      {
        title: 'Đang điều trị',
        value: dashboardData.stats.activePatients,
        icon: <TeamOutlined style={{ color: '#388e3c' }} />,
        color: '#388e3c',
        suffix: 'bệnh nhân'
      },
      {
        title: 'Hoàn thành',
        value: dashboardData.stats.completedToday,
        icon: <CheckCircleOutlined style={{ color: '#f57c00' }} />,
        color: '#f57c00',
        suffix: 'buổi khám'
      },
      {
        title: 'Tái khám',
        value: dashboardData.stats.pendingFollowUps,
        icon: <ClockCircleOutlined style={{ color: '#7b1fa2' }} />,
        color: '#7b1fa2',
        suffix: 'lịch hẹn'
      }
    ];

    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stat-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.icon}
                valueStyle={{ color: stat.color, fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderTodaySchedule = () => {
    return (
      <Card 
        title={
          <Space>
            <CalendarOutlined />
            <span>Lịch hẹn ngày {selectedDate.format('DD/MM/YYYY')}</span>
            <Tag color="blue">{dashboardData.todayAppointments.length}</Tag>
          </Space>
        }
        extra={
          <Space>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              allowClear={false}
            />
            <Button type="link" icon={<EyeOutlined />}>
              Xem tất cả
            </Button>
          </Space>
        }
        className="schedule-card"
      >
        {dashboardData.todayAppointments.length === 0 ? (
          <Empty
            description="Không có lịch hẹn nào hôm nay"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={dashboardData.todayAppointments}
            renderItem={(appointment) => (
              <List.Item
                className="appointment-item"
                actions={[
                  <Button
                    type="primary"
                    size="small"
                    icon={<MedicineBoxOutlined />}
                    onClick={() => handleStartConsultation(appointment)}
                    disabled={appointment.status === 'Completed'}
                  >
                    {appointment.status === 'Completed' ? 'Đã khám' : 'Khám bệnh'}
                  </Button>,
                  <Button
                    type="default"
                    size="small"
                    icon={<EyeOutlined />}
                  >
                    Chi tiết
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="time-slot">
                      <Text strong>{appointment.timeSlot}</Text>
                    </div>
                  }
                  title={
                    <Space>
                      <Text strong>
                        {appointment.customerName || appointment.customer?.user?.fullName}
                      </Text>
                      <Tag color={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Tag>
                      <Tag icon={getAppointmentTypeIcon(appointment.type)}>
                        {appointment.type}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary">
                        📞 {appointment.customerPhone || appointment.customer?.user?.phone}
                      </Text>
                      {appointment.notes && (
                        <Text type="secondary">💬 {appointment.notes}</Text>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    );
  };



  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      {renderWelcomeHeader()}
      {renderStatsCards()}
      
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          {renderTodaySchedule()}
        </Col>
      </Row>

      {/* Consultation Modal */}
      <ConsultationModal
        visible={consultationModalVisible}
        onCancel={() => setConsultationModalVisible(false)}
        appointment={selectedAppointment}
        onSuccess={handleConsultationSuccess}
      />
    </div>
  );
};

export default DoctorDashboard; 