import React, { useState, useEffect, useCallback } from "react";
import { Form, Select, DatePicker, Input, Button, Row, Col, Spin } from "antd";
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

// Danh sách khung giờ tĩnh (có thể điều chỉnh theo nhu cầu)
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

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
    } else {
      setSelectedDoctor(doctorId);
      form.setFieldsValue({ doctorId });
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
      if (date && selectedDoctor) {
        setLoadingTimeSlots(true);
        try {
          const appointmentDate = date.format("YYYY-MM-DD");
          // Lọc danh sách khung giờ khả dụng từ TIME_SLOTS
          const availableSlots = await Promise.all(
            TIME_SLOTS.map(async (timeSlot) => {
              const { available } =
                await appointmentService.checkTimeSlotAvailability(
                  selectedDoctor,
                  appointmentDate,
                  timeSlot
                );
              return available ? timeSlot : null;
            })
          );
          // Lọc bỏ các slot null (không khả dụng)
          setAvailableTimeSlots(availableSlots.filter((slot) => slot !== null));
        } catch (error) {
          console.error("Lỗi tải khung giờ:", error);
          toast.error("Không thể tải khung giờ.");
          setAvailableTimeSlots([]);
        } finally {
          setLoadingTimeSlots(false);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    },
    [selectedDoctor]
  );

  // Gửi form
  const handleSubmit = async (values) => {
    const user = authService.getCurrentUser();
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt lịch hẹn");
      return;
    }

    if (onSubmitting) onSubmitting();
    setLoading(true);

    try {
      const appointmentData = {
        doctorId: values.doctorId || 0,
        treatmentPlanId: 0,
        appointmentDate: values.appointmentDate.format(
          "YYYY-MM-DDTHH:mm:ss.SSSZ"
        ),
        timeSlot: values.timeSlot || "",
        type: "Consultation",
        notes: values.notes || "",
      };

      const result = await appointmentService.bookAppointment(appointmentData);
      if (result.success) {
        setIsSuccess(true);
        toast.success("Đặt lịch hẹn thành công!");
        if (onRegistrationSuccess) onRegistrationSuccess(result.data);
      } else {
        toast.error(result.message);
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            messages.forEach((msg) => toast.error(`${field}: ${msg}`));
          });
        }
      }
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      toast.error(formatErrorMessage(error));
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
                    rules={[
                      { required: true, message: "Vui lòng chọn dịch vụ" },
                    ]}
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
                          toast.info(
                            `Đã chọn: ${selected.serviceName || selected.name}`
                          );
                        }
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
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
                            {(s.basePrice || s.price)?.toLocaleString("vi-VN")}{" "}
                            VNĐ
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
                      <p
                        style={{
                          color: "#ff4d4f",
                          fontSize: "13px",
                          marginBottom: "8px",
                        }}
                      >
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
              {/* Bước 2: Chọn bác sĩ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">2</div>
                  <h3 className="ivf-form-step-title">
                    Bác sĩ đăng ký khám (tùy chọn)
                  </h3>
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
                            className={`ivf-doctor-card ${
                              selectedDoctor === (doctor.id || doctor.doctorId)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              handleDoctorSelect(doctor.id || doctor.doctorId)
                            }
                          >
                            <div className="ivf-doctor-avatar">
                              <img
                                src={
                                  doctor.photo ||
                                  doctor.avatar ||
                                  DEFAULT_AVATAR
                                }
                                alt={doctor.name || doctor.fullName}
                                onError={(e) => {
                                  e.target.src = DEFAULT_AVATAR;
                                }}
                              />
                              {selectedDoctor ===
                                (doctor.id || doctor.doctorId) && (
                                <div className="ivf-doctor-selected-indicator">
                                  ✓
                                </div>
                              )}
                            </div>
                            <h4 className="ivf-doctor-name">
                              {doctor.name || doctor.fullName}
                            </h4>
                            <p className="ivf-doctor-specialty">
                              {doctor.specialization ||
                                doctor.specialty ||
                                "Bác sĩ chuyên khoa"}
                            </p>
                            <div className="ivf-doctor-rating">
                              ⭐{" "}
                              {doctor.averageRating?.toFixed(1) ||
                                doctor.rating?.toFixed(1) ||
                                "N/A"}
                            </div>
                            <div className="ivf-doctor-experience">
                              {doctor.experienceYears ||
                                doctor.experience ||
                                "5+"}{" "}
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
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày hẹn" },
                    ]}
                  >
                    <DatePicker
                      className="ivf-date-picker"
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày hẹn"
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      suffixIcon={
                        <CalendarOutlined style={{ color: "#6064e3" }} />
                      }
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
                    rules={[
                      { required: true, message: "Vui lòng chọn khung giờ" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn khung giờ"
                      className="ivf-time-select"
                      loading={loadingTimeSlots}
                      disabled={!selectedDoctor || !selectedDate}
                      suffixIcon={
                        <ClockCircleOutlined style={{ color: "#6064e3" }} />
                      }
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
                  {(!selectedDoctor || !selectedDate) && (
                    <p style={{ color: "#999", fontSize: "12px" }}>
                      Vui lòng chọn bác sĩ và ngày trước khi chọn giờ
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
            disabled={!form.getFieldValue("treatmentServiceId") || loading}
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
