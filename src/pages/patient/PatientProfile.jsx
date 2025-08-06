import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Space,
  Typography,
  Tabs,
  Descriptions,
  Tag,
  Divider,
  Statistic,
  Dropdown,
  List,
  Empty,
  Input,
  DatePicker,
  message,
  Badge,
  Timeline,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  HourglassOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  ExclamationCircleOutlined,
  UserSwitchOutlined,
  PercentageOutlined,
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import moment from "moment";
import authService from "../../services/authService";
import treatmentService from "../../services/treatmentService";
import guestService from "../../services/guestService";
import patientService from "../../services/patientService";
import treatmentFlowService from "../../services/treatmentFlowService";
import "../../styles/PatientProfile.css";
import "moment/locale/vi";

moment.locale("vi");

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.id) {
      setLoading(true);
      authService
        .getUserProfile(storedUser.id)
        .then((profile) => {
          setUserData({
            ...profile,
            treatments: profile.treatments || [],
            appointments: profile.appointments || [],
            medicalTests: profile.medicalTests || [],
            allergies: profile.allergies || [],
          });
          setEditableData({
            ...profile,
            treatments: profile.treatments || [],
            appointments: profile.appointments || [],
            medicalTests: profile.medicalTests || [],
            allergies: profile.allergies || [],
          });
        })
        .catch(() => message.error("Không thể tải thông tin hồ sơ!"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.customer?.id) {
      setLoading(true);
      const customerId = storedUser.customer.id;
      console.log("Loading profile for customer ID:", customerId);

      // Kiểm tra và lấy avatar URL nếu có
      if (storedUser.avatar) {
        setAvatarUrl(storedUser.avatar);
      }

      setUserData({
        ...storedUser,
        ...storedUser.customer,
      });

      // Lấy dữ liệu kế hoạch điều trị sử dụng API mới TreatmentFlow
      treatmentFlowService
        .getPatientTreatmentFlow(customerId)
        .then((response) => {
          console.log("Treatment Flow API response:", response);
          console.log("Treatment Flow API response type:", typeof response);
          console.log(
            "Treatment Flow API response keys:",
            response ? Object.keys(response) : "No response"
          );

          if (!response) {
            console.log("No treatment flow data found");
            setTreatments([]);
            return;
          }

          // Kiểm tra xem response có phải là array không
          if (Array.isArray(response)) {
            console.log("Response is an array with length:", response.length);

            if (response.length === 0) {
              setTreatments([]);
              return;
            }

            // Hiển thị dữ liệu sống để phân tích
            console.log(
              "First item in array:",
              JSON.stringify(response[0], null, 2)
            );

            // Hiển thị cấu trúc chi tiết của response để phân tích
            if (response.length > 0) {
              console.log(
                "Full detailed first item:",
                JSON.stringify(response[0], null, 2)
              );
            }

            // Trực tiếp sử dụng mảng từ response
            const formattedTreatments = response.map((item) => {
              // In ra toàn bộ đối tượng để phân tích
              console.log(
                "Treatment item from API:",
                JSON.stringify(item, null, 2)
              );

              // Tìm tên bác sĩ từ các vị trí có thể
              let doctorName = "---";
              let serviceName = "---";

              // 1. Kiểm tra trường doctorName trong item
              if (item.doctorName) {
                doctorName = item.doctorName;
                console.log("Found doctorName in item:", doctorName);
              }

              // 2. Kiểm tra trường doctor
              else if (item.doctor) {
                if (typeof item.doctor === "string") {
                  doctorName = item.doctor;
                } else if (typeof item.doctor === "object") {
                  doctorName =
                    item.doctor.name ||
                    item.doctor.fullName ||
                    (item.doctor.firstName && item.doctor.lastName
                      ? `${item.doctor.firstName} ${item.doctor.lastName}`
                      : item.doctor.firstName || item.doctor.lastName);
                }
                console.log("Found doctor info:", doctorName);
              }

              // 3. Kiểm tra trong medicalHistory nếu có
              else if (
                item.medicalHistory &&
                Array.isArray(item.medicalHistory) &&
                item.medicalHistory.length > 0
              ) {
                const lastMedicalRecord =
                  item.medicalHistory[item.medicalHistory.length - 1];
                if (lastMedicalRecord && lastMedicalRecord.doctorName) {
                  doctorName = lastMedicalRecord.doctorName;
                  console.log(
                    "Found doctorName in medicalHistory:",
                    doctorName
                  );
                }
              }

              // 4. Tìm trường có thể chứa tên dịch vụ
              // Kiểm tra trong đối tượng treatmentService nếu có
              if (item.treatmentService) {
                if (typeof item.treatmentService === "object") {
                  serviceName =
                    item.treatmentService.serviceName ||
                    item.treatmentService.name ||
                    "---";
                  console.log(
                    "Found serviceName in treatmentService object:",
                    serviceName
                  );
                } else if (typeof item.treatmentService === "string") {
                  serviceName = item.treatmentService;
                  console.log(
                    "Found serviceName in treatmentService string:",
                    serviceName
                  );
                }
              }
              // Kiểm tra trong trường treatmentPlan.treatmentService
              else if (
                item.treatmentPlan &&
                item.treatmentPlan.treatmentService
              ) {
                if (typeof item.treatmentPlan.treatmentService === "object") {
                  serviceName =
                    item.treatmentPlan.treatmentService.serviceName ||
                    item.treatmentPlan.treatmentService.name ||
                    "---";
                  console.log(
                    "Found serviceName in treatmentPlan.treatmentService:",
                    serviceName
                  );
                } else if (
                  typeof item.treatmentPlan.treatmentService === "string"
                ) {
                  serviceName = item.treatmentPlan.treatmentService;
                  console.log(
                    "Found serviceName in treatmentPlan.treatmentService string:",
                    serviceName
                  );
                }
              }
              // Kiểm tra các trường khác
              else if (item.serviceName) {
                serviceName = item.serviceName;
                console.log("Found serviceName directly in item:", serviceName);
              } else if (item.service) {
                serviceName =
                  typeof item.service === "string"
                    ? item.service
                    : item.service && typeof item.service === "object"
                    ? item.service.name || item.service.serviceName
                    : "---";
                console.log("Found service info in item.service:", serviceName);
              }

              // Kiểm tra thêm trong cấu trúc API console
              if (
                (item.treatmentPlan &&
                  item.treatmentPlan.doctor &&
                  !doctorName) ||
                doctorName === "---"
              ) {
                // Nếu có thông tin bác sĩ trong treatmentPlan
                if (typeof item.treatmentPlan.doctor === "object") {
                  doctorName = item.treatmentPlan.doctor.name || "---";
                  console.log("Found doctor in treatmentPlan:", doctorName);
                }
              }

              // Tạo đối tượng mới với thông tin đã tìm thấy
              return {
                id: item.id || Math.random(),
                doctorName: doctorName,
                serviceName: serviceName,
                // Chỉ giữ lại status và ngày bắt đầu, loại bỏ các thông tin không cần thiết
                status: item.status || "Active",
                startDate: item.startDate || item.createdAt,

                // Thông tin giai đoạn hiện tại
                currentPhase: item.currentPhase || "1",
                phaseDescription:
                  item.phaseDescription || "Giai đoạn khởi đầu điều trị",

                // Lấy và chuẩn hóa thông tin giai đoạn từ API
                phases: (() => {
                  // Kiểm tra các nguồn dữ liệu giai đoạn khác nhau
                  if (
                    item.phases &&
                    Array.isArray(item.phases) &&
                    item.phases.length > 0
                  ) {
                    console.log("Using phases from item.phases:", item.phases);
                    return item.phases;
                  }

                  if (
                    item.flow &&
                    Array.isArray(item.flow) &&
                    item.flow.length > 0
                  ) {
                    console.log("Using phases from item.flow:", item.flow);
                    return item.flow;
                  }

                  // Nếu không có thông tin giai đoạn, tạo mặc định từ thông tin hiện có
                  console.log("Creating default phase from item info");
                  return [
                    {
                      phaseNumber: item.currentPhase || "1",
                      description:
                        item.phaseDescription || "Giai đoạn điều trị hiện tại",
                      active: true,
                      completed: false,
                      startDate: item.startDate || new Date(),
                      estimatedDate: item.nextPhaseDate || item.nextVisitDate,
                    },
                  ];
                })(),
              };
            });

            console.log("Formatted Treatment Plans:", formattedTreatments);
            setTreatments(formattedTreatments);
            return;
          }

          // Xử lý cấu trúc object
          // Chuyển đổi dữ liệu từ API mới để phù hợp với cấu trúc hiển thị
          const treatmentPlan = response.treatmentPlan;

          if (treatmentPlan) {
            const formattedTreatmentPlan = {
              id: treatmentPlan.id || 1,
              doctor: treatmentPlan.doctor || { name: "---" },
              treatmentService: treatmentPlan.treatmentService || {
                serviceName: "---",
              },
              treatmentType: treatmentPlan.treatmentType || "---",
              description: treatmentPlan.description || "---",
              status: treatmentPlan.status || "Active",
              startDate: treatmentPlan.startDate,
              currentPhase: response.currentPhase?.phaseNumber || "1",
              phaseDescription:
                response.currentPhase?.description ||
                "Giai đoạn khởi đầu điều trị",
              nextVisitDate: treatmentPlan.nextVisitDate,
              totalCost: treatmentPlan.totalCost,
              paymentStatus: treatmentPlan.paymentStatus || "Pending",
              // Thêm thông tin về dòng điều trị
              flow: response.phases || [],
              currentPhaseDetails: response.currentPhase,
            };

            console.log("Formatted Treatment Plan:", formattedTreatmentPlan);
            setTreatments([formattedTreatmentPlan]);
          } else if (
            response &&
            Array.isArray(response) &&
            response.length > 0
          ) {
            // API trả về mảng trực tiếp (cấu trúc khác với mong đợi)
            console.log(
              "Response appears to be a direct array - attempting to use this format"
            );

            // Tạo danh sách các kế hoạch điều trị từ dữ liệu trả về
            const treatmentPlans = response.map((item) => ({
              id: item.id || Math.random(),
              doctor: { name: item.doctor?.name || item.doctorName || "---" },
              treatmentService: {
                serviceName: item.service || item.serviceName || "---",
              },
              treatmentType: item.treatmentType || "---",
              description: item.description || "---",
              status: item.status || "Active",
              startDate: item.startDate || item.createdAt,
              currentPhase: item.currentPhase || "1",
              phaseDescription: item.phaseDescription || "Giai đoạn điều trị",
              nextVisitDate: item.nextVisitDate || item.nextPhaseDate,
              totalCost: item.totalCost,
              paymentStatus: item.paymentStatus || "Pending",
              // Thông tin về các giai đoạn (nếu có)
              flow: Array.isArray(item.phases) ? item.phases : [],
            }));

            console.log("Mapped treatment plans:", treatmentPlans);
            setTreatments(treatmentPlans);
          } else {
            console.log("No valid treatment plan data found in the response");
            setTreatments([]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch treatment flow:", error);
          setTreatments([]);
        });

      // Trong useEffect cho appointments
      guestService
        .getMyAppointments()
        .then((response) => {
          console.log("Raw Appointments response from guestService:", response); // Log toàn bộ response
          const appointmentsData = Array.isArray(response.appointments) // Thay response.data.appointments bằng response.appointments
            ? response.appointments
            : Array.isArray(response.data?.appointments)
            ? response.data.appointments
            : [];
          console.log("Processed Appointments data:", appointmentsData); // Debug dữ liệu sau xử lý
          setAppointments(appointmentsData);
        })
        .catch((error) => {
          console.error("Failed to fetch appointments:", error);
          setAppointments([]);
        });

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditableData({ ...userData });
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    const storedUser = authService.getCurrentUser();
    if (!storedUser || !storedUser.id) return;
    setLoading(true);
    try {
      const res = await authService.updateProfile(storedUser.id, {
        fullName: editableData.fullName,
        phone: editableData.phone,
        address: editableData.address,
      });
      if (res.success) {
        setUserData({ ...userData, ...editableData });
        setEditMode(false);
        message.success("Cập nhật hồ sơ thành công!");
      } else {
        message.error(res.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setEditableData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "processing";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "in-progress":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Đã lên lịch";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "in-progress":
        return "Đang điều trị";
      default:
        return status;
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!userData) return <div>Không có dữ liệu hồ sơ.</div>;

  const displayBirthDate =
    userData.birthDate &&
    moment(userData.birthDate, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid()
      ? moment(userData.birthDate, ["YYYY-MM-DD", "DD/MM/YYYY"]).format(
          "DD/MM/YYYY"
        )
      : "Chưa cập nhật";

  const displayAge =
    userData.birthDate &&
    moment(userData.birthDate, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid()
      ? `${moment().diff(
          moment(userData.birthDate, ["YYYY-MM-DD", "DD/MM/YYYY"]),
          "years"
        )} tuổi`
      : "Chưa cập nhật";

  return (
    <div className="patient-profile-container">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "name",
                    label: userData.fullName,
                    disabled: true,
                    style: { color: "#1890ff", fontWeight: "bold" },
                  },
                  { type: "divider" },
                  {
                    key: "profile",
                    label: "Hồ sơ cá nhân",
                    icon: <UserOutlined />,
                  },
                  { type: "divider" },
                  {
                    key: "logout",
                    label: "Đăng xuất",
                    icon: <LogoutOutlined />,
                  },
                ],
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className="avatar-dropdown-trigger">
                <div className="avatar-upload-wrapper">
                  <Avatar
                    size={90}
                    icon={<UserOutlined />}
                    className="patient-avatar"
                    src={avatarUrl || userData.avatar || null}
                  />
                  {/* Đã xóa nút Upload chọn ảnh */}
                </div>
              </div>
            </Dropdown>
            <div className="patient-basic-info">
              <div className="patient-name-id">
                <Title level={3} className="patient-name">
                  {userData.fullName}
                </Title>
                {/* Đã xóa hiển thị ID bệnh nhân */}
              </div>
              <div className="patient-metadata">
                {userData.birthDate &&
                  moment(userData.birthDate, [
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                  ]).isValid() && (
                    <Tag icon={<CalendarOutlined />}>{displayAge}</Tag>
                  )}
                <Tag icon={<SafetyOutlined />}>{userData.bloodType}</Tag>
                {userData.status === "Đang điều trị" && (
                  <Tag color="processing" icon={<HourglassOutlined />}>
                    Đang điều trị
                  </Tag>
                )}
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <Space>
              {/* <<<<<<< HEAD
              <Button
                type={editMode ? "default" : "primary"}
                icon={editMode ? null : <EditOutlined />}
                onClick={handleEditToggle}
              >
                {editMode ? "Hủy" : "Chỉnh sửa"}
              </Button>
              {editMode && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleSaveChanges}
                >
                  Lưu thay đổi
                </Button>
======= */}
              {activeTab === "overview" && (
                <>
                  <Button
                    type={editMode ? "default" : "primary"}
                    icon={editMode ? null : <EditOutlined />}
                    onClick={handleEditToggle}
                  >
                    {editMode ? "Hủy" : "Chỉnh sửa"}
                  </Button>
                  {editMode && (
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={handleSaveChanges}
                    >
                      Lưu thay đổi
                    </Button>
                  )}
                </>
                // >>>>>>> 0be1c7442e0451e6570771ffaa15ecb5e8d1afda
              )}
            </Space>
          </div>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="profile-navigation-tabs"
        >
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined /> Tổng quan
              </span>
            }
            key="overview"
          />
          <TabPane
            tab={
              <span>
                <MedicineBoxOutlined /> Điều trị
              </span>
            }
            key="treatments"
          />
          <TabPane
            tab={
              <span>
                <CalendarOutlined /> Lịch hẹn
              </span>
            }
            key="appointments"
          />
        </Tabs>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <Row gutter={[24, 24]} className="overview-content">
            <Col xs={24} lg={24}>
              <Card title="Thông tin cá nhân" className="info-card">
                <Descriptions
                  bordered
                  column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
                  labelStyle={{ fontWeight: "500" }}
                >
                  <Descriptions.Item label="Họ và tên">
                    {editMode ? (
                      <Input
                        value={editableData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                      />
                    ) : (
                      userData.fullName
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên đăng nhập">
                    {editMode ? (
                      <Input
                        value={editableData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        disabled
                      />
                    ) : (
                      userData.username
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {editMode ? (
                      <Input
                        value={editableData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      userData.email
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {editMode ? (
                      <Input
                        value={editableData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    ) : (
                      userData.phone
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ liên hệ">
                    {editMode ? (
                      <Input
                        value={editableData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />
                    ) : (
                      userData.address
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {editMode ? (
                      <DatePicker
                        value={
                          editableData.birthDate
                            ? moment(editableData.birthDate, [
                                "YYYY-MM-DD",
                                "DD/MM/YYYY",
                              ])
                            : null
                        }
                        onChange={(date) =>
                          handleInputChange(
                            "birthDate",
                            date ? date.format("YYYY-MM-DD") : null
                          )
                        }
                        format="DD/MM/YYYY"
                      />
                    ) : (
                      displayBirthDate
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === "treatments" && (
          <div className="treatments-content">
            <Card
              className="treatments-list-card"
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MedicineBoxOutlined style={{ color: "#1890ff" }} />
                  <span>Kế Hoạch Điều Trị</span>
                </div>
              }
            >
              {treatments.length === 0 ? (
                <Empty description="Chưa có kế hoạch điều trị nào." />
              ) : (
                <Timeline mode="left" style={{ marginTop: "16px" }}>
                  {console.log("Treatment data structure:", treatments)}
                  {treatments.map((item, index) => (
                    <Timeline.Item
                      key={index}
                      dot={
                        <Avatar
                          size="small"
                          icon={<MedicineBoxOutlined />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      }
                      label={
                        <div style={{ minWidth: "120px", textAlign: "right" }}>
                          <div style={{ fontWeight: "500", color: "#1890ff" }}>
                            {item.startDate
                              ? moment(item.startDate).format("DD/MM/YYYY")
                              : item.createdAt
                              ? moment(item.createdAt).format("DD/MM/YYYY")
                              : "---"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {item.startDate
                              ? moment(item.startDate).format("dddd")
                              : item.createdAt
                              ? moment(item.createdAt).format("dddd")
                              : ""}
                          </div>
                        </div>
                      }
                    >
                      <Card
                        size="small"
                        style={{
                          marginBottom: "12px",
                          border: "1px solid #e6f7ff",
                          borderRadius: "8px",
                          background: "#fafafa",
                        }}
                      >
                        <div style={{ display: "grid", gap: "8px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <UserSwitchOutlined style={{ color: "#1890ff" }} />
                            <Text strong>Bác sĩ:</Text>
                            <Text>{item.doctorName || "---"}</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "8px",
                            }}
                          >
                            <ExclamationCircleOutlined
                              style={{ color: "#fa541c", marginTop: "4px" }}
                            />
                            <Text strong>Dịch vụ:</Text>
                            <Text>{item.serviceName || "---"}</Text>
                          </div>
                          {/* Đã loại bỏ phần hiển thị loại điều trị và mô tả theo yêu cầu */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <CalendarOutlined style={{ color: "#722ed1" }} />
                            <Text strong>Trạng thái:</Text>
                            <Tag
                              color={
                                item.status === "Completed"
                                  ? "success"
                                  : item.status === "Pending"
                                  ? "warning"
                                  : item.status === "Active"
                                  ? "processing"
                                  : "default"
                              }
                            >
                              {item.status === "Completed"
                                ? "Đã hoàn thành"
                                : item.status === "Pending"
                                ? "Chờ xử lý"
                                : item.status === "Active"
                                ? "Đang tiến hành"
                                : item.status}
                            </Tag>
                          </div>
                          {item.phaseDescription && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "8px",
                              }}
                            >
                              <FileTextOutlined
                                style={{ color: "#13c2c2", marginTop: "4px" }}
                              />
                              <Text strong>Giai đoạn hiện tại:</Text>
                              <Text>
                                {item.phaseDescription} (Giai đoạn{" "}
                                {item.currentPhase})
                              </Text>
                            </div>
                          )}

                          {/* Hiển thị thông tin dòng điều trị nếu có */}
                          {item.phases && item.phases.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "8px",
                                marginTop: "10px",
                                border: "1px solid #e6f7ff",
                                padding: "10px",
                                borderRadius: "8px",
                                backgroundColor: "#f0f9ff",
                              }}
                            >
                              <div style={{ width: "100%" }}>
                                <Text
                                  strong
                                  style={{ fontSize: "14px", color: "#1890ff" }}
                                >
                                  Tiến trình điều trị:
                                </Text>
                              </div>

                              <Timeline
                                style={{
                                  width: "100%",
                                  marginTop: "8px",
                                  marginBottom: "0",
                                }}
                              >
                                {item.phases.map((phase, phaseIndex) => (
                                  <Timeline.Item
                                    key={phaseIndex}
                                    color={
                                      phase.completed
                                        ? "green"
                                        : phase.active
                                        ? "blue"
                                        : "gray"
                                    }
                                    dot={
                                      phase.completed ? (
                                        <CheckCircleOutlined
                                          style={{ fontSize: "16px" }}
                                        />
                                      ) : phase.active ? (
                                        <ClockCircleOutlined
                                          style={{ fontSize: "16px" }}
                                        />
                                      ) : undefined
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Text strong style={{ fontSize: "13px" }}>
                                        Giai đoạn {phase.phaseNumber}:{" "}
                                        {phase.description}
                                      </Text>
                                      <Text
                                        type={
                                          phase.completed || phase.active
                                            ? "normal"
                                            : "secondary"
                                        }
                                        style={{ fontSize: "12px" }}
                                      >
                                        {phase.completed ? (
                                          <span>
                                            Hoàn thành vào{" "}
                                            {moment(
                                              phase.completionDate
                                            ).format("DD/MM/YYYY")}
                                          </span>
                                        ) : phase.active ? (
                                          <span>
                                            Đang thực hiện (từ{" "}
                                            {moment(phase.startDate).format(
                                              "DD/MM/YYYY"
                                            )}
                                            )
                                          </span>
                                        ) : (
                                          <span>
                                            Dự kiến:{" "}
                                            {moment(phase.estimatedDate).format(
                                              "DD/MM/YYYY"
                                            )}
                                          </span>
                                        )}
                                      </Text>
                                    </div>
                                  </Timeline.Item>
                                ))}
                              </Timeline>
                            </div>
                          )}
                          {item.nextVisitDate && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <CalendarOutlined style={{ color: "#13c2c2" }} />
                              <Text strong>Lịch tái khám:</Text>
                              <Text>
                                {moment(item.nextVisitDate).format(
                                  "DD/MM/YYYY"
                                )}
                              </Text>
                            </div>
                          )}
                          {item.totalCost && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <DollarOutlined style={{ color: "#52c41a" }} />
                              <Text strong>Tổng chi phí:</Text>
                              <Text>
                                {typeof item.totalCost === "number"
                                  ? item.totalCost.toLocaleString()
                                  : item.totalCost}{" "}
                                VNĐ
                              </Text>
                            </div>
                          )}
                          {item.paymentStatus && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <CreditCardOutlined
                                style={{ color: "#722ed1" }}
                              />
                              <Text strong>Trạng thái thanh toán:</Text>
                              <Tag
                                color={
                                  item.paymentStatus === "Completed"
                                    ? "success"
                                    : "warning"
                                }
                              >
                                {item.paymentStatus === "Completed"
                                  ? "Đã thanh toán"
                                  : item.paymentStatus === "Pending"
                                  ? "Chưa thanh toán"
                                  : item.paymentStatus}
                              </Tag>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </Card>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="appointments-content">
            <Card
              className="appointments-list-card"
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CalendarOutlined style={{ color: "#1890ff" }} />
                  <span>Lịch hẹn</span>
                  <Badge
                    count={
                      appointments.filter((app) => app.status === "scheduled")
                        .length
                    }
                  />
                </div>
              }
            >
              {appointments.length === 0 ? (
                <Empty description="Chưa có lịch hẹn nào." />
              ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                  {appointments
                    .sort((a, b) =>
                      moment(b.appointmentDate).diff(moment(a.appointmentDate))
                    )
                    .map((item, index) => (
                      <Card
                        key={index}
                        size="small"
                        style={{
                          border: `1px solid ${
                            item.status === "scheduled" ? "#e6f7ff" : "#f0f0f0"
                          }`,
                          borderRadius: "12px",
                          background:
                            item.status === "scheduled"
                              ? "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)"
                              : "linear-gradient(135deg, #f6f6f6 0%, #ffffff 100%)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              flex: 1,
                            }}
                          >
                            <Avatar
                              icon={<CalendarOutlined />}
                              style={{
                                backgroundColor:
                                  item.status === "scheduled"
                                    ? "#1890ff"
                                    : "#8c8c8c",
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: "500",
                                  color:
                                    item.status === "scheduled"
                                      ? "#1890ff"
                                      : "#666",
                                  marginBottom: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                Lịch hẹn {item.type || ""}
                              </div>
                              <div
                                style={{
                                  display: "grid",
                                  gap: "4px",
                                  fontSize: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <ClockCircleOutlined
                                    style={{ color: "#1890ff" }}
                                  />
                                  <Text>
                                    Thời gian:{" "}
                                    {item.appointmentDate
                                      ? moment(item.appointmentDate).format(
                                          "DD/MM/YYYY"
                                        )
                                      : "---"}{" "}
                                    {item.timeSlot || ""}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <UserSwitchOutlined
                                    style={{ color: "#722ed1" }}
                                  />
                                  <Text>
                                    Bác Sĩ:{" "}
                                    {item.doctor
                                      ? item.doctor.name
                                      : "Chưa xác định"}
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: "8px",
                            }}
                          >
                            <Tag
                              color={getStatusColor(item.status)}
                              style={{ margin: 0 }}
                            >
                              {getStatusText(item.status)}
                            </Tag>
                            {item.status === "scheduled" && (
                              <div style={{ fontSize: "11px", color: "#666" }}>
                                {moment(item.appointmentDate).fromNow()}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
