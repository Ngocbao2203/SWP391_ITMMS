import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Button,
  Form,
  Select,
  message,
  Table,
  Tag,
  Space,
  Tooltip,
  Card,
  Row,
  Col,
  Typography,
  Spin,
  DatePicker,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  InfoCircleOutlined,
  BarsOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { doctorService, authService } from "../../services";
import "../../styles/AppointmentSchedule.css";

const { Option } = Select;
const { Title, Text } = Typography;

// CSS inline để đảm bảo bảng hiển thị đúng
const tableStyle = {
  width: "100%",
  tableLayout: "fixed",
};

const columnStyle = {
  textAlign: "left",
  fontWeight: "bold",
};

const AppointmentSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isAppointmentDetailsVisible, setIsAppointmentDetailsVisible] =
    useState(false);
  const [isUpdateStatusVisible, setIsUpdateStatusVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusForm] = Form.useForm();
  // Mock data - replace with actual API calls
  const [doctorId, setDoctorId] = useState(null);
  const [error, setError] = useState(null);

  // Lấy ID bác sĩ đăng nhập
  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        if (currentUser.doctorId) {
          setDoctorId(currentUser.doctorId);
        } else if (currentUser.id && currentUser.role === "Doctor") {
          setDoctorId(currentUser.id);
        } else {
          console.error("Cannot find doctor ID in user profile");
          setError("Không tìm thấy thông tin bác sĩ");
        }
      } else {
        setError("Vui lòng đăng nhập để xem lịch khám");
        message.error("Vui lòng đăng nhập để xem lịch khám");
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin bác sĩ:", err);
      setError("Không thể lấy thông tin bác sĩ. Vui lòng đăng nhập lại.");
    }
  }, []);

  // Lấy lịch khám của bác sĩ
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) return;

      setLoading(true);
      console.log(`Fetching schedule for doctor ID: ${doctorId}`);

      try {
        // Gọi API lịch hẹn sử dụng getMySchedule
        const response = await doctorService.getMySchedule({
          date: selectedDate.format("YYYY-MM-DD"),
        });
        console.log("API response:", response);

        // Chuyển đổi dữ liệu từ API sang định dạng mà giao diện hiểu được
        const formattedAppointments = response.appointments.map(
          (appointment) => ({
            id: appointment.id,
            patientId: appointment.patientId || appointment.id.toString(),
            patientName: appointment.customerName,
            patientPhone: appointment.customerPhone,
            patientEmail: appointment.customerEmail || "",
            date: dayjs(response.date || appointment.date).format("YYYY-MM-DD"),
            time: appointment.timeSlot,
            service: appointment.type,
            status: appointment.status.toLowerCase(),
            notes: appointment.notes || "",
            medicalHistory: appointment.medicalHistory || "Chưa có thông tin",
            createdAt: appointment.createdAt
              ? dayjs(appointment.createdAt).format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD"),
          })
        );

        setAppointments(formattedAppointments);
        setError(null);
        console.log("Đã tải xong dữ liệu lịch hẹn", formattedAppointments);
      } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        message.error("Không thể tải lịch khám bệnh");
        setError("Không thể tải lịch khám bệnh");
      } finally {
        // Đảm bảo loading luôn được thiết lập thành false trong mọi trường hợp
        setLoading(false);
      }
    };

    // Đảm bảo fetchAppointments luôn được gọi
    fetchAppointments();
  }, [doctorId, selectedDate]); // Phụ thuộc vào doctorId và selectedDate để khi chọn ngày khác sẽ tải lại dữ liệu

  const getStatusTag = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "scheduled":
        return (
          <Tag color="blue" className="status-tag">
            Confirmed
          </Tag>
        );
      case "pending":
        return (
          <Tag color="orange" className="status-tag">
            Pending
          </Tag>
        );
      case "completed":
        return (
          <Tag color="green" className="status-tag">
            Completed
          </Tag>
        );
      case "cancelled":
        return (
          <Tag color="red" className="status-tag">
            Cancelled
          </Tag>
        );
      default:
        return (
          <Tag color="default" className="status-tag">
            {status}
          </Tag>
        );
    }
  };
  // Hàm để tải lại lịch khám
  const reloadSchedule = async () => {
    if (!doctorId) {
      message.warning("Không tìm thấy thông tin bác sĩ");
      return;
    }

    message.loading("Đang tải lịch khám...");
    setLoading(true);

    try {
      // Gọi API lịch hẹn sử dụng getMySchedule
      const response = await doctorService.getMySchedule({
        date: selectedDate.format("YYYY-MM-DD"),
      });
      console.log("API response:", response);

      // Chuyển đổi dữ liệu từ API sang định dạng mà giao diện hiểu được
      const formattedAppointments = response.appointments.map(
        (appointment) => ({
          id: appointment.id,
          patientId: appointment.patientId || appointment.id.toString(),
          patientName: appointment.customerName,
          patientPhone: appointment.customerPhone,
          patientEmail: appointment.customerEmail || "",
          date: dayjs(response.date || appointment.date).format("YYYY-MM-DD"),
          time: appointment.timeSlot,
          service: appointment.type,
          status: appointment.status.toLowerCase(),
          notes: appointment.notes || "",
          medicalHistory: appointment.medicalHistory || "Chưa có thông tin",
          createdAt: appointment.createdAt
            ? dayjs(appointment.createdAt).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
        })
      );

      setAppointments(formattedAppointments);
      setError(null);
      message.success("Đã tải lịch khám thành công");
      console.log("Đã tải lại lịch khám thành công");
    } catch (error) {
      console.error("Error refreshing appointments:", error);
      setError("Không thể tải lịch khám bệnh");
      message.error("Không thể tải lịch khám bệnh");
    } finally {
      // Đảm bảo loading luôn được thiết lập thành false trong mọi trường hợp
      setLoading(false);
    }
  };

  const showAppointmentDetails = (appointment) => {
    setCurrentAppointment(appointment);
    setIsAppointmentDetailsVisible(true);
  };
  const showUpdateStatusModal = (appointment) => {
    setCurrentAppointment(appointment);
    statusForm.setFieldsValue({
      status: appointment.status,
    });
    setIsUpdateStatusVisible(true);
  };
  const handleCancel = () => {
    setIsAppointmentDetailsVisible(false);
    setIsUpdateStatusVisible(false);
  };

  const handleUpdateStatus = () => {
    statusForm
      .validateFields()
      .then(async (values) => {
        try {
          // Gọi API để cập nhật trạng thái lịch hẹn
          const appointmentService =
            require("../../services/appointmentService").default;
          await appointmentService.updateAppointmentStatus(
            currentAppointment.id,
            values.status
          );

          message.success("Cập nhật trạng thái lịch hẹn thành công");
          statusForm.resetFields();
          setIsUpdateStatusVisible(false);

          // Tải lại dữ liệu sau khi cập nhật
          reloadSchedule();
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          message.error("Không thể cập nhật trạng thái lịch hẹn");
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };
  const getDailyAppointments = useCallback(() => {
    // Sắp xếp theo thời gian
    return appointments.sort((a, b) => {
      const timeA = a.time.split("-")[0];
      const timeB = b.time.split("-")[0];
      return timeA.localeCompare(timeB);
    });
  }, [appointments]);

  const columns = [
    {
      title: "PATIENT",
      dataIndex: "patientName",
      key: "patientName",
      width: "25%",
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: "TIME SLOT",
      dataIndex: "time",
      key: "time",
      width: "20%",
      sorter: (a, b) => {
        const timeA = a.time.split("-")[0];
        const timeB = b.time.split("-")[0];
        return timeA.localeCompare(timeB);
      },
    },
    {
      title: "SERVICE",
      dataIndex: "service",
      key: "service",
      width: "25%",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Confirmed", value: "scheduled" },
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status.toLowerCase() === value,
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              icon={<InfoCircleOutlined />}
              size="small"
              onClick={() => showAppointmentDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Update Status">
            <Button
              type="default"
              icon={<EditOutlined />}
              size="small"
              onClick={() => showUpdateStatusModal(record)}
              disabled={record.status === "cancelled"}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="appointment-schedule-container">
      <div className="appointment-schedule-header">
        <Title level={2}>Appointment Schedule</Title>
      </div>
      <div className="appointments-container">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={reloadSchedule}
            >
              Thử lại
            </Button>
          </div>
        ) : (
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <BarsOutlined /> Appointments for{" "}
                  {selectedDate.format("MMMM D, YYYY")}
                </span>
                <div>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      // Reload appointments for the new date
                      const newDate = date || dayjs();
                      setSelectedDate(newDate);
                      // We don't need to manually reload as the dependency on selectedDate will trigger the useEffect
                    }}
                    allowClear={false}
                  />
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={reloadSchedule}
                    style={{ marginLeft: "10px" }}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            }
          >
            <Table
              dataSource={getDailyAppointments()}
              columns={columns}
              rowKey="id"
              size="small"
              pagination={false}
              locale={{ emptyText: "No appointments for this date" }}
              style={tableStyle}
              bordered
              className="appointment-table"
            />
          </Card>
        )}
      </div>
      {/* Appointment Details Modal */}
      <Modal
        title="Appointment Details"
        open={isAppointmentDetailsVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="update"
            type="primary"
            onClick={() => {
              handleCancel();
              showUpdateStatusModal(currentAppointment);
            }}
            disabled={
              currentAppointment && currentAppointment.status === "cancelled"
            }
          >
            Update Status
          </Button>,
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {currentAppointment && (
          <div className="appointment-details">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  title={
                    <span>
                      <CalendarOutlined /> Appointment Information
                    </span>
                  }
                  className="details-card"
                >
                  {" "}
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>
                        <Text strong>Date:</Text>{" "}
                        {dayjs(currentAppointment.date).format("MMMM D, YYYY")}
                      </p>
                      <p>
                        <Text strong>Time:</Text> {currentAppointment.time}
                      </p>
                      <p>
                        <Text strong>Service:</Text>{" "}
                        {currentAppointment.service}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <Text strong>Status:</Text>{" "}
                        {getStatusTag(currentAppointment.status)}
                      </p>
                      <p>
                        <Text strong>Created On:</Text>{" "}
                        {currentAppointment.createdAt}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  title={
                    <span>
                      <UserOutlined /> Patient Information
                    </span>
                  }
                  className="details-card"
                >
                  {" "}
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>
                        <Text strong>Name:</Text>{" "}
                        {currentAppointment.patientName}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <Text strong>Phone:</Text>{" "}
                        {currentAppointment.patientPhone}
                      </p>
                      <p>
                        <Text strong>Email:</Text>{" "}
                        {currentAppointment.patientEmail}
                      </p>
                    </Col>
                  </Row>
                  <div className="medical-history-section">
                    <Text strong>Medical History:</Text>
                    <p>
                      {currentAppointment.medicalHistory ||
                        "No medical history recorded"}
                    </p>
                  </div>
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  title={
                    <span>
                      <InfoCircleOutlined /> Notes
                    </span>
                  }
                  className="details-card"
                >
                  <p>{currentAppointment.notes || "No notes available"}</p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      {/* Update Status Modal */}
      <Modal
        title="Update Appointment Status"
        open={isUpdateStatusVisible}
        onOk={handleUpdateStatus}
        onCancel={handleCancel}
      >
        {currentAppointment && (
          <Form form={statusForm} layout="vertical">
            <div className="appointment-summary">
              <p>
                <Text strong>Patient:</Text> {currentAppointment.patientName}
              </p>
              <p>
                <Text strong>Date & Time:</Text>{" "}
                {dayjs(currentAppointment.date).format("MMMM D, YYYY")} at{" "}
                {currentAppointment.time}
              </p>
              <p>
                <Text strong>Service:</Text> {currentAppointment.service}
              </p>
              <p>
                <Text strong>Current Status:</Text>{" "}
                {getStatusTag(currentAppointment.status)}
              </p>
            </div>{" "}
            <Form.Item
              name="status"
              label="Update Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentSchedule;
