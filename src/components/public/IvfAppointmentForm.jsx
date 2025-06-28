import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, DatePicker, Input, Button, message, Row, Col } from 'antd';
import { CalendarOutlined, CheckCircleFilled, InfoCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  treatmentService, 
  doctorService, 
  appointmentService, 
  authService, 
  formatErrorMessage 
} from '../../services';
import '../../styles/IvfAppointmentForm.css';

const { Option } = Select;
const { TextArea } = Input;

const IvfAppointmentForm = ({ service, onRegistrationSuccess, onSubmitting }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Load services and doctors from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesData, doctorsData] = await Promise.all([
          treatmentService.getAllTreatmentServices(),
          doctorService.getAvailableDoctors()
        ]);

        setServices(servicesData.services || []);
        setDoctors(doctorsData.doctors || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
        message.error(formatErrorMessage(error));
      }
    };

    loadInitialData();
  }, []);

  // Khởi tạo form với dịch vụ được chọn (nếu có)
  useEffect(() => {
    if (service?.id) {
      form.setFieldsValue({
        serviceId: service.id,
        treatmentServiceId: service.id
      });
    }
  }, [service, form]);
    // Xử lý chọn hoặc bỏ chọn bác sĩ
  const handleDoctorSelect = (doctorId) => {
    // Nếu click vào bác sĩ đã chọn, hủy chọn
    if (selectedDoctor === doctorId) {
      setSelectedDoctor(null);
      form.setFieldsValue({
        doctorId: undefined
      });
    } else {
      // Nếu click vào bác sĩ khác, chọn bác sĩ đó
      setSelectedDoctor(doctorId);
      form.setFieldsValue({
        doctorId
      });
    }
  };
  
  // Hàm kiểm tra ngày đã qua
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };
  
  // Xử lý gửi form
  const handleSubmit = async (values) => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      message.error('Vui lòng đăng nhập để đặt lịch hẹn');
      return;
    }

    if (onSubmitting) {
      onSubmitting();
    }
    
    setLoading(true);
    
    try {
      // Format dữ liệu để gửi đi
      const appointmentData = {
        doctorId: values.doctorId,
        treatmentPlanId: null, // Will be set later if needed
        appointmentDate: values.appointmentDate.format('YYYY-MM-DDTHH:mm:ss'),
        timeSlot: values.timeSlot,
        type: 'Consultation', // Default type
        notes: values.notes || ''
      };
      
      console.log('Booking appointment with data:', appointmentData);
      
      // Gọi API đặt lịch hẹn
      const result = await appointmentService.bookAppointment(appointmentData);
      
      if (result.success) {
      // Xử lý thành công
      setIsSuccess(true);
        message.success('Đặt lịch hẹn thành công!');
      
      // Thông báo cho component cha
      if (onRegistrationSuccess) {
          onRegistrationSuccess(result.data);
        }
      } else {
        message.error(result.message);
        // Hiển thị validation errors nếu có
        if (result.errors) {
          Object.keys(result.errors).forEach(field => {
            const errorMessages = result.errors[field];
            errorMessages.forEach(msg => {
              message.error(`${field}: ${msg}`);
            });
          });
        }
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      message.error(formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  
  // Hiển thị màn hình thành công
  if (isSuccess) {
    return (
      <div className="ivf-appointment-form">
        <div className="ivf-form-header">
          <CheckCircleFilled className="ivf-form-header-icon" />
          <div className="ivf-form-title">Đặt lịch thành công</div>
        </div>
        <div className="ivf-success-message">
          <CheckCircleFilled className="ivf-success-icon" />
          <h3 className="ivf-success-title">Đặt lịch hẹn thành công!</h3>
          <p className="ivf-success-text">
            Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ để xác nhận lịch hẹn trong thời gian sớm nhất.
          </p>
          <p className="ivf-success-note">
            Bạn có thể xem lịch hẹn của mình trong mục "Lịch hẹn" ở trang cá nhân.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ivf-appointment-form">
      <div className="ivf-form-header">
        <InfoCircleOutlined className="ivf-form-header-icon" />
        <div className="ivf-form-title">Thông tin đặt lịch hẹn</div>
      </div>
      
      <div className="ivf-form-content">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              {/* Step 1: Chọn dịch vụ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">1</div>
                  <h3 className="ivf-form-step-title">Dịch vụ điều trị</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item
                    name="treatmentServiceId"
                    rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
                  >
                    <Select 
                      placeholder="Chọn dịch vụ điều trị" 
                      className="ivf-service-select"
                      disabled={service?.id ? true : false}
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {services.map(s => (
                        <Option key={s.id} value={s.id}>
                          {s.serviceName} - {s.basePrice?.toLocaleString('vi-VN')} VNĐ
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Col>
            
            <Col xs={24}>
              {/* Step 2: Chọn bác sĩ */}
              <div className="ivf-form-section">                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">2</div>
                  <h3 className="ivf-form-step-title">Bác sĩ đăng ký khám (tùy chọn)</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item
                    name="doctorId"
                  >
                    <Input type="hidden" />
                  </Form.Item>
                  <p className="ivf-optional-text">Bạn có thể chọn một bác sĩ cụ thể hoặc để trống để chúng tôi sắp xếp bác sĩ phù hợp.</p>
                    <div className="ivf-doctor-grid">
                    {doctors.map(doctor => (
                      <div 
                        key={doctor.id} 
                        className={`ivf-doctor-card ${selectedDoctor === doctor.id ? 'selected' : ''}`}
                        onClick={() => handleDoctorSelect(doctor.id)}
                      >
                        <div className="ivf-doctor-avatar">
                          <img src={doctor.photo} alt={doctor.name} />
                          {selectedDoctor === doctor.id && <div className="ivf-doctor-selected-indicator">✓</div>}
                        </div>
                        <h4 className="ivf-doctor-name">{doctor.name}</h4>
                        <p className="ivf-doctor-specialty">{doctor.specialization}</p>
                        <div className="ivf-doctor-rating">
                          ⭐ {doctor.averageRating?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="ivf-doctor-experience">
                          {doctor.experienceYears} năm kinh nghiệm
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ivf-selection-status">
                    {selectedDoctor ? `Đã chọn bác sĩ: ${doctors.find(d => d.id === selectedDoctor)?.name}` : 'Chưa chọn bác sĩ nào'}
                    {selectedDoctor && <Button 
                      type="link" 
                      className="ivf-clear-selection" 
                      onClick={() => handleDoctorSelect(selectedDoctor)}
                    >
                      Bỏ chọn
                    </Button>}
                  </div>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              {/* Step 3: Chọn ngày hẹn */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">3</div>
                  <h3 className="ivf-form-step-title">Chọn ngày</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item
                    name="appointmentDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}
                  >
                    <DatePicker
                      className="ivf-date-picker"
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày hẹn"
                      disabledDate={disabledDate}
                      // onChange={handleDateChange}
                      suffixIcon={<CalendarOutlined style={{ color: '#6064e3' }} />}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              {/* Step 4: Chọn giờ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">4</div>
                  <h3 className="ivf-form-step-title">Chọn giờ</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item
                    name="timeSlot"
                    rules={[{ required: true, message: 'Vui lòng chọn khung giờ' }]}
                  >
                    <Select
                      placeholder="Chọn khung giờ"
                      className="ivf-time-select"
                      loading={loadingTimeSlots}
                      disabled={!selectedDoctor || !selectedDate}
                      suffixIcon={<ClockCircleOutlined style={{ color: '#6064e3' }} />}
                    >
                      {availableTimeSlots.map(timeSlot => (
                        <Option key={timeSlot} value={timeSlot}>
                          {timeSlot}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {(!selectedDoctor || !selectedDate) && (
                    <p style={{ color: '#999', fontSize: '12px' }}>
                      Vui lòng chọn bác sĩ và ngày trước khi chọn giờ
                    </p>
                  )}
                </div>
              </div>
            </Col>

            <Col xs={24}>
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">5</div>
                  <h3 className="ivf-form-step-title">Ghi chú</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item name="notes" label="Ghi chú (tùy chọn)">
                    <TextArea
                      className="ivf-notes-textarea"
                      placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)"
                      rows={3}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Submit button */}
          <Button 
            type="primary" 
            htmlType="submit" 
            className="ivf-form-submit-btn" 
            loading={loading}
            disabled={!selectedDoctor || !selectedDate || availableTimeSlots.length === 0}
          >
            ĐẶT LỊCH HẸN NGAY
          </Button>
          
          <div className="ivf-disclaimer">
            Bằng cách nhấn nút đặt lịch, bạn đồng ý với điều khoản và chính sách bảo mật của chúng tôi
          </div>
        </Form>
      </div>
    </div>
  );
};

export default IvfAppointmentForm;
