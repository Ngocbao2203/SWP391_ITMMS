import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Select,
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  Spin,
  Radio,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  treatmentService,
  doctorService,
  appointmentService,
  authService,
  formatErrorMessage,
} from "../../services";
import "../../styles/IvfAppointmentForm.css";

const { Option } = Select;
const { TextArea } = Input;

// Ảnh mặc định tránh lỗi mạng
const DEFAULT_AVATAR = "https://placehold.co/100x100?text=Doctor";

const IvfAppointmentForm = ({
  service,
  onRegistrationSuccess,
  onSubmitting,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [hasTreatmentPlan, setHasTreatmentPlan] = useState(null);

  // Tải dữ liệu ban đầu
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoadingServices(true);
        setIsLoadingDoctors(true);

        const [servicesData, doctorsData] = await Promise.all([
          treatmentService.getAllTreatmentServices(),
          doctorService.getAllDoctors(),
        ]);

        setServices(
          Array.isArray(servicesData)
            ? servicesData
            : servicesData?.services || servicesData?.data || []
        );

        setDoctors(
          Array.isArray(doctorsData)
            ? doctorsData
            : doctorsData?.doctors || doctorsData?.data || []
        );
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        toast.error(formatErrorMessage(error));
      } finally {
        setIsLoadingServices(false);
        setIsLoadingDoctors(false);
      }
    };

    loadInitialData();
  }, []);

  // Khởi tạo form với dịch vụ
  useEffect(() => {
    if (service?.id) {
      form.setFieldsValue({
        serviceId: service.id,
        treatmentServiceId: service.id,
      });
    }
  }, [service, form]);

  // Chọn/bỏ chọn bác sĩ
  const handleDoctorSelect = (doctorId) => {
    if (selectedDoctor === doctorId) {
      setSelectedDoctor(null);
      form.setFieldsValue({ doctorId: undefined });
      setAvailableTimeSlots([]);
    } else {
      setSelectedDoctor(doctorId);
      form.setFieldsValue({ doctorId });
      if (selectedDate) handleDateChange(selectedDate);
    }
  };

  // Vô hiệu hóa ngày đã qua
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Tải khung giờ khả dụng khi chọn ngày
  const handleDateChange = useCallback(
    async (date) => {
      setSelectedDate(date);
      form.setFieldsValue({ timeSlot: undefined });
      setAvailableTimeSlots([]);

      if (date && selectedDoctor) {
        setLoadingTimeSlots(true);
        try {
          const appointmentDate = date.format("YYYY-MM-DD");
          const response = await appointmentService.getAvailableSlots(
            selectedDoctor,
            appointmentDate
          );

          if (response?.availableSlots?.length > 0) {
            setAvailableTimeSlots(response.availableSlots);
          } else {
            setAvailableTimeSlots([]);
            toast.warn("Không có khung giờ trống cho ngày này.");
          }
        } catch (error) {
          console.error("Lỗi tải khung giờ:", error);
          toast.error("Không thể tải khung giờ.");
          setAvailableTimeSlots([]);
        } finally {
          setLoadingTimeSlots(false);
        }
      }
    },
    [selectedDoctor, form]
  );

  // Validate và format dữ liệu trước khi gửi
  const validateAndFormatData = (values) => {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error("Vui lòng đăng nhập để đặt lịch hẹn");
    }

    // Validate các trường bắt buộc
    if (!values.treatmentServiceId) {
      throw new Error("Vui lòng chọn dịch vụ điều trị");
    }
    if (!values.appointmentDate) {
      throw new Error("Vui lòng chọn ngày hẹn");
    }
    if (!values.timeSlot) {
      throw new Error("Vui lòng chọn khung giờ");
    }
    if (hasTreatmentPlan === null) {
      throw new Error("Vui lòng chọn tình trạng khám trước đây");
    }

    // Format date và time
    const date = values.appointmentDate;
    const timeSlot = values.timeSlot;
    
    // Kiểm tra format timeSlot
    if (!timeSlot.includes('-')) {
      throw new Error("Khung giờ không hợp lệ");
    }

    const [startTime] = timeSlot.split('-');
    const [hours, minutes] = startTime.split(':');
    
    if (!hours || !minutes) {
      throw new Error("Thời gian không hợp lệ");
    }

    // Tạo datetime đầy đủ
    const appointmentDateTime = date
      .hour(parseInt(hours))
      .minute(parseInt(minutes))
      .second(0)
      .millisecond(0);

    // Tìm service để lấy thông tin
    const selectedService = services.find(s => 
      s.id === values.treatmentServiceId || s.serviceId === values.treatmentServiceId
    );

    // Tạo data object với validation
    const appointmentData = {
      customerId: parseInt(user.id),
      treatmentServiceId: parseInt(values.treatmentServiceId),
      appointmentDate: appointmentDateTime.toISOString(),
      timeSlot: timeSlot,
      type: selectedService?.serviceName || selectedService?.name || "Điều trị nội khoa hiếm muộn",
      notes: values.notes ? values.notes.trim() : null,
    };

    // Chỉ thêm doctorId nếu đã chọn bác sĩ
    if (selectedDoctor) {
      appointmentData.doctorId = parseInt(selectedDoctor);
    }

    // Chỉ thêm treatmentPlanId nếu đã từng khám
    if (hasTreatmentPlan === true) {
      appointmentData.treatmentPlanId = parseInt(values.treatmentServiceId);
    }

    return appointmentData;
  };

  // Gửi form
  const handleSubmit = async (values) => {
    if (onSubmitting) onSubmitting();
    setLoading(true);

    try {
      // Validate và format dữ liệu
      const appointmentData = validateAndFormatData(values);
      
      // console.log("Dữ liệu gửi đi:", JSON.stringify(appointmentData, null, 2));

      const result = await appointmentService.bookAppointment(appointmentData);
      
      if (result.success) {
        setIsSuccess(true);
        toast.success("Đặt lịch hẹn thành công!");
        if (onRegistrationSuccess) onRegistrationSuccess(result.data);
      } else {
        // Xử lý lỗi từ backend
        const errorMessage = result.message || "Lỗi không xác định từ server";
        toast.error(errorMessage);
        
        // Hiển thị chi tiết lỗi validation nếu có
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => {
            const message = error.message || error.description || 'Lỗi không xác định';
            toast.error(`${error.field ? `${error.field}: ` : ''}${message}`);
          });
        }
        
        // Log để debug
        console.error("Chi tiết lỗi từ backend:", result);
      }
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.message) {
        toast.error(error.message);
      } else if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = errorData.message || errorData.error || "Lỗi từ server";
        toast.error(errorMessage);
        
        // Hiển thị chi tiết lỗi validation
        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(`${field}: ${msg}`));
            } else {
              toast.error(`${field}: ${messages}`);
            }
          });
        }
        
        console.error("Chi tiết lỗi response:", errorData);
      } else {
        toast.error("Có lỗi xảy ra khi đặt lịch hẹn");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tải lại dịch vụ
  const reloadServices = async () => {
    try {
      setIsLoadingServices(true);
      const response = await treatmentService.getAllTreatmentServices();
      setServices(
        Array.isArray(response)
          ? response
          : response?.services || response?.data || []
      );
      toast.success("Tải danh sách dịch vụ thành công");
    } catch (error) {
      console.error("Lỗi tải dịch vụ:", error);
      toast.error("Không thể tải danh sách dịch vụ.");
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Tải lại bác sĩ
  const reloadDoctors = async () => {
    try {
      setIsLoadingDoctors(true);
      const response = await doctorService.getAllDoctors();
      setDoctors(
        Array.isArray(response)
          ? response
          : response?.doctors || response?.data || []
      );
      toast.success("Tải danh sách bác sĩ thành công");
    } catch (error) {
      console.error("Lỗi tải bác sĩ:", error);
      toast.error("Không thể tải danh sách bác sĩ.");
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  // Màn hình thành công
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
            Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ để xác nhận
            trong thời gian sớm nhất.
          </p>
          <p className="ivf-success-note">
            Xem lịch hẹn tại mục "Lịch hẹn" ở trang cá nhân.
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
              {/* Bước 1: Chọn dịch vụ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">1</div>
                  <h3 className="ivf-form-step-title">Dịch vụ điều trị</h3>
                </div>
                <div className="ivf-form-control">
                  <Form.Item
                    name="treatmentServiceId"
                    rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
                  >
                    <Select
                      placeholder="Chọn dịch vụ điều trị"
                      className="ivf-service-select"
                      disabled={service?.id || isLoadingServices}
                      showSearch
                      loading={isLoadingServices}
                      onChange={(value) => {
                        const selected = services.find(
                          (s) => s.id === value || s.serviceId === value
                        );
                        if (selected) {
                          toast.info(`Đã chọn: ${selected.serviceName || selected.name}`);
                        }
                      }}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {isLoadingServices ? (
                        <Option value="loading" disabled>
                          Đang tải danh sách dịch vụ...
                        </Option>
                      ) : services.length > 0 ? (
                        services.map((s) => (
                          <Option
                            key={s.id || s.serviceId}
                            value={s.id || s.serviceId}
                          >
                            {s.serviceName || s.name} -{" "}
                            {(s.basePrice || s.price)?.toLocaleString("vi-VN")} VNĐ
                          </Option>
                        ))
                      ) : (
                        <Option value="no-services" disabled>
                          Không tìm thấy dịch vụ
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                  {services.length === 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <p style={{ color: "#ff4d4f", fontSize: "13px", marginBottom: "8px" }}>
                        {isLoadingServices
                          ? "Đang tải danh sách dịch vụ..."
                          : "Không thể tải danh sách dịch vụ."}
                      </p>
                      {!isLoadingServices && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={reloadServices}
                          loading={isLoadingServices}
                        >
                          Tải lại danh sách dịch vụ
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <Col xs={24}>
              {/* Bước 1.5: Đã từng khám hay chưa */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">1.5</div>
                  <h3 className="ivf-form-step-title">Tình trạng khám trước đây</h3>
                </div>
                <div className="ivf-form-control">
                  <Form.Item 
                    name="hasTreatmentPlan"
                    rules={[{ required: true, message: "Vui lòng chọn tình trạng khám" }]}
                  >
                    <Radio.Group
                      onChange={(e) => setHasTreatmentPlan(e.target.value)}
                      value={hasTreatmentPlan}
                    >
                      <Radio value={true}>Đã từng khám</Radio>
                      <Radio value={false}>Chưa từng khám</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <p style={{ color: "#999", fontSize: "12px" }}>
                    Chọn "Đã từng khám" nếu bạn đã có kế hoạch điều trị trước đó.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={24}>
              {/* Bước 2: Chọn bác sĩ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">2</div>
                  <h3 className="ivf-form-step-title">Bác sĩ đăng ký khám (tùy chọn)</h3>
                </div>
                <div className="ivf-form-control">
                  <Form.Item name="doctorId">
                    <Input type="hidden" />
                  </Form.Item>
                  <p className="ivf-optional-text">
                    Chọn bác sĩ hoặc để trống để chúng tôi sắp xếp.
                  </p>
                  {isLoadingDoctors ? (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <Spin tip="Đang tải danh sách bác sĩ..." />
                    </div>
                  ) : doctors.length > 0 ? (
                    <>
                      <div className="ivf-doctor-grid">
                        {doctors.map((doctor) => (
                          <div
                            key={doctor.id || doctor.doctorId}
                            className={`ivf-doctor-card ${selectedDoctor === (doctor.id || doctor.doctorId)
                              ? "selected"
                              : ""
                              }`}
                            onClick={() =>
                              handleDoctorSelect(doctor.id || doctor.doctorId)
                            }
                          >
                            <div className="ivf-doctor-avatar">
                              <img
                                src={doctor.photo || doctor.avatar || DEFAULT_AVATAR}
                                alt={doctor.name || doctor.fullName}
                                onError={(e) => {
                                  e.target.src = DEFAULT_AVATAR;
                                }}
                              />
                              {selectedDoctor === (doctor.id || doctor.doctorId) && (
                                <div className="ivf-doctor-selected-indicator">✓</div>
                              )}
                            </div>
                            <h4 className="ivf-doctor-name">
                              {doctor.name || doctor.fullName}
                            </h4>
                            <p className="ivf-doctor-specialty">
                              {doctor.specialization || doctor.specialty || "Bác sĩ chuyên khoa"}
                            </p>
                            <div className="ivf-doctor-rating">
                              ⭐{" "}
                              {doctor.averageRating?.toFixed(1) ||
                                doctor.rating?.toFixed(1) ||
                                "N/A"}
                            </div>
                            <div className="ivf-doctor-experience">
                              {doctor.experienceYears || doctor.experience || "5+"}{" "}
                              năm kinh nghiệm
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="ivf-selection-status">
                        {selectedDoctor ? (
                          <>
                            Đã chọn bác sĩ:{" "}
                            {doctors.find(
                              (d) => (d.id || d.doctorId) === selectedDoctor
                            )?.name ||
                              doctors.find(
                                (d) => (d.id || d.doctorId) === selectedDoctor
                              )?.fullName}
                            <Button
                              type="link"
                              className="ivf-clear-selection"
                              onClick={() => handleDoctorSelect(selectedDoctor)}
                            >
                              Bỏ chọn
                            </Button>
                          </>
                        ) : (
                          "Chưa chọn bác sĩ nào"
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <p>Không tìm thấy thông tin bác sĩ</p>
                      <Button
                        type="primary"
                        onClick={reloadDoctors}
                        loading={isLoadingDoctors}
                      >
                        Tải lại danh sách bác sĩ
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              {/* Bước 3: Chọn ngày */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">3</div>
                  <h3 className="ivf-form-step-title">Chọn ngày</h3>
                </div>
                <div className="ivf-form-control">
                  <Form.Item
                    name="appointmentDate"
                    rules={[{ required: true, message: "Vui lòng chọn ngày hẹn" }]}
                  >
                    <DatePicker
                      className="ivf-date-picker"
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày hẹn"
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      suffixIcon={<CalendarOutlined style={{ color: "#6064e3" }} />}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              {/* Bước 4: Chọn giờ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">4</div>
                  <h3 className="ivf-form-step-title">Chọn giờ</h3>
                </div>
                <div className="ivf-form-control">
                  <Form.Item
                    name="timeSlot"
                    rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}
                  >
                    <Select
                      placeholder="Chọn khung giờ"
                      className="ivf-time-select"
                      loading={loadingTimeSlots}
                      disabled={!selectedDate}
                      suffixIcon={<ClockCircleOutlined style={{ color: "#6064e3" }} />}
                    >
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((timeSlot) => (
                          <Option key={timeSlot} value={timeSlot}>
                            {timeSlot}
                          </Option>
                        ))
                      ) : (
                        <Option value="no-slots" disabled>
                          Không có khung giờ
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                  {!selectedDate && (
                    <p style={{ color: "#999", fontSize: "12px" }}>
                      Vui lòng chọn ngày trước khi chọn giờ
                    </p>
                  )}
                </div>
              </div>
            </Col>

            <Col xs={24}>
              {/* Bước 5: Ghi chú */}
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
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>

          {/* Nút gửi */}
          <Button
            type="primary"
            htmlType="submit"
            className="ivf-form-submit-btn"
            loading={loading}
            disabled={
              !form.getFieldValue("treatmentServiceId") ||
              hasTreatmentPlan === null ||
              !form.getFieldValue("appointmentDate") ||
              !form.getFieldValue("timeSlot") ||
              loading
            }
          >
            ĐẶT LỊCH HẸN NGAY
          </Button>

          <div className="ivf-disclaimer">
            Bằng cách nhấn nút đặt lịch, bạn đồng ý với điều khoản và chính sách
            bảo mật của chúng tôi
          </div>
        </Form>
      </div>
    </div>
  );
};

export default IvfAppointmentForm;