import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Input, Button, message, Row, Col } from 'antd';
import { CalendarOutlined, CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import '../../styles/IvfAppointmentForm.css';

const { Option } = Select;
const { TextArea } = Input;

const IvfAppointmentForm = ({ service, onRegistrationSuccess, onSubmitting }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);  const [services, setServices] = useState([
    { id: 'ivf', name: 'Thụ tinh trong ống nghiệm (IVF)' },
    { id: 'icsi', name: 'Tiêm tinh trùng vào bào tương noãn (ICSI)' },
    { id: 'iui', name: 'Bơm tinh trùng vào buồng tử cung (IUI)' },
  ]);
  
  const [doctors, setDoctors] = useState([
    { 
      id: 1, 
      name: 'Dr. Nguyễn', 
      specialty: 'Chuyên khoa Sản Phụ khoa',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    { 
      id: 2, 
      name: 'Dr. Lê Văn Cường', 
      specialty: 'Chuyên khoa IVF',
      photo: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    { 
      id: 3, 
      name: 'Dr. Phạm Thu Dung', 
      specialty: 'Chuyên khoa hỗ trợ sinh sản',
      photo: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ]);
  // Khởi tạo form với dịch vụ được chọn (nếu có)
  useEffect(() => {
    if (service?.id) {
      form.setFieldsValue({
        serviceId: service.id
      });
    }
  }, [service, form]);
  
  // Xử lý chọn bác sĩ
  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
    form.setFieldsValue({
      doctorId
    });
  };
  
  // Hàm kiểm tra ngày đã qua
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };
  
  // Xử lý gửi form
  const handleSubmit = async (values) => {
    if (onSubmitting) {
      onSubmitting();
    }
    
    setLoading(true);
    
    try {
      // Giả lập gọi API đăng ký
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Format dữ liệu để gửi đi
      const formattedData = {
        ...values,
        appointmentDate: values.appointmentDate?.format('YYYY-MM-DD')
      };
      
      console.log('Form data submitted:', formattedData);
      
      // Xử lý thành công
      setIsSuccess(true);
      message.success('Đăng ký dịch vụ thành công!');
      
      // Thông báo cho component cha
      if (onRegistrationSuccess) {
        onRegistrationSuccess(formattedData);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      message.error('Đã xảy ra lỗi, vui lòng thử lại');
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
          <div className="ivf-form-title">Đăng ký thành công</div>
        </div>
        <div className="ivf-success-message">
          <CheckCircleFilled className="ivf-success-icon" />
          <h3 className="ivf-success-title">Đăng ký dịch vụ thành công!</h3>
          <p className="ivf-success-text">
            Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ để xác nhận lịch hẹn trong thời gian sớm nhất.
          </p>
        </div>
      </div>
    );
  }    return (
    <div className="ivf-appointment-form">
      <div className="ivf-form-header">
        <InfoCircleOutlined className="ivf-form-header-icon" />
        <div className="ivf-form-title">Thông tin dịch vụ</div>
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
                  <h3 className="ivf-form-step-title">Dịch vụ đăng ký</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item
                    name="serviceId"
                    rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
                  >
                    <Select 
                      placeholder="Chọn dịch vụ" 
                      className="ivf-service-select"
                      disabled={service?.id ? true : false}
                    >
                      {services.map(service => (
                        <Option key={service.id} value={service.id}>
                          {service.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Col>
            
            <Col xs={24}>
              {/* Step 2: Chọn bác sĩ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">2</div>
                  <h3 className="ivf-form-step-title">Bác sĩ đăng ký khám</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item
                    name="doctorId"
                    rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
                  >
                    <Input type="hidden" />
                  </Form.Item>
                  
                  <div className="ivf-doctor-grid">
                    {doctors.map(doctor => (
                      <div 
                        key={doctor.id} 
                        className={`ivf-doctor-card ${selectedDoctor === doctor.id ? 'selected' : ''}`}
                        onClick={() => handleDoctorSelect(doctor.id)}
                      >
                        <div className="ivf-doctor-avatar">
                          <img src={doctor.photo} alt={doctor.name} />
                        </div>
                        <h4 className="ivf-doctor-name">{doctor.name}</h4>
                        <p className="ivf-doctor-specialty">{doctor.specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              {/* Step 3: Chọn ngày hẹn */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">3</div>
                  <h3 className="ivf-form-step-title">Chọn ngày hẹn</h3>
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
                      suffixIcon={<CalendarOutlined style={{ color: '#6064e3' }} />}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">4</div>
                  <h3 className="ivf-form-step-title">Thông tin khác</h3>
                </div>
                
                <div className="ivf-form-control">
                  <Form.Item name="notes" label="Ghi chú (nếu có)">
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
          >
            ĐẶT LỊCH NGAY
          </Button>
          
          <div className="ivf-disclaimer">
            Bằng cách nhấn nút đăng ký, bạn đồng ý với <a href="#">điều khoản</a> và <a href="#">chính sách bảo mật</a> của chúng tôi
          </div>
        </Form>
      </div>
    </div>
  );
};

export default IvfAppointmentForm;
