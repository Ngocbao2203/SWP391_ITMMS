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
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import moment from "moment";
import authService from "../../services/authService";
import treatmentService from "../../services/treatmentService";
import guestService from "../../services/guestService";
import patientService from "../../services/patientService";
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

      treatmentService
        .getCustomerTreatmentPlans(customerId)
        .then((data) => setTreatments(Array.isArray(data) ? data : []))
        .catch(() => setTreatments([]));

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

      patientService
        .getPatientMedicalHistory(customerId)
        .then((response) => {
          const records = response?.data?.medicalRecords || response || [];
          console.log("Medical history loaded:", records);
          setMedicalHistory(Array.isArray(records) ? records : []);
        })
        .catch((error) => {
          console.error("Failed to fetch medical history:", error);
          setMedicalHistory([]);
        })
        .finally(() => setLoading(false));
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
          <TabPane
            tab={
              <span>
                <FileTextOutlined /> Kết quả xét nghiệm
              </span>
            }
            key="tests"
          />
        </Tabs>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <Row gutter={[24, 24]} className="overview-content">
            <Col xs={24} lg={16}>
              <Card title="Thông tin cá nhân" className="info-card">
                <Descriptions
                  bordered
                  column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
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

            <Col xs={24} lg={8}>
              <Card title="Thông tin y tế" className="medical-stats-card">
                <div className="medical-statistics">
                  <Statistic
                    title="Chiều cao"
                    value={userData.height}
                    prefix={<InfoCircleOutlined />}
                  />
                  <Statistic
                    title="Cân nặng"
                    value={userData.weight}
                    prefix={<InfoCircleOutlined />}
                  />
                </div>

                <Divider />

                <div className="upcoming-appointment">
                  <Title level={5}>Lịch hẹn sắp tới</Title>
                  {appointments.filter(app => app.status === "scheduled").length > 0 ? (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {appointments.filter(app => app.status === "scheduled").map(appointment => (
                        <Card
                          key={appointment.id}
                          size="small"
                          style={{
                            marginBottom: "12px",
                            border: "1px solid #e6f7ff",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <Avatar
                              icon={<CalendarOutlined />}
                              style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: "500", color: "#1890ff", marginBottom: "4px" }}>
                                {moment(appointment.appointmentDate).format("DD/MM/YYYY")} - {appointment.timeSlot}
                              </div>
                              <div style={{ fontSize: "12px", color: "#666" }}>
                                <div>{appointment.type || "Khám bệnh"}</div>
                                <div>Bác sĩ: {appointment.doctor ? appointment.doctor.name : "Chưa xác định"}</div>
                              </div>
                            </div>
                            <Tag color={getStatusColor(appointment.status)} size="small">
                              {getStatusText(appointment.status)}
                            </Tag>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Empty description="Không có lịch hẹn sắp tới" />
                  )}
                </div>
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title="Điều trị hiện tại"
                className="current-treatment-card"
              >
                {treatments.length > 0 ? (
                  <div style={{ display: "grid", gap: "16px" }}>
                    {appointments
                      .sort((a, b) => moment(b.appointmentDate).diff(moment(a.appointmentDate)))
                      .map((item, index) => (
                        <Card
                          key={index}
                          size="small"
                          style={{
                            border: `1px solid ${item.status === "scheduled" ? "#e6f7ff" : "#f0f0f0"}`,
                            borderRadius: "12px",
                            background: item.status === "scheduled"
                              ? "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)"
                              : "linear-gradient(135deg, #f6f6f6 0%, #ffffff 100%)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                              <Avatar
                                icon={<CalendarOutlined />}
                                style={{
                                  backgroundColor: item.status === "scheduled" ? "#1890ff" : "#8c8c8c",
                                  flexShrink: 0,
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: "500",
                                    color: item.status === "scheduled" ? "#1890ff" : "#666",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                  }}
                                >
                                  Lịch hẹn {item.type || ""}
                                </div>
                                <div style={{ display: "grid", gap: "4px", fontSize: "12px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <ClockCircleOutlined style={{ color: "#1890ff" }} />
                                    <Text>
                                      Thời gian: {moment(item.appointmentDate).format("DD/MM/YYYY")} {item.timeSlot}
                                    </Text>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FileTextOutlined style={{ color: "#52c41a" }} />
                                    <Text>Loại: {item.type || "---"}</Text>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <UserSwitchOutlined style={{ color: "#722ed1" }} />
                                    <Text>Bác sĩ: {item.doctor?.name || "---"}</Text>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                              <Tag color={getStatusColor(item.status)} style={{ margin: 0 }}>
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
                ) : (
                  <Empty description="Không có điều trị đang diễn ra" />
                )}
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
                  <span>Lịch sử điều trị</span>
                </div>
              }
            >
              {medicalHistory.length === 0 ? (
                <Empty description="Chưa có quá trình điều trị nào." />
              ) : (
                <Timeline mode="left" style={{ marginTop: "16px" }}>
                  {medicalHistory.map((item, index) => (
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
                            {item.recordDate
                              ? moment(item.recordDate).format("DD/MM/YYYY")
                              : "---"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {item.recordDate
                              ? moment(item.recordDate).format("dddd")
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
                            <Text strong>Chẩn đoán:</Text>
                            <Text>{item.diagnosis || "---"}</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "8px",
                            }}
                          >
                            <MedicineBoxOutlined
                              style={{ color: "#52c41a", marginTop: "4px" }}
                            />
                            <Text strong>Phương pháp điều trị:</Text>
                            <Text>{item.treatment || "---"}</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <CalendarOutlined style={{ color: "#722ed1" }} />
                            <Text strong>Loại cuộc hẹn:</Text>
                            <Text>{item.appointmentType || "---"}</Text>
                          </div>
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
                          border: `1px solid ${item.status === "scheduled" ? "#e6f7ff" : "#f0f0f0"
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
                                  <FileTextOutlined
                                    style={{ color: "#52c41a" }}
                                  />
                                  <Text>Loại: {item.type || "---"}</Text>
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
                                  <Text>Bác Sĩ: {item.doctor ? item.doctor.name : "Chưa xác định"}</Text>
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

        {activeTab === "tests" && (
          <div className="tests-content">
            <Card className="tests-list-card" title="Kết quả xét nghiệm">
              <List
                className="tests-list"
                itemLayout="horizontal"
                dataSource={medicalHistory}
                renderItem={(record) => (
                  <List.Item
                    actions={[
                      <Button type="link">Xem kết quả chi tiết</Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<FileTextOutlined />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      }
                      title={
                        <div className="test-title">
                          <span>
                            {record.name ||
                              record.testName ||
                              "Kết quả xét nghiệm"}
                          </span>
                          {record.result === "Bình thường" ? (
                            <Tag color="success">Bình thường</Tag>
                          ) : (
                            <Tag color="warning">Cần theo dõi</Tag>
                          )}
                        </div>
                      }
                      description={
                        <div className="test-details">
                          <div>
                            <ClockCircleOutlined /> Ngày thực hiện:{" "}
                            {moment(record.date || record.recordDate).format(
                              "DD/MM/YYYY"
                            )}
                          </div>
                          <div>
                            <UserOutlined /> Bác sĩ:{" "}
                            {record.doctor || record.doctorName || "---"}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
