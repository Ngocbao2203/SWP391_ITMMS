import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Checkbox,
  Space,
  Typography,
  message,
  Avatar,
  Tag,
  Spin,
  Switch,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { authService, treatmentService } from "../../services";
import "../../styles/ConsultationModal.css";

const { TextArea } = Input;
// Fix unused variable warning by removing 'Text' which is not used
const { Title } = Typography;
const { Option } = Select;

/**
 * ConsultationModal - Modal component for patient consultation
 *
 * OPTIMIZATION: Combined data fetching operations (patient data and treatment services)
 * into a single function to prevent multiple renders and flickering/jittery effect
 * when opening the modal.
 */
const ConsultationModal = ({ visible, onCancel, appointment, onSuccess }) => {
  // Always call hooks first (Rules of Hooks)
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [existingTreatmentPlan, setExistingTreatmentPlan] = useState(null);
  const [treatmentServices, setTreatmentServices] = useState([]);
  const [createTreatmentPlan, setCreateTreatmentPlan] = useState(false);
  const [hasEverLoaded, setHasEverLoaded] = useState(false);

  // Track when data has loaded successfully at least once
  useEffect(() => {
    if (!loading && patientData) {
      setHasEverLoaded(true);
    }
  }, [loading, patientData]);

  // Get current user
  const currentUser = authService.getCurrentUser();

  /**
   * Enhanced combined fetch function to resolve the modal jittering issue
   *
   * The root cause is likely React's batching behavior with multiple state updates.
   * To fix this, we'll:
   * 1. Move the loading state outside the modal so it doesn't trigger re-renders
   * 2. Prepare all data before setting any state
   * 3. Use a single batch update with React 18's batching or a wrapper function
   */
  const fetchModalData = useCallback(async () => {
    if (!appointment) return;

    // Extract customerId from appointment
    const customerId = appointment.customerId;

    if (!customerId) {
      console.error("No customerId found in appointment:", appointment);
      return;
    }

    try {
      // Set loading state first, separate from other state changes
      setLoading(true);

      // Start the API call for treatment services
      const treatmentServicesPromise =
        treatmentService.getAllTreatmentServices();

      // Prepare patient data while API call is in progress
      const patientDataObj = {
        id: customerId,
        name: appointment.customerName || `Bệnh nhân ${customerId}`,
        phone: appointment.customerPhone || "Chưa có SĐT",
        age: 28,
        gender: "Nữ",
        medicalHistory: "Không có tiền sử bệnh lý đặc biệt",
      };

      // Check existing treatment plan
      const existingTreatmentPlanObj = appointment.treatmentPlanId
        ? {
            id: appointment.treatmentPlanId,
            currentPhase: 2,
            treatmentType: "IVF",
            status: "Active",
          }
        : null;

      const response = await treatmentServicesPromise;

      // Prepare services data
      let servicesData = [];
      if (response && response.success && response.data) {
        // Response format: {success: true, data: Array, message: string}
        servicesData = Array.isArray(response.data) ? response.data : [];
      } else if (response && response.services) {
        // Response format: {services: Array}
        servicesData = response.services;
      } else if (Array.isArray(response)) {
        // Direct array response
        servicesData = response;
      } else {
        console.warn("Unexpected services API response:", response);
      }

      // Delay state updates slightly to ensure they're batched together
      setTimeout(() => {
        // Update all state variables in a single batch
        setPatientData(patientDataObj);
        setExistingTreatmentPlan(existingTreatmentPlanObj);
        setTreatmentServices(servicesData);

        // Set loading to false only after all other states are updated
        setLoading(false);
      }, 0);
    } catch (error) {
      message.error("Không thể tải thông tin cho modal khám bệnh");
      setLoading(false);
    }
  }, [appointment]);

  // Enhanced useEffect to prevent multiple renders
  useEffect(() => {
    // Only trigger data fetching when both the modal becomes visible AND we have appointment data
    if (visible && appointment) {
      // Call the combined fetch function which now handles all state updates in batches
      fetchModalData();
    } else if (!visible) {
      // Reset loading state when modal is closed to ensure a clean state for next opening
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, appointment]);

  const handleSubmit = async (values) => {
    if (!appointment) {
      console.error("=== APPOINTMENT IS NULL/UNDEFINED ===");
      message.error("Không có thông tin lịch hẹn. Vui lòng thử lại.");
      return;
    }

    try {
      setSubmitting(true);

      // API đã cung cấp customerId trực tiếp - không cần logic phức tạp
      const patientId = appointment.customerId;

      // Validate customerId exists
      if (!patientId) {
        console.error("=== NO CUSTOMER ID FOUND ===");
        message.error(
          "Không thể xác định thông tin bệnh nhân. Vui lòng thử lại."
        );
        return;
      }

      if (!patientId) {
        console.error("=== NO PATIENT ID FOUND ===");
        message.error(
          "Không thể xác định thông tin bệnh nhân. Dữ liệu lịch hẹn không đầy đủ."
        );
        return;
      }

      // Ensure customerId is a number
      const customerIdNumber = parseInt(patientId);
      if (isNaN(customerIdNumber)) {
        console.error("=== INVALID PATIENT ID ===");
        message.error("ID bệnh nhân không hợp lệ");
        return;
      }

      if (!currentUser?.doctor?.id) {
        console.error("=== NO DOCTOR ID FOUND ===");
        message.error("Không thể xác định thông tin bác sĩ");
        return;
      }

      // Ensure doctorId is a number
      const doctorId = parseInt(currentUser.doctor.id);
      if (isNaN(doctorId)) {
        console.error("=== INVALID DOCTOR ID ===");
        message.error("ID bác sĩ không hợp lệ");
        return;
      }

      // Format next appointment date
      let nextAppointmentFormatted = null;
      if (values.nextAppointmentDate) {
        try {
          nextAppointmentFormatted =
            values.nextAppointmentDate.format("YYYY-MM-DD");
        } catch (formatError) {
          console.error("Error formatting nextAppointmentDate:", formatError);
          nextAppointmentFormatted = null;
        }
      }

      // Validate required fields
      if (!values.symptoms || !values.diagnosis || !values.treatment) {
        console.error("=== MISSING REQUIRED FIELDS ===");
        message.error(
          "Vui lòng điền đầy đủ thông tin khám bệnh (triệu chứng, chẩn đoán, điều trị)"
        );
        return;
      }

      // Validate followUp appointment date
      if (values.followUpRequired && !nextAppointmentFormatted) {
        console.error("=== MISSING FOLLOW UP DATE ===");
        message.error("Vui lòng chọn ngày tái khám khi cần đặt lịch tái khám");
        return;
      }

      // FIX: Sử dụng appointment.id thay vì appointmentId đã process
      // Vì backend cần appointmentId thật từ database, không phải processed value
      const realAppointmentId = appointment.id; // Đây là ID thật từ API

      const medicalRecordData = {
        appointmentId: realAppointmentId, // Sử dụng appointment.id gốc
        // customerId bỏ ra vì API không expect field này
        symptoms: values.symptoms,
        diagnosis: values.diagnosis,
        treatment: values.treatment,
        prescription: values.prescription || "",
        notes: values.notes || "",
        followUpRequired: values.followUpRequired || false,
        nextAppointmentDate: values.followUpRequired
          ? nextAppointmentFormatted
          : null,
      };

      // Validate appointmentId
      if (!realAppointmentId || isNaN(realAppointmentId)) {
        console.error("❌ Invalid appointmentId:", realAppointmentId);
        message.error("Lỗi: ID cuộc hẹn không hợp lệ");
        return;
      }

      // Validate customerId
      if (!customerIdNumber || isNaN(customerIdNumber)) {
        console.error("❌ Invalid customerId:", customerIdNumber);
        message.error("Lỗi: ID khách hàng không hợp lệ");
        return;
      }

      // Validate doctorId
      if (!doctorId || isNaN(doctorId)) {
        console.error("❌ Invalid doctorId:", doctorId);
        message.error("Lỗi: ID bác sĩ không hợp lệ");
        return;
      }

      // TEST: Validate doctorId exists và có permission
      try {
        const testUrl = `http://localhost:5037/api/MedicalRecords/test`;
        const testResponse = await fetch(testUrl, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (testResponse.ok) {
          const testData = await testResponse.text();
        } else {
          console.warn(
            "MedicalRecords test failed:",
            await testResponse.text()
          );
        }
      } catch (testError) {
        console.error("Backend test failed:", testError);
      }

      // TEST: Check doctor exists
      try {
        const doctorUrl = `http://localhost:5037/api/doctors/${doctorId}`;
        const doctorResponse = await fetch(doctorUrl, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (doctorResponse.ok) {
          const doctorData = await doctorResponse.json();
        } else {
          console.warn("Doctor not found or access denied");
        }
      } catch (doctorError) {
        console.error("Doctor check failed:", doctorError);
      }

      try {
        const manualUrl = `http://localhost:5037/api/MedicalRecords/complete/${doctorId}`;

        const manualResponse = await fetch(manualUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(medicalRecordData),
        });

        if (manualResponse.ok) {
          const manualData = await manualResponse.json();

          // 3. Handle treatment plan if needed (after medical record success)
          if (createTreatmentPlan && values.treatmentServiceId) {
            try {
              const treatmentPlanData = {
                customerId: customerIdNumber,
                doctorId: doctorId,
                treatmentServiceId: parseInt(values.treatmentServiceId),
                treatmentType: values.treatmentType || "IVF",
                description: values.treatmentDescription || values.treatment,
                startDate: values.startDate
                  ? values.startDate.format("YYYY-MM-DDTHH:mm:ss")
                  : dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                totalCost: 0, // Set default value, will be calculated by backend
                notes: values.notes || "",
                currentPhase: 1, // Default to phase 1
                phaseDescription: values.phaseDescription || "",

                NextVisitDate:
                  values.followUpRequired && values.nextAppointmentDate
                    ? values.nextAppointmentDate.format("YYYY-MM-DD")
                    : null,
              };

              const treatmentResult =
                await treatmentService.createTreatmentPlan(treatmentPlanData);

              if (treatmentResult && treatmentResult.success) {
                message.success(
                  "Hoàn thành khám bệnh và tạo kế hoạch điều trị thành công!"
                );
              } else {
                console.error("=== TREATMENT PLAN CREATION FAILED ===");
                console.error("Treatment error response:", treatmentResult);
                message.warning(
                  "Medical record đã tạo thành công, nhưng có lỗi khi tạo kế hoạch điều trị: " +
                    (treatmentResult?.message || "Unknown error")
                );
              }
            } catch (treatmentError) {
              console.error("=== TREATMENT PLAN EXCEPTION ===");
              console.error("Treatment error details:", {
                name: treatmentError.name,
                message: treatmentError.message,
                stack: treatmentError.stack,
              });
              message.warning(
                "Medical record đã tạo thành công, nhưng có lỗi khi tạo kế hoạch điều trị: " +
                  treatmentError.message
              );
            }
          } else {
            message.success("Hoàn thành khám bệnh thành công!");
          }

          form.resetFields();
          onSuccess && onSuccess();
          onCancel();
          return; // Exit early - success path
        } else {
          const errorText = await manualResponse.text();
          console.error("❌ Manual API call FAILED");
          console.error("📄 Error Response Text:", errorText);
          console.error("📊 Error Details:", {
            status: manualResponse.status,
            statusText: manualResponse.statusText,
            url: manualUrl,
            headers: Object.fromEntries(manualResponse.headers.entries()),
          });

          // Parse error response
          let errorData = null;
          try {
            errorData = JSON.parse(errorText);
            console.error("🔍 Parsed Error Data:", errorData);
            console.error(
              "📝 Error Message:",
              errorData.message || errorData.title || errorData.error
            );
            console.error(
              "⚠️ Validation Errors:",
              errorData.errors || errorData.validationErrors
            );
          } catch (parseError) {
            console.error("❌ Could not parse error response as JSON");
          }

          // Show specific error to user
          const errorMsg =
            errorData?.message ||
            errorData?.title ||
            `HTTP ${manualResponse.status}: ${errorText}`;
          message.error(`Lỗi API: ${errorMsg}`);
          return; // Exit early, don't call service
        }
      } catch (manualError) {
        console.error("💥 Manual API call EXCEPTION:", manualError);
        console.error("🔍 Exception details:", {
          name: manualError.name,
          message: manualError.message,
          stack: manualError.stack,
        });

        message.error(`Lỗi kết nối: ${manualError.message}`);
        return; // Exit early
      }
    } catch (error) {
      console.error("=== ERROR IN HANDLE SUBMIT ===");
      console.error("Error type:", typeof error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      message.error(
        "Có lỗi xảy ra khi hoàn thành khám bệnh: " +
          (error.message || "Unknown error")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Modal
      title={
        <Space>
          <MedicineBoxOutlined />
          <span>Khám bệnh</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
      className="consultation-modal"
      // Keep the modal content stable during loading to prevent layout shifts
      destroyOnClose={true}
      // Optimization flags for better performance
      maskClosable={false}
      transitionName="" // Disable transition animations
      style={{ minHeight: "600px" }} // Stable modal height
    >
      {/* Use loading-container class to maintain consistent height during loading */}
      {loading && !hasEverLoaded ? (
        <div className="loading-container">
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải thông tin khám bệnh...</p>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={(errorInfo) => {
            message.error("Vui lòng kiểm tra lại thông tin form");
          }}
          initialValues={{
            followUpRequired: false,
            nextAppointmentDate: dayjs().add(1, "week"),
            startDate: dayjs(),
            status: existingTreatmentPlan?.status || "Active",
          }}
        >
          {/* Patient Context */}
          <Card
            title="Thông tin bệnh nhân"
            size="small"
            style={{ marginBottom: 16 }}
            className="patient-context-card"
          >
            <Row gutter={16}>
              <Col span={4}>
                <Avatar size={64} icon={<UserOutlined />} />
              </Col>
              <Col span={20}>
                <Space direction="vertical" size={4}>
                  <Title level={4} style={{ margin: 0 }}>
                    {appointment?.customerName}
                  </Title>

                  {existingTreatmentPlan && (
                    <Tag color="blue">
                      Đang điều trị: {existingTreatmentPlan.treatmentType} -
                      Giai đoạn {existingTreatmentPlan.currentPhase}
                    </Tag>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>

          <Row gutter={16}>
            {/* Consultation Details */}
            <Col span={16}>
              <Card
                title="Thông tin khám bệnh"
                className="consultation-details-card"
              >
                <Form.Item
                  label="Triệu chứng"
                  name="symptoms"
                  rules={[
                    { required: true, message: "Vui lòng nhập triệu chứng" },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Mô tả triệu chứng của bệnh nhân..."
                  />
                </Form.Item>

                <Form.Item
                  label="Chẩn đoán"
                  name="diagnosis"
                  rules={[
                    { required: true, message: "Vui lòng nhập chẩn đoán" },
                  ]}
                >
                  <TextArea rows={3} placeholder="Chẩn đoán của bác sĩ..." />
                </Form.Item>

                <Form.Item
                  label="Phương pháp điều trị"
                  name="treatment"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập phương pháp điều trị",
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Phương pháp điều trị được chỉ định..."
                  />
                </Form.Item>

                <Form.Item label="Đơn thuốc" name="prescription">
                  <TextArea
                    rows={3}
                    placeholder="Danh sách thuốc và cách dùng..."
                  />
                </Form.Item>

                <Form.Item label="Ghi chú khám bệnh" name="notes">
                  <TextArea rows={2} placeholder="Ghi chú thêm..." />
                </Form.Item>
              </Card>
            </Col>

            {/* Treatment Plan Section */}
            <Col span={8}>
              <Card
                title="Kế hoạch điều trị"
                className="treatment-plan-card"
                extra={
                  !existingTreatmentPlan && (
                    <Switch
                      checked={createTreatmentPlan}
                      onChange={setCreateTreatmentPlan}
                      checkedChildren="Tạo mới"
                      unCheckedChildren="Không tạo"
                    />
                  )
                }
              >
                {existingTreatmentPlan ? (
                  // Update existing plan
                  <>
                    <Form.Item label="Mô tả tiến trình" name="phaseDescription">
                      <TextArea
                        rows={3}
                        placeholder="Mô tả chi tiết giai đoạn hiện tại..."
                      />
                    </Form.Item>

                    <Form.Item label="Ghi chú tiến trình" name="progressNotes">
                      <TextArea
                        rows={2}
                        placeholder="Ghi chú về tiến trình..."
                      />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status">
                      <Select>
                        <Option value="Active">Đang điều trị</Option>
                        <Option value="On-Hold">Tạm dừng</Option>
                        <Option value="Completed">Hoàn thành</Option>
                      </Select>
                    </Form.Item>
                  </>
                ) : createTreatmentPlan ? (
                  // Create new plan
                  <>
                    <Form.Item
                      label="Dịch vụ điều trị"
                      name="treatmentServiceId"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn dịch vụ điều trị",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn dịch vụ"
                        showSearch
                        optionFilterProp="children"
                      >
                        {treatmentServices.length === 0 ? (
                          <Option disabled value="">
                            Đang tải dịch vụ...
                          </Option>
                        ) : (
                          treatmentServices.map((service) => (
                            <Option key={service.id} value={service.id}>
                              {service.serviceName ||
                                service.name ||
                                `Dịch vụ ${service.id}`}
                              {service.estimatedCost &&
                                ` - ${service.estimatedCost.toLocaleString()} VND`}
                            </Option>
                          ))
                        )}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Loại điều trị" name="treatmentType">
                      <Input placeholder="VD: IVF, IUI, ICSI..." />
                    </Form.Item>

                    <Form.Item
                      label="Mô tả kế hoạch"
                      name="treatmentDescription"
                    >
                      <TextArea
                        rows={2}
                        placeholder="Mô tả chi tiết kế hoạch điều trị..."
                      />
                    </Form.Item>

                    <Form.Item label="Mô tả giai đoạn" name="phaseDescription">
                      <TextArea
                        rows={2}
                        placeholder="Mô tả chi tiết về giai đoạn điều trị hiện tại..."
                      />
                    </Form.Item>

                    <Form.Item label="Ngày bắt đầu" name="startDate">
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#999",
                      padding: "20px 0",
                    }}
                  >
                    <FileTextOutlined
                      style={{ fontSize: 24, marginBottom: 8 }}
                    />
                    <br />
                    Không tạo kế hoạch điều trị mới
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Follow-up Section */}
          <Card title="Tái khám" size="small" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="followUpRequired" valuePropName="checked">
                  <Checkbox>Cần đặt lịch tái khám</Checkbox>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.followUpRequired !==
                    currentValues.followUpRequired
                  }
                >
                  {({ getFieldValue }) => (
                    <Form.Item
                      label="Ngày tái khám"
                      name="nextAppointmentDate"
                      rules={[
                        {
                          validator(_, value) {
                            if (getFieldValue("followUpRequired") && !value) {
                              return Promise.reject(
                                new Error("Vui lòng chọn ngày tái khám")
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        disabled={!getFieldValue("followUpRequired")}
                        showTime={{ format: "HH:mm" }}
                        format="DD/MM/YYYY HH:mm"
                        placeholder="Chọn ngày và giờ tái khám"
                        disabledDate={(current) =>
                          current && current < dayjs().startOf("day")
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Actions */}
          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Space>
              <Button onClick={onCancel}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<MedicineBoxOutlined />}
              >
                Hoàn thành khám bệnh
              </Button>
            </Space>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ConsultationModal;
