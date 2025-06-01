import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, Button, Steps, Row, Col, Typography, Radio, message, Modal, Checkbox, Tooltip, Divider, Upload } from "antd";
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HomeOutlined,
  IdcardOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  UploadOutlined,
  LockOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/ServiceRegistrationForm.css";

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const ServiceRegistrationForm = ({ service, visible, onClose }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  
  // Lấy dữ liệu từ localStorage khi form được mở
  useEffect(() => {
    const savedData = localStorage.getItem("serviceRegistrationFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Chuyển đổi ngày từ string sang dayjs object cho DatePicker
      if (parsedData.appointmentDate) {
        parsedData.appointmentDate = dayjs(parsedData.appointmentDate);
      }
      
      setFormData(parsedData);
      form.setFieldsValue(parsedData);
    }
  }, [form]);
  
  // Lưu dữ liệu vào localStorage khi người dùng thay đổi form
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormValues = form.getFieldsValue();
      
      // Chuyển đổi các giá trị đặc biệt (như dayjs) sang định dạng có thể lưu trữ
      const dataToSave = { ...currentFormValues };
      if (dataToSave.appointmentDate) {
        dataToSave.appointmentDate = dataToSave.appointmentDate.format();
      }
      
      localStorage.setItem("serviceRegistrationFormData", JSON.stringify(dataToSave));
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
      dataToSave.appointmentDate = dataToSave.appointmentDate.format();
    }
    localStorage.setItem("serviceRegistrationFormData", JSON.stringify(dataToSave));
  };

  const nextStep = async () => {
    try {
      await form.validateFields(getFieldsForCurrentStep());
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return ["fullName", "phoneNumber", "email", "gender", "dateOfBirth", "address"];
      case 1:
        return ["previousTreatments", "infertilityDuration"];
      case 2:
        return ["serviceType", "appointmentDate", "preferredTime"];
      default:
        return [];
    }
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      
      // Mô phỏng gửi dữ liệu lên server
      setTimeout(() => {
        setLoading(false);
        message.success("Đăng ký dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.");
        
        // Xóa dữ liệu đã lưu sau khi đăng ký thành công
        localStorage.removeItem("serviceRegistrationFormData");
        
        // Đặt lại form và đóng modal
        form.resetFields();
        onClose();
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.log("Submit failed:", error);
      message.error("Đã có lỗi xảy ra khi đăng ký dịch vụ");
    }
  };
  const steps = [
    {
      title: "Thông tin cá nhân",
      icon: <UserOutlined />,
      content: (
        <div className="form-step-container">
          <div className="step-header">
            <MedicineBoxOutlined className="step-icon" />
            <div className="step-title">
              <Title level={4}>Thông tin cá nhân</Title>
              <Text type="secondary">Vui lòng cung cấp thông tin cá nhân chính xác để phục vụ quá trình điều trị</Text>
            </div>
          </div>
            <Divider />
          
          <div className="form-group">
            <Title level={5}><UserOutlined /> Thông tin cá nhân chính</Title>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                >
                  <Radio.Group>
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                    <Radio value="other">Khác</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={24}>              <Col xs={24} md={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Ngày sinh"
                  rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                >
                  <DatePicker 
                    format="DD/MM/YYYY" 
                    placeholder="Chọn ngày sinh"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="occupation"
                  label="Nghề nghiệp"
                >
                  <Input placeholder="Nghề nghiệp hiện tại của bạn" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          
          <div className="form-group">
            <Title level={5}><PhoneOutlined /> Thông tin liên hệ</Title>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^(0[0-9]{9,10})$/, message: "Số điện thoại không hợp lệ" }
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="0912345678" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="example@email.com" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input prefix={<HomeOutlined />} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
            </Form.Item>
          </div>
            <div className="form-section-separator">
            <HeartOutlined className="separator-icon" />
            <Text type="secondary" className="separator-text">Thông tin bổ sung sẽ giúp chúng tôi phục vụ bạn tốt hơn</Text>
          </div>
            <div className="form-group">
            <Title level={5}><InfoCircleOutlined /> Thông tin bổ sung</Title>
            <Form.Item
              name="emergencyContact"
              label="Người liên hệ khẩn cấp"
            >
              <Input placeholder="Tên và số điện thoại" />
            </Form.Item>
          </div>
        </div>
      )
    },
    {
      title: "Thông tin y tế",
      icon: <MedicineBoxOutlined />,
      content: (
        <div className="form-step-container">
          <div className="step-header">
            <FileTextOutlined className="step-icon" />
            <div className="step-title">
              <Title level={4}>Thông tin y tế</Title>
              <Text type="secondary">Các thông tin y tế giúp bác sĩ đánh giá toàn diện tình trạng hiếm muộn</Text>
            </div>
          </div>
            <Divider />
          
          <div className="form-group">
            <Title level={5}><MedicineBoxOutlined /> Thông tin bệnh lý</Title>            <Form.Item
              name="medicalHistory"
              label="Tiền sử bệnh"
            >
              <TextArea
                rows={4}
                placeholder="Vui lòng liệt kê các bệnh lý đã và đang mắc phải (tim mạch, tiểu đường, huyết áp...)"
              />
            </Form.Item>
            
            <Form.Item
              name="allergyHistory"
              label="Dị ứng"
            >
              <TextArea
                rows={2}
                placeholder="Liệt kê các loại thuốc, thực phẩm hoặc chất gây dị ứng (nếu có)"
              />
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Title level={5}><FileTextOutlined /> Thông tin điều trị hiếm muộn</Title>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="previousTreatments"
                  label="Điều trị hiếm muộn trước đây"
                  rules={[{ required: true, message: "Vui lòng chọn phương pháp điều trị" }]}
                >
                  <Select placeholder="Chọn phương pháp đã thử">
                    <Option value="none">Chưa từng</Option>
                    <Option value="medication">Điều trị bằng thuốc</Option>
                    <Option value="iui">Bơm tinh trùng (IUI)</Option>
                    <Option value="ivf">Thụ tinh trong ống nghiệm (IVF)</Option>
                    <Option value="icsi">Tiêm tinh trùng vào bào tương (ICSI)</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="infertilityDuration"
                  label="Thời gian hiếm muộn"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian hiếm muộn" }]}
                >
                  <Select placeholder="Chọn khoảng thời gian">
                    <Option value="0-1">Dưới 1 năm</Option>
                    <Option value="1-3">1-3 năm</Option>
                    <Option value="3-5">3-5 năm</Option>
                    <Option value=">5">Trên 5 năm</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
          
          <div className="form-group">
            <Title level={5}><PaperClipOutlined /> Tài liệu y tế</Title>
            <Form.Item
              name="medicalDocuments"
              label="Tài liệu y tế (nếu có)"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload 
                name="files" 
                listType="text"
                beforeUpload={() => false} // Prevent actual upload
                multiple
                className="medical-upload"
              >
                <Button icon={<UploadOutlined />} type="dashed" style={{ width: '100%', height: '60px' }}>
                  <div>
                    <div style={{ marginBottom: '5px' }}>Tải lên kết quả khám, xét nghiệm</div>
                    <Text type="secondary" className="upload-hint">Hỗ trợ: JPG, PNG, PDF (tối đa 5MB)</Text>
                  </div>
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </div>
      )
    },
    {
      title: "Thông tin dịch vụ",
      icon: <CalendarOutlined />,
      content: (
        <div className="form-step-container">
          <div className="step-header">
            <CalendarOutlined className="step-icon" />
            <div className="step-title">
              <Title level={4}>Đăng ký dịch vụ</Title>
              <Text type="secondary">Chọn dịch vụ và thời gian phù hợp với nhu cầu của bạn</Text>
            </div>
          </div>
            <Divider />
          
          <div className="form-group">
            <Title level={5}><MedicineBoxOutlined /> Chọn dịch vụ điều trị</Title>
            <Form.Item
              name="serviceType"
              label={
                <span>
                  Dịch vụ điều trị&nbsp;
                  <Tooltip title="Chọn dịch vụ điều trị phù hợp hoặc để bác sĩ tư vấn">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
              initialValue={service?.type || ""}
              rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
            >
              <Radio.Group className="service-radio-group">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Radio.Button value="IVF" className="service-radio-button">
                      <div className="service-option">
                        <div className="service-icon">🧪</div>
                        <div className="service-details">
                          <div className="service-title">Thụ tinh trong ống nghiệm (IVF)</div>
                          <div className="service-desc">Phương pháp điều trị hiệu quả cao</div>
                        </div>
                      </div>
                    </Radio.Button>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Radio.Button value="ICSI" className="service-radio-button">
                      <div className="service-option">
                        <div className="service-icon">🔬</div>
                        <div className="service-details">
                          <div className="service-title">Tiêm tinh trùng vào bào tương (ICSI)</div>
                          <div className="service-desc">Phù hợp với yếu tố nam</div>
                        </div>
                      </div>
                    </Radio.Button>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Radio.Button value="IUI" className="service-radio-button">
                      <div className="service-option">
                        <div className="service-icon">💉</div>
                        <div className="service-details">
                          <div className="service-title">Bơm tinh trùng vào buồng tử cung (IUI)</div>
                          <div className="service-desc">Phương pháp ít xâm lấn</div>
                        </div>
                      </div>
                    </Radio.Button>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Radio.Button value="CONSULT" className="service-radio-button">
                      <div className="service-option">
                        <div className="service-icon">👨‍⚕️</div>
                        <div className="service-details">
                          <div className="service-title">Tư vấn với bác sĩ chuyên khoa</div>
                          <div className="service-desc">Đánh giá và lên phương án điều trị</div>
                        </div>
                      </div>
                    </Radio.Button>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Title level={5}><CalendarOutlined /> Thông tin lịch hẹn</Title>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="appointmentDate"
                  label="Ngày hẹn mong muốn"
                  rules={[{ required: true, message: "Vui lòng chọn ngày hẹn" }]}
                >
                  <DatePicker 
                    format="DD/MM/YYYY" 
                    placeholder="Chọn ngày hẹn"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="preferredTime"
                  label="Thời gian mong muốn"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
                >
                  <Select placeholder="Chọn khung giờ">
                    <Option value="morning">Sáng (8:00 - 11:30)</Option>
                    <Option value="afternoon">Chiều (13:30 - 16:30)</Option>
                    <Option value="evening">Tối (18:00 - 20:00)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="preferredDoctor"
              label="Bác sĩ mong muốn khám"
            >
              <Select placeholder="Chọn bác sĩ">
                <Option value="">Không chỉ định</Option>
                <Option value="doctor1">TS.BS Nguyễn Văn A - Chuyên khoa Hiếm muộn</Option>
                <Option value="doctor2">PGS.TS Trần Thị B - Chuyên khoa Nội tiết sinh sản</Option>
                <Option value="doctor3">BS.CKII Lê Văn C - Chuyên khoa Nam học</Option>
              </Select>
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Title level={5}><FileTextOutlined /> Thông tin bổ sung</Title>
            <Form.Item
              name="additionalRequests"
              label="Yêu cầu đặc biệt (nếu có)"
            >
              <TextArea
                rows={3}
                placeholder="Vui lòng cho chúng tôi biết nếu bạn có yêu cầu đặc biệt"
              />
            </Form.Item>
            
            <Form.Item
              name="referralSource"
              label="Bạn biết đến dịch vụ của chúng tôi qua đâu?"
            >
              <Select placeholder="Chọn nguồn thông tin">
                <Option value="internet">Tìm kiếm trên internet</Option>
                <Option value="social">Mạng xã hội</Option>
                <Option value="friend">Người quen giới thiệu</Option>
                <Option value="doctor">Bác sĩ giới thiệu</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
      )
    },
    {
      title: "Xác nhận",
      icon: <FileTextOutlined />,
      content: (
        <div className="confirmation-step">          <div className="step-header">
            <FileTextOutlined className="step-icon" />
            <div className="step-title">
              <Title level={4}>Xác nhận thông tin</Title>
              <Text type="secondary">Vui lòng kiểm tra kỹ thông tin trước khi gửi đăng ký</Text>
            </div>
          </div>
          
          <Divider />
          
          <div className="confirmation-container">
            <div className="confirmation-section">
              <Title level={5}><UserOutlined /> Thông tin cá nhân</Title>
              <Row gutter={[16, 8]}>                <Col xs={24} md={12}>                  <div className="info-item">
                    <span className="info-label"><span className="required-badge">*</span> <UserOutlined /> Họ và tên:</span>
                    <span className="info-value">{formData.fullName}</span>
                  </div>
                </Col>                <Col xs={24} md={12}>
                  <div className="info-item">
                    <span className="info-label"><IdcardOutlined /> Nghề nghiệp:</span>
                    <span className="info-value">{formData.occupation}</span>
                  </div>
                </Col>
                <Col xs={24} md={12}>                  <div className="info-item">
                    <span className="info-label"><span className="required-badge">*</span> <PhoneOutlined /> Số điện thoại:</span>
                    <span className="info-value">{formData.phoneNumber}</span>
                  </div>
                </Col>
                <Col xs={24} md={12}>                  <div className="info-item">
                    <span className="info-label"><span className="required-badge">*</span> <MailOutlined /> Email:</span>
                    <span className="info-value">{formData.email}</span>
                  </div>
                </Col>                <Col xs={24} md={12}>                  <div className="info-item">
                    <span className="info-label"><span className="required-badge">*</span> <CalendarOutlined /> Ngày sinh:</span>
                    <span className="info-value">
                      {formData.dateOfBirth ? formData.dateOfBirth.format("DD/MM/YYYY") : ""}
                    </span>
                  </div>
                </Col>
                <Col xs={24} md={12}>                  <div className="info-item">
                    <span className="info-label"><span className="required-badge">*</span> Giới tính:</span>
                    <span className="info-value">
                      {formData.gender === "male" ? "Nam" : formData.gender === "female" ? "Nữ" : "Khác"}
                    </span>
                  </div>
                </Col>
                <Col span={24}>                  <div className="info-item">
                    <span className="info-label"><span className="required-badge">*</span> <HomeOutlined /> Địa chỉ:</span>
                    <span className="info-value">{formData.address}</span>
                  </div>
                </Col>
              </Row>
            </div>
              <Divider dashed />
            
            <div className="confirmation-section">
              <Title level={5}><MedicineBoxOutlined /> Thông tin y tế</Title>
              <Row gutter={[16, 8]}>                {formData.medicalHistory && (
                  <Col span={24}>
                    <div className="info-item">
                      <span className="info-label">Tiền sử bệnh:</span>
                      <span className="info-value">{formData.medicalHistory}</span>
                    </div>
                  </Col>
                )}
                {formData.allergyHistory && (
                  <Col span={24}>
                    <div className="info-item">
                      <span className="info-label">Dị ứng:</span>
                      <span className="info-value">{formData.allergyHistory}</span>
                    </div>
                  </Col>
                )}                {formData.previousTreatments && (
                  <Col xs={24} md={12}>                    <div className="info-item">
                      <span className="info-label"><span className="required-badge">*</span> Điều trị trước đây:</span>
                      <span className="info-value">{formData.previousTreatments}</span>
                    </div>
                  </Col>
                )}
                {formData.infertilityDuration && (
                  <Col xs={24} md={12}>                    <div className="info-item">
                      <span className="info-label"><span className="required-badge">*</span> Thời gian hiếm muộn:</span>
                      <span className="info-value">{formData.infertilityDuration}</span>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
              <Divider dashed />
            
            <div className="confirmation-section">
              <Title level={5}><CalendarOutlined /> Thông tin đăng ký dịch vụ</Title>
              <Row gutter={[16, 8]}>                <Col xs={24} md={12}>
                  <div className="info-item">
                    <span className="info-label">Dịch vụ: <span className="required-badge">*</span></span>
                    <span className="info-value highlight-text">
                      {formData.serviceType === "IVF" && "Thụ tinh trong ống nghiệm (IVF)"}
                      {formData.serviceType === "ICSI" && "Tiêm tinh trùng vào bào tương (ICSI)"}
                      {formData.serviceType === "IUI" && "Bơm tinh trùng vào buồng tử cung (IUI)"}
                      {formData.serviceType === "CONSULT" && "Tư vấn với bác sĩ chuyên khoa"}
                    </span>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="info-item">
                    <span className="info-label">Thời gian: <span className="required-badge">*</span></span>
                    <span className="info-value highlight-text">
                      {formData.appointmentDate ? formData.appointmentDate.format("DD/MM/YYYY") : ""}, 
                      {formData.preferredTime === "morning" && " Sáng (8:00 - 11:30)"}
                      {formData.preferredTime === "afternoon" && " Chiều (13:30 - 16:30)"}
                      {formData.preferredTime === "evening" && " Tối (18:00 - 20:00)"}
                    </span>
                  </div>
                </Col>
                {formData.preferredDoctor && (
                  <Col span={24}>
                    <div className="info-item">
                      <span className="info-label">Bác sĩ chỉ định:</span>
                      <span className="info-value">{formData.preferredDoctor}</span>
                    </div>
                  </Col>
                )}
                {formData.additionalRequests && (
                  <Col span={24}>
                    <div className="info-item">
                      <span className="info-label">Yêu cầu đặc biệt:</span>
                      <span className="info-value">{formData.additionalRequests}</span>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
          
          <div className="privacy-section">
            <Form.Item
              name="privacyAgreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản bảo mật')),
                },
              ]}
            >              <Checkbox onChange={(e) => setPrivacyChecked(e.target.checked)}>
                Tôi đồng ý với <button type="button" onClick={() => message.info("Điều khoản bảo mật hiện đang được cập nhật")} className="privacy-link">điều khoản bảo mật</button> và cho phép phòng khám sử dụng thông tin của tôi cho mục đích điều trị
              </Checkbox>
            </Form.Item>
              <div className="security-notice">
              <LockOutlined className="security-icon" />
              <div className="security-text">
                <Text strong>Bảo mật thông tin</Text>
                <Text type="secondary">Thông tin của bạn được mã hóa và bảo mật theo quy định pháp luật</Text>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  return (
    <Modal
      title={null} // Xóa title mặc định để dùng header tùy chỉnh
      open={visible}
      onCancel={onClose}
      width={900}
      footer={null}
      className="service-registration-modal"
      centered
    >      <div className="service-registration-header">
        <div className="header-content">
          <MedicineBoxOutlined className="header-icon" />
          <div className="header-text">
            <div className="header-title">Đăng ký dịch vụ điều trị hiếm muộn</div>
            <div className="header-subtitle">{service?.title || "Hỗ trợ hành trình làm cha mẹ của bạn"}</div>
          </div>
        </div>
        <div className="header-note">
          <span className="required-indicator">*</span> <span>Các trường bắt buộc</span>
        </div>
      </div>
      
      <div className="service-registration-form">
        <Steps current={currentStep} className="registration-steps">
          {steps.map((step, index) => (
            <Step 
              key={step.title} 
              title={step.title} 
              icon={step.icon}
              status={
                currentStep > index 
                  ? 'finish' 
                  : currentStep === index 
                  ? 'process' 
                  : 'wait'
              }
            />
          ))}
        </Steps>

        <div className="steps-content">
          <Form
            form={form}
            layout="vertical"
            initialValues={formData}
            onValuesChange={handleValuesChange}
            requiredMark="optional"
          >
            {steps[currentStep].content}
          </Form>
        </div>

        <div className="steps-action">
          {currentStep > 0 && (
            <Button 
              onClick={prevStep}
              icon={<span className="btn-back-icon">←</span>}
              className="btn-back"
            >
              Quay lại
            </Button>
          )}
          
          {currentStep < steps.length - 1 && (
            <Button 
              type="primary" 
              onClick={nextStep}
              className="btn-next"
            >
              Bước tiếp theo
              <span className="btn-next-icon">→</span>
            </Button>
          )}
          
          {currentStep === steps.length - 1 && (
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              loading={loading}
              disabled={!privacyChecked}
              className="btn-submit"
              icon={<FileTextOutlined />}
            >
              Hoàn tất đăng ký
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ServiceRegistrationForm;