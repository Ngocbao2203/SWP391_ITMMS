import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Alert, 
  Steps, 
  Space, 
  Divider,
  message 
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  MedicineBoxOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/BookAppointment.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const BookAppointment = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Mock data for services and available dates
  const dentalServices = [
    { id: 1, name: 'Khám tổng quát' },
    { id: 2, name: 'Tẩy trắng răng' },
    { id: 3, name: 'Nhổ răng khôn' },
    { id: 4, name: 'Trám răng' },
    { id: 5, name: 'Niềng răng' },
    { id: 6, name: 'Cạo vôi răng' },
    { id: 7, name: 'Chỉnh nha' },
    { id: 8, name: 'Phục hình răng' },
    { id: 9, name: 'Điều trị tủy răng' },
    { id: 10, name: 'Tư vấn chăm sóc răng miệng' },
  ];
  
  // Disabling past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // Proceed to the next step
  const nextStep = () => {
    form.validateFields()
      .then(values => {
        setCurrentStep(currentStep + 1);
        if (currentStep === 1) {
          setAppointmentDetails({
            ...values,
            requestedDate: values.requestedDate.format('YYYY-MM-DD'),
            requestedTime: values.requestedTime.format('HH:mm'),
          });
        }
      })
      .catch(error => {
        console.log('Validation failed:', error);
      });
  };

  // Go back to the previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);
    
    // Giả lập gọi API
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(currentStep + 1);
      message.success('Đặt lịch hẹn thành công! Yêu cầu của bạn đang chờ được xử lý.');
    }, 1500);
  };

  // Render specific step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="step-content">
            <Title level={4}>Chọn dịch vụ và lý do khám</Title>
            <Form.Item 
              name="service"
              label="Dịch vụ nha khoa"
              rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
            >
              <Select placeholder="Chọn dịch vụ nha khoa">
                {dentalServices.map(service => (
                  <Option key={service.id} value={service.name}>
                    {service.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="reason"
              label="Lý do khám"
              rules={[{ required: true, message: 'Vui lòng nhập lý do khám' }]}
            >
              <TextArea 
                rows={4}
                placeholder="Mô tả vấn đề của bạn (vd: đau răng, cần tư vấn niềng răng...)"
              />
            </Form.Item>
          </div>
        );
      case 1:
        return (
          <div className="step-content">
            <Title level={4}>Chọn ngày và giờ hẹn</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="requestedDate"
                  label="Ngày hẹn mong muốn"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    disabledDate={disabledDate}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày hẹn"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="requestedTime"
                  label="Giờ hẹn mong muốn"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ hẹn' }]}
                >
                  <TimePicker 
                    style={{ width: '100%' }}
                    format="HH:mm"
                    minuteStep={15}
                    placeholder="Chọn giờ hẹn"
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Alert
              message="Lưu ý về lịch hẹn"
              description="Thời gian bạn chọn là thời gian mong muốn. Quản lý sẽ xem xét và có thể điều chỉnh lịch hẹn dựa trên lịch trình của bác sĩ. Bạn sẽ nhận được thông báo nếu có thay đổi."
              type="info"
              showIcon
            />
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <Title level={4}>Xác nhận thông tin</Title>
            {appointmentDetails && (
              <Card className="confirmation-card">
                <div className="confirmation-item">
                  <Text strong>Dịch vụ:</Text>
                  <Text>{appointmentDetails.service}</Text>
                </div>
                <div className="confirmation-item">
                  <Text strong>Lý do khám:</Text>
                  <Text>{appointmentDetails.reason}</Text>
                </div>
                <div className="confirmation-item">
                  <Text strong>Ngày hẹn:</Text>
                  <Text>{dayjs(appointmentDetails.requestedDate).format('DD/MM/YYYY')}</Text>
                </div>
                <div className="confirmation-item">
                  <Text strong>Giờ hẹn:</Text>
                  <Text>{appointmentDetails.requestedTime}</Text>
                </div>
                <Divider />
                <Paragraph>
                  Vui lòng xác nhận thông tin trên là chính xác. Sau khi gửi yêu cầu, quản lý sẽ xem xét và 
                  phân công bác sĩ phù hợp cho bạn. Bạn sẽ nhận được thông báo khi lịch hẹn được xác nhận.
                </Paragraph>
              </Card>
            )}
          </div>
        );
      case 3:
        return (
          <div className="step-content success-step">
            <CheckCircleOutlined className="success-icon" />
            <Title level={3}>Đặt lịch hẹn thành công!</Title>
            <Paragraph>
              Yêu cầu đặt lịch hẹn của bạn đã được gửi thành công. Quản lý sẽ xem xét và phân công bác sĩ phù hợp. 
              Bạn sẽ nhận được thông báo khi lịch hẹn được xác nhận.
            </Paragraph>
            <Paragraph strong>
              Xin cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
            </Paragraph>
            <div className="action-buttons">
              <Button type="primary" onClick={() => window.location.href = '/profile'}>
                Xem lịch hẹn của tôi
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Quay lại trang chủ
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="book-appointment-container">
        <div className="book-appointment-header">
          <Title level={2}>Đặt lịch hẹn</Title>
          <Text>Vui lòng điền thông tin để đặt lịch hẹn với bác sĩ</Text>
        </div>
        
        <Card className="appointment-card">
          <Steps current={currentStep} className="appointment-steps">
            <Step title="Dịch vụ" icon={<MedicineBoxOutlined />} />
            <Step title="Lịch hẹn" icon={<CalendarOutlined />} />
            <Step title="Xác nhận" icon={<CheckCircleOutlined />} />
            <Step title="Hoàn tất" icon={<CheckCircleOutlined />} />
          </Steps>
          
          <Form
            form={form}
            layout="vertical"
            className="appointment-form"
          >
            {renderStepContent()}
            
            <div className="step-actions">
              {currentStep > 0 && currentStep < 3 && (
                <Button onClick={prevStep} style={{ marginRight: 8 }}>
                  Quay lại
                </Button>
              )}
              {currentStep < 2 && (
                <Button type="primary" onClick={nextStep}>
                  Tiếp tục
                </Button>
              )}
              {currentStep === 2 && (
                <Button 
                  type="primary" 
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Xác nhận đặt lịch
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BookAppointment;
