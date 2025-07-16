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
const { Text, Title } = Typography;
const { Option } = Select;

const ConsultationModal = ({ visible, onCancel, appointment, onSuccess }) => {
  console.log("=== CONSULTATION MODAL DEBUG ===");
  console.log("visible:", visible);
  console.log("appointment:", appointment);
  console.log("appointment.customerId:", appointment?.customerId);

  // Always call hooks first (Rules of Hooks)
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [existingTreatmentPlan, setExistingTreatmentPlan] = useState(null);
  const [treatmentServices, setTreatmentServices] = useState([]);
  const [createTreatmentPlan, setCreateTreatmentPlan] = useState(false);

  // Get current user
  const currentUser = authService.getCurrentUser();

  const fetchPatientData = useCallback(async () => {
    if (!appointment) return;

    // Extract customerId from appointment - API đã cung cấp trực tiếp
    const customerId = appointment.customerId;

    if (!customerId) {
      console.error("No customerId found in appointment:", appointment);
      return;
    }

    try {
      setLoading(true);
      // Lấy thông tin bệnh nhân và treatment plan hiện tại (nếu có)
      // const patientInfo = await patientService.getPatientDetails(customerId);
      // const treatmentPlans = await treatmentPlanService.getByCustomerId(customerId);

      // Mock data cho demo với thông tin từ appointment
      setPatientData({
        id: customerId,
        name: appointment.customerName || `Bệnh nhân ${customerId}`,
        phone: appointment.customerPhone || "Chưa có SĐT",
        age: 28,
        gender: "Nữ",
        medicalHistory: "Không có tiền sử bệnh lý đặc biệt",
      });

      // Kiểm tra có treatment plan hiện tại không
      if (appointment.treatmentPlanId) {
        setExistingTreatmentPlan({
          id: appointment.treatmentPlanId,
          currentPhase: 2,
          treatmentType: "IVF",
          status: "Active",
        });
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      message.error("Không thể tải thông tin bệnh nhân");
    } finally {
      setLoading(false);
    }
  }, [appointment]);

  const fetchTreatmentServices = useCallback(async () => {
    try {
      // Lấy danh sách treatment services từ API
      const response = await treatmentService.getAllTreatmentServices();

      console.log("Treatment services API response:", response);

      // Handle different API response structures
      if (response && response.success && response.data) {
        // Response format: {success: true, data: Array, message: string}
        setTreatmentServices(Array.isArray(response.data) ? response.data : []);
      } else if (response && response.services) {
        // Response format: {services: Array}
        setTreatmentServices(response.services);
      } else if (Array.isArray(response)) {
        // Direct array response
        setTreatmentServices(response);
      } else {
        console.warn("Unexpected services API response:", response);
        setTreatmentServices([]);
      }
    } catch (error) {
      console.error("Error fetching treatment services:", error);
      message.error("Không thể tải danh sách dịch vụ điều trị");
    }
  }, []);

  // useEffect - đặt sau khi định nghĩa functions để tránh lỗi initialization
  useEffect(() => {
    if (visible && appointment) {
      console.log("=== LOADING CONSULTATION MODAL ===");
      console.log("Appointment:", appointment);

      fetchPatientData();
      fetchTreatmentServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, appointment]);

  const handleSubmit = async (values) => {
    console.log("=== FORM SUBMIT TRIGGERED ===");
    console.log("Form values received:", values);

    // CRITICAL: Check appointment object first
    console.log("=== APPOINTMENT CHECK IN SUBMIT ===");
    console.log("appointment in handleSubmit:", appointment);
    console.log("appointment type:", typeof appointment);

    if (!appointment) {
      console.error("=== APPOINTMENT IS NULL/UNDEFINED ===");
      message.error("Không có thông tin lịch hẹn. Vui lòng thử lại.");
      return;
    }

    console.log("Required fields check:");
    console.log("- symptoms:", values.symptoms);
    console.log("- diagnosis:", values.diagnosis);
    console.log("- treatment:", values.treatment);

    try {
      setSubmitting(true);
      console.log("=== SUBMITTING SET TO TRUE ===");

      // API đã cung cấp customerId trực tiếp - không cần logic phức tạp
      const patientId = appointment.customerId;

      console.log("=== PATIENT ID EXTRACTION ===");
      console.log("appointment.customerId:", appointment.customerId);
      console.log("patientId extracted:", patientId);

      // Validate customerId exists
      if (!patientId) {
        console.error("=== NO CUSTOMER ID FOUND ===");
        message.error(
          "Không thể xác định thông tin bệnh nhân. Vui lòng thử lại."
        );
        return;
      }

      console.log("Final patientId to use:", patientId);

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

      console.log("=== IDS VALIDATED ===");
      console.log("customerIdNumber:", customerIdNumber);
      console.log("doctorId:", doctorId);

      // Format next appointment date
      let nextAppointmentFormatted = null;
      if (values.nextAppointmentDate) {
        try {
          nextAppointmentFormatted =
            values.nextAppointmentDate.format("YYYY-MM-DD");
          console.log("nextAppointmentFormatted:", nextAppointmentFormatted);
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

      console.log("=== ALL VALIDATIONS PASSED ===");

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

      console.log(
        "🔧 FIXED: Using appointment.id as appointmentId:",
        realAppointmentId
      );
      console.log(
        "🔧 Original appointment object keys:",
        Object.keys(appointment)
      );
      console.log("🔧 appointment.id:", appointment.id);
      console.log("🔧 appointment.appointmentId:", appointment.appointmentId);

      // VALIDATION: Check appointmentId và customerId
      console.log("✅ VALIDATION CHECKS:");
      console.log(
        "- appointmentId type:",
        typeof realAppointmentId,
        "value:",
        realAppointmentId
      );
      console.log(
        "- customerId type:",
        typeof customerIdNumber,
        "value:",
        customerIdNumber
      );
      console.log("- doctorId type:", typeof doctorId, "value:", doctorId);

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

      console.log("=== MEDICAL RECORD DATA PREPARED ===");
      console.log("appointmentId used:", medicalRecordData.appointmentId);
      console.log("customerId used:", medicalRecordData.customerId);

      console.log("=== CALLING MEDICAL RECORD API ===");
      console.log("Medical record data:", medicalRecordData);
      console.log("Doctor ID:", doctorId);

      // Debug current user và token
      console.log("=== AUTH DEBUG ===");
      console.log("Current user:", currentUser);
      console.log("Has token:", !!currentUser?.token);
      console.log(
        "Token preview:",
        currentUser?.token?.substring(0, 20) + "..."
      );

      // Debug URL được gọi
      const apiUrl = `http://localhost:5037/api/MedicalRecords/complete/${doctorId}`;
      console.log("=== API CALL DEBUG ===");
      console.log("Full URL:", apiUrl);
      console.log(
        "Request body JSON:",
        JSON.stringify(medicalRecordData, null, 2)
      );

      // 1. Create medical record
      console.log("=== CALLING adminService.completeAppointment ===");
      console.log("Method: adminService.completeAppointment");
      console.log(
        "Params: doctorId =",
        doctorId,
        "medicalRecordData =",
        medicalRecordData
      );

      // TEST: Validate doctorId exists và có permission
      try {
        console.log("=== TESTING BACKEND CONNECTION ===");
        const testUrl = `http://localhost:5037/api/MedicalRecords/test`;
        const testResponse = await fetch(testUrl, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(
          "MedicalRecords test endpoint status:",
          testResponse.status
        );
        if (testResponse.ok) {
          const testData = await testResponse.text();
          console.log("MedicalRecords test response:", testData);
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
        console.log("=== TESTING DOCTOR EXISTS ===");
        const doctorUrl = `http://localhost:5037/api/doctors/${doctorId}`;
        const doctorResponse = await fetch(doctorUrl, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Doctor check status:", doctorResponse.status);
        if (doctorResponse.ok) {
          const doctorData = await doctorResponse.json();
          console.log("Doctor data:", doctorData);
        } else {
          console.warn("Doctor not found or access denied");
        }
      } catch (doctorError) {
        console.error("Doctor check failed:", doctorError);
      }

      // TEST: Manual API call với format giống Swagger
      console.log("=== TESTING MANUAL API CALL (SWAGGER FORMAT) ===");
      console.log("🔍 STEP 1: Preparing manual API call");
      console.log(
        "📍 URL:",
        `http://localhost:5037/api/MedicalRecords/complete/${doctorId}`
      );
      console.log("👤 Token:", currentUser?.token ? "EXISTS" : "MISSING");
      console.log("📦 Payload:", JSON.stringify(medicalRecordData, null, 2));

      try {
        const manualUrl = `http://localhost:5037/api/MedicalRecords/complete/${doctorId}`;
        console.log("🚀 Making manual fetch request...");

        const manualResponse = await fetch(manualUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(medicalRecordData),
        });

        console.log("📡 Manual API Response Status:", manualResponse.status);
        console.log(
          "📋 Manual API Response Headers:",
          Object.fromEntries(manualResponse.headers.entries())
        );

        if (manualResponse.ok) {
          const manualData = await manualResponse.json();
          console.log("✅ Manual API call SUCCESS:", manualData);

          // 3. Handle treatment plan if needed (after medical record success)
          if (createTreatmentPlan && values.treatmentServiceId) {
            try {
              console.log("=== CREATING TREATMENT PLAN ===");
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
              };

              console.log(
                "Treatment plan payload:",
                JSON.stringify(treatmentPlanData, null, 2)
              );

              const treatmentResult =
                await treatmentService.createTreatmentPlan(treatmentPlanData);
              console.log("=== TREATMENT PLAN API RESPONSE ===");
              console.log("Treatment result:", treatmentResult);

              if (treatmentResult && treatmentResult.success) {
                console.log("=== TREATMENT PLAN CREATED SUCCESSFULLY ===");
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
      console.log("=== FINALLY: SETTING SUBMITTING TO FALSE ===");
      setSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Modal
      title={
        <Space>
          <MedicineBoxOutlined />
          <span>
            Khám bệnh -{" "}
            {appointment.customerName || `Bệnh nhân ${appointment.customerId}`}
          </span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
      className="consultation-modal"
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang tải thông tin bệnh nhân...</p>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={(errorInfo) => {
            console.log("=== FORM VALIDATION FAILED ===");
            console.log("Error info:", errorInfo);
            console.log("Failed fields:", errorInfo.errorFields);
            message.error("Vui lòng kiểm tra lại thông tin form");
          }}
          initialValues={{
            followUpRequired: false,
            nextAppointmentDate: dayjs().add(1, "week"),
            startDate: dayjs(),
            currentPhase: existingTreatmentPlan?.currentPhase || 1,
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
                    {patientData?.name}
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
                    <Form.Item label="Giai đoạn hiện tại" name="currentPhase">
                      <Select>
                        <Option value={1}>Giai đoạn 1</Option>
                        <Option value={2}>Giai đoạn 2</Option>
                        <Option value={3}>Giai đoạn 3</Option>
                        <Option value={4}>Giai đoạn 4</Option>
                        <Option value={5}>Giai đoạn 5</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Mô tả tiến trình" name="phaseDescription">
                      <TextArea
                        rows={3}
                        placeholder="Mô tả chi tiết giai đoạn hiện tại..."
                      />
                    </Form.Item>

                    <Form.Item
                      label="Ngày giai đoạn tiếp theo"
                      name="nextPhaseDate"
                    >
                      <DatePicker style={{ width: "100%" }} />
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
                        rows={3}
                        placeholder="Mô tả chi tiết kế hoạch điều trị..."
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
