// Form đặt lịch hẹn IVF (Thụ tinh trong ống nghiệm)
// Sử dụng Ant Design cho UI, quản lý state bằng React hook
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  treatmentPlans,
} from "../../services";
import "../../styles/IvfAppointmentForm.css";

const { Option } = Select;
const { TextArea } = Input;

// Ảnh mặc định tránh lỗi mạng
const DEFAULT_AVATAR = "https://placehold.co/100x100?text=Doctor";

// Component chính
const IvfAppointmentForm = ({
  service,
  onRegistrationSuccess,
  onSubmitting,
}) => {
  // Khởi tạo form và các biến theo dõi giá trị form
  const [form] = Form.useForm();
  // Theo dõi các trường form để kiểm tra điều kiện nút submit
  const watchedService = Form.useWatch("treatmentServiceId", form);
  const watchedDate = Form.useWatch("appointmentDate", form);
  const watchedTime = Form.useWatch("timeSlot", form);
  const watchedPlan = Form.useWatch("treatmentPlanId", form);

  // State quản lý dữ liệu và trạng thái UI
  const [loading, setLoading] = useState(false); // Đang gửi form
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Bác sĩ được chọn
  const [isSuccess, setIsSuccess] = useState(false); // Đặt lịch thành công
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [doctors, setDoctors] = useState([]); // Danh sách bác sĩ
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // Khung giờ khả dụng
  const [selectedDate, setSelectedDate] = useState(null); // Ngày được chọn
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false); // Đang tải khung giờ
  const [isLoadingServices, setIsLoadingServices] = useState(false); // Đang tải dịch vụ
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false); // Đang tải bác sĩ
  const [hasTreatmentPlan, setHasTreatmentPlan] = useState(null); // Đã từng khám chưa
  const [treatmentPlansList, setTreatmentPlansList] = useState([]); // Danh sách kế hoạch điều trị

  const navigate = useNavigate();

  // Tải dữ liệu dịch vụ và bác sĩ ban đầu
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoadingServices(true);
        setIsLoadingDoctors(true);
        // Gọi API lấy danh sách dịch vụ và bác sĩ
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

  // Tải danh sách kế hoạch điều trị khi chọn "Đã từng khám"
  useEffect(() => {
    const loadTreatmentPlans = async () => {
      if (hasTreatmentPlan === true) {
        try {
          const user = authService.getCurrentUser();
          // Gọi API lấy kế hoạch điều trị của khách hàng
          const planResult = await treatmentPlans.getByCustomer(
            user.customer.id
          );
          if (planResult.success && Array.isArray(planResult.data)) {
            // Lọc các kế hoạch đang hoạt động
            const activePlans = planResult.data.filter(
              (plan) => (plan.status || "").toLowerCase() === "active"
            );
            setTreatmentPlansList(activePlans);
          } else {
            setTreatmentPlansList([]);
            toast.warn("Không tìm thấy kế hoạch điều trị.");
          }
        } catch (error) {
          console.error("Lỗi tải kế hoạch:", error);
          setTreatmentPlansList([]);
          toast.error("Không thể tải kế hoạch điều trị.");
        }
      } else {
        setTreatmentPlansList([]);
      }
    };
    loadTreatmentPlans();
  }, [hasTreatmentPlan]);

  // Nếu có dịch vụ truyền vào, set giá trị mặc định cho form
  useEffect(() => {
    if (service?.id) {
      console.log("Setting form value for service:", service); // Debug
      form.setFieldsValue({
        serviceId: service.id,
        treatmentServiceId: service.id,
      });
    } else {
      form.resetFields(["treatmentServiceId"]); // Reset nếu không có service
    }
  }, [service, form]);

  // Xử lý chọn/bỏ chọn bác sĩ
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
          // Gọi API lấy khung giờ trống của bác sĩ theo ngày
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
  // Trả về object dữ liệu gửi lên API
  const validateAndFormatData = (values) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("Vui lòng đăng nhập để đặt lịch hẹn");
    if (!values.treatmentServiceId)
      throw new Error("Vui lòng chọn dịch vụ điều trị");
    if (!values.appointmentDate) throw new Error("Vui lòng chọn ngày hẹn");
    if (!values.timeSlot) throw new Error("Vui lòng chọn khung giờ");
    if (hasTreatmentPlan === null)
      throw new Error("Vui lòng chọn tình trạng khám trước đây");
    const date = values.appointmentDate;
    const timeSlot = values.timeSlot;
    const [startTime] = timeSlot.split("-");
    const [hours, minutes] = startTime.split(":");
    // Format lại ngày giờ gửi lên API
    const appointmentDateTime = dayjs(date)
      .set("hour", parseInt(hours))
      .set("minute", parseInt(minutes))
      .set("second", 0)
      .set("millisecond", 0);
    const appointmentData = {
      doctorId: selectedDoctor ? parseInt(selectedDoctor) : null,
      treatmentPlanId:
        hasTreatmentPlan === true && values.treatmentPlanId
          ? parseInt(values.treatmentPlanId)
          : null,
      appointmentDate: appointmentDateTime.toISOString(),
      timeSlot: values.timeSlot,
      type:
        services.find((s) => s.id === values.treatmentServiceId)?.serviceName ||
        "Điều trị",
      notes: values.notes || "string",
    };
    return appointmentData;
  };

  // Xử lý gửi form đặt lịch
  const handleSubmit = async (values) => {
    if (onSubmitting) onSubmitting();
    setLoading(true);
    try {
      // Kiểm tra đăng nhập
      const user = authService.getCurrentUser();
      if (!user) {
        toast.error("Vui lòng đăng nhập để đặt lịch hẹn");
        navigate("/login"); // Sử dụng navigate từ scope component
        return;
      }

      const appointmentData = validateAndFormatData(values);
      console.log("Dữ liệu gửi đi:", appointmentData);
      const result = await appointmentService.bookAppointment(appointmentData);
      if (result.success) {
        setIsSuccess(true);
        toast.success("Đặt lịch hẹn thành công!");
        if (onRegistrationSuccess) onRegistrationSuccess(result.data);
      } else {
        toast.error(result.message || "Lỗi từ server");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi đặt lịch");
      console.error("Appointment error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tải lại danh sách dịch vụ
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

  // Tải lại danh sách bác sĩ
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

  // Nếu đặt lịch thành công, hiển thị màn hình xác nhận
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

  // Render form đặt lịch
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
                  {service && service.id && (
                    <div style={{ marginBottom: "10px", color: "#1890ff" }}>
                      Dịch vụ đã chọn: {service.serviceName} - {service.basePrice?.toLocaleString("vi-VN")} VND
                    </div>
                  )}
                  <Form.Item
                    name="treatmentServiceId"
                    rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
                  >
                    <Select
                      placeholder="Chọn dịch vụ điều trị"
                      className="ivf-service-select"
                      disabled={isLoadingServices || (service && service.id ? true : false)} // Vô hiệu hóa nếu service có id
                      showSearch
                      loading={isLoadingServices}
                      value={service && service.id ? service.id : undefined} // Set giá trị từ service
                      onChange={(value) => {
                        const selected = services.find((s) => s.id === value || s.serviceId === value);
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
                          <Option key={s.id || s.serviceId} value={s.id || s.serviceId}>
                            {s.serviceName || s.name} - {(s.basePrice || s.price)?.toLocaleString("vi-VN")} VNĐ
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
              {/* Bước 1.5: Đã từng khám hay chưa */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">1.5</div>
                  <h3 className="ivf-form-step-title">
                    Tình trạng khám trước đây
                  </h3>
                </div>
                <div className="ivf-form-control">
                  <Form.Item
                    name="hasTreatmentPlan"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tình trạng khám",
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={(e) => setHasTreatmentPlan(e.target.value)}
                      value={hasTreatmentPlan}
                    >
                      <Radio value={true}>Đã từng khám</Radio>
                      <Radio value={false}>Chưa từng khám</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {hasTreatmentPlan === true && (
                    <Form.Item
                      name="treatmentPlanId"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn kế hoạch điều trị",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn kế hoạch điều trị"
                        className="ivf-service-select"
                        loading={
                          !treatmentPlansList.length &&
                          hasTreatmentPlan === true
                        }
                        showSearch
                        optionLabelProp="label"
                        filterOption={(input, option) =>
                          option.label
                            ?.toLowerCase()
                            .includes(input.toLowerCase()) ||
                          option.children
                            ?.toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {treatmentPlansList.map((plan) => (
                          <Option
                            key={plan.id}
                            value={plan.id}
                            label={`Kế hoạch ${plan.id} - ${plan.treatmentType}`}
                          >
                            <div>
                              <strong>{plan.treatmentType}</strong> | Bắt đầu:{" "}
                              {dayjs(plan.startDate).format("DD/MM/YYYY")} | BS:{" "}
                              {plan.doctor?.name || "Không rõ"}
                            </div>
                          </Option>
                        ))}
                        {!treatmentPlansList.length && (
                          <Option value="" disabled>
                            Không có kế hoạch nào
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  )}
                  <p style={{ color: "#999", fontSize: "12px" }}>
                    Chọn "Đã từng khám" nếu bạn đã có kế hoạch điều trị trước
                    đó.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={24}>
              {/* Bước 2: Chọn bác sĩ */}
              <div className="ivf-form-section">
                <div className="ivf-form-step-header">
                  <div className="ivf-form-step-number">2</div>
                  <h3 className="ivf-form-step-title">
                    Bác sĩ đăng ký khám
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
                      disabled={!selectedDate}
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
              !watchedService ||
              hasTreatmentPlan === null ||
              !watchedDate ||
              !watchedTime ||
              (hasTreatmentPlan === true && !watchedPlan) ||
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
// Kết thúc file IvfAppointmentForm.jsx
