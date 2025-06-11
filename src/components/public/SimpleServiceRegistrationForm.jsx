import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, Button, Typography, Card, message, Divider, Row, Col, Skeleton, Result, Input } from "antd";
import { 
  CalendarOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/SimpleServiceRegistrationForm.css";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const SimpleServiceRegistrationForm = ({ service, visible, onClose, onRegistrationSuccess }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState({});

  // Lấy dữ liệu từ localStorage khi form được mở
  useEffect(() => {
    const savedData = localStorage.getItem("simpleServiceRegistrationFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
        // Chuyển đổi ngày từ string sang dayjs object
      if (parsedData.appointmentDate) {
        parsedData.appointmentDate = dayjs(parsedData.appointmentDate);
      }
      
      setFormData(parsedData);
      form.setFieldsValue(parsedData);
    }
  }, [form]);
  
  // Set loại dịch vụ từ props khi form được mở
  useEffect(() => {
    if (service && service.id) {
      const updatedFormData = { ...formData, serviceId: service.id };
      setFormData(updatedFormData);
      form.setFieldsValue({ serviceId: service.id });
      
      // Lưu vào localStorage ngay
      localStorage.setItem("simpleServiceRegistrationFormData", 
        JSON.stringify({ ...updatedFormData }));
    }
  }, [service, form]);
  
  // Lưu dữ liệu vào localStorage khi người dùng thay đổi form
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormValues = form.getFieldsValue();
        // Chuyển đổi các giá trị đặc biệt (như dayjs) sang định dạng có thể lưu trữ
      const dataToSave = { ...currentFormValues };
      if (dataToSave.appointmentDate) {
        dataToSave.appointmentDate = dataToSave.appointmentDate.format('YYYY-MM-DD');
      }
      
      localStorage.setItem("simpleServiceRegistrationFormData", JSON.stringify(dataToSave));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [form]);

  // Cập nhật formData khi người dùng nhập liệu
  const handleValuesChange = (changedValues, allValues) => {
    setFormData({ ...formData, ...changedValues });
      // Lưu vào localStorage khi người dùng thay đổi giá trị
    const dataToSave = { ...allValues };
    if (dataToSave.appointmentDate) {
      dataToSave.appointmentDate = dataToSave.appointmentDate.format('YYYY-MM-DD');
    }
    
    localStorage.setItem("simpleServiceRegistrationFormData", JSON.stringify(dataToSave));
  };

  // Effect để tải bác sĩ khi serviceId thay đổi
  useEffect(() => {
    const loadDoctorsByService = async () => {
      if (formData.serviceId) {
        try {
          setLoadingDoctors(true);
          // Import và sử dụng hàm service để lấy bác sĩ theo loại dịch vụ
          const { getDoctorsByService } = await import('../../services/serviceRegistration');
          const doctors = await getDoctorsByService(formData.serviceId);
          setAvailableDoctors(doctors);
        } catch (error) {
          console.error("Lỗi khi tải danh sách bác sĩ:", error);
        } finally {
          setLoadingDoctors(false);
        }
      }
    };
    
    loadDoctorsByService();
  }, [formData.serviceId]);

  // Xử lý đăng ký dịch vụ
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      
      // Import và sử dụng hàm service để đăng ký
      const { registerService } = await import('../../services/serviceRegistration');
      
      // Chuẩn bị dữ liệu form để gửi đi
      const submissionData = {
        ...form.getFieldsValue(),
        appointmentDate: form.getFieldValue('appointmentDate')?.format('YYYY-MM-DD'),
      };
      
      // Gọi API (hoặc service giả lập)
      const response = await registerService(submissionData);
      
      setLoading(false);
      
      // Xóa dữ liệu đã lưu sau khi đăng ký thành công
      localStorage.removeItem("simpleServiceRegistrationFormData");
      
      // Lưu lại thông tin đăng ký để hiển thị trang thành công
      setRegistrationData({
        ...submissionData,
        serviceName: service?.name || 'Dịch vụ đã chọn',
        doctorName: availableDoctors.find(doc => doc.id === submissionData.doctorId)?.name || 'Bác sĩ đã chọn',
      });
      
      // Chuyển sang trạng thái đã đăng ký
      setIsRegistered(true);
      
      // Thông báo cho component cha nếu callback tồn tại
      if (onRegistrationSuccess && typeof onRegistrationSuccess === 'function') {
        onRegistrationSuccess(response);
      }
    } catch (error) {
      setLoading(false);
      console.log("Lỗi khi đăng ký:", error);
      message.error("Đã xảy ra lỗi khi đăng ký dịch vụ");
    }
  };
  
  // Format cho các ngày không được chọn (những ngày trong quá khứ)
  const disabledDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < dayjs().startOf('day');
  };

  // Xử lý quay lại trang đăng ký (từ trang thành công)
  const handleRegisterAgain = () => {
    // Đặt lại form
    form.resetFields();
    setFormData({});
    setIsRegistered(false);
  };
  
  // Hiển thị trang thành công
  if (isRegistered) {
    return (
      <div className="simple-registration-container success-view">
        <Card className="registration-success-card">
          <Result
            status="success"
            icon={<CheckCircleOutlined className="success-icon" />}
            title="Đăng ký dịch vụ thành công!"
            subTitle="Chúng tôi đã tiếp nhận thông tin đăng ký của bạn và sẽ liên hệ sớm để xác nhận lịch hẹn."
          />
          
          <div className="registration-summary">
            <Divider />
            <Title level={5}>Thông tin đăng ký của bạn</Title>
            
            <Row gutter={[16, 16]} className="summary-info">
              <Col xs={24} sm={12}>
                <div className="info-item">
                  <MedicineBoxOutlined className="info-icon" />
                  <div>
                    <div className="info-label">Dịch vụ</div>
                    <div className="info-value">{registrationData.serviceName}</div>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div className="info-item">
                  <UserOutlined className="info-icon" />
                  <div>
                    <div className="info-label">Bác sĩ</div>
                    <div className="info-value">{registrationData.doctorName}</div>
                  </div>
                </div>
              </Col>
                <Col xs={24} sm={24}>
                <div className="info-item">
                  <CalendarOutlined className="info-icon" />
                  <div>
                    <div className="info-label">Ngày hẹn</div>
                    <div className="info-value">{registrationData.appointmentDate}</div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <Paragraph className="note">
              Trung tâm sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận lịch hẹn. Nếu cần thay đổi thông tin hoặc có thắc mắc, vui lòng liên hệ hotline: <a href="tel:0123456789">0123 456 789</a>
            </Paragraph>
              <div className="success-actions">
              <Button onClick={() => window.location.href = '/'}>
                Quay về trang chủ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="simple-registration-container">
      <Card className="simple-registration-card">
        <div className="registration-header">
          <MedicineBoxOutlined className="registration-icon" />
          <div className="registration-title">
            <Title level={4}>Đăng ký dịch vụ</Title>            <Text type="secondary">
              Vui lòng chọn bác sĩ và ngày hẹn phù hợp với lịch của bạn
            </Text>
          </div>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
          className="registration-form"
          initialValues={formData}
        >
          <div className="form-section">
            <Title level={5} className="section-title">
              <MedicineBoxOutlined /> Thông tin dịch vụ
            </Title>
            
            <Form.Item
              name="serviceId"
              label="Dịch vụ đăng ký"
              rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
            >
              <Select 
                placeholder="Chọn dịch vụ" 
                disabled={service && service.id ? true : false}
              >
                <Option value="ivf">Thụ tinh trong ống nghiệm (IVF)</Option>
                <Option value="icsi">Tiêm tinh trùng vào bào tương noãn (ICSI)</Option>
                <Option value="iui">Bơm tinh trùng vào buồng tử cung (IUI)</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="doctorId"
              label="Bác sĩ đăng ký khám"
              rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
              className="doctor-selection"
            >
              <div className="selection-description">
                <InfoCircleOutlined /> Chọn bác sĩ phù hợp với dịch vụ
              </div>
              
              {loadingDoctors ? (
                <div className="doctors-loading">
                  <Skeleton active avatar paragraph={{ rows: 1 }} />
                  <Skeleton active avatar paragraph={{ rows: 1 }} />
                  <Skeleton active avatar paragraph={{ rows: 1 }} />
                </div>
              ) : availableDoctors.length > 0 ? (
                <div className="doctor-cards">
                  {availableDoctors.map(doctor => (
                    <div 
                      key={doctor.id} 
                      className={`doctor-card ${formData.doctorId === doctor.id ? 'selected' : ''}`}
                      onClick={() => {
                        form.setFieldsValue({ doctorId: doctor.id });
                        handleValuesChange({ doctorId: doctor.id }, { ...formData, doctorId: doctor.id });
                      }}
                    >
                      <div className="doctor-image">
                        <img src={doctor.photo} alt={doctor.name} />
                      </div>
                      <div className="doctor-info">
                        <h3 className="doctor-name">{doctor.name}</h3>
                        <div className="doctor-specialty">{doctor.specialty}</div>
                        <p className="doctor-experience">{doctor.experience}</p>
                      </div>
                      {formData.doctorId === doctor.id && (
                        <div className="doctor-selected">
                          <CheckCircleOutlined />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : formData.serviceId ? (
                <div className="empty-doctors">
                  <InfoCircleOutlined />
                  <p>Không có bác sĩ nào phù hợp với dịch vụ này vào thời điểm hiện tại</p>
                </div>
              ) : (
                <div className="empty-doctors">
                  <InfoCircleOutlined />
                  <p>Vui lòng chọn dịch vụ trước để xem danh sách bác sĩ phù hợp</p>
                </div>
              )}
              <Input type="hidden" />
            </Form.Item>
          </div>
            <div className="form-section">
            <Title level={5} className="section-title">
              <CalendarOutlined /> Chọn ngày hẹn
            </Title>
            
            <Row gutter={24}>
              <Col xs={24} md={24}>
                <Form.Item
                  name="appointmentDate"
                  label="Ngày hẹn"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}
                >
                  <DatePicker 
                    format="DD/MM/YYYY" 
                    placeholder="Chọn ngày"
                    style={{ width: '100%' }}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="note"
              label="Ghi chú (nếu có)"
            >
              <Input.TextArea 
                placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)"
                rows={3}
              />
            </Form.Item>
          </div>
            <div className="form-actions">
            <Button onClick={() => window.location.href = '/userservice'}>
              Quay lại
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
            >
              Đặt lịch
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SimpleServiceRegistrationForm;
