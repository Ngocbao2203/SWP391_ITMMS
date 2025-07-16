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
import "../../styles/AppointmentSchedule.css";

// Hằng số trạng thái lịch hẹn
const APPOINTMENT_STATUS = {
  SCHEDULED: "Scheduled",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

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

const datePickerStyle = {
  width: "200px",
  marginLeft: 16,
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
  const [error, setError] = useState(null);

  // Lấy lịch khám của bác sĩ
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);

      // Log current user info when fetching appointments
      // Import authService
      const authService = require("../../services/authService").default;
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        console.log("Doctor fetching appointments - User info:", {
          id: currentUser.id,
          role: currentUser.role,
          doctorId: currentUser.doctor?.id || "Not available",
        });

        // Check if doctor info exists
        if (!currentUser.doctor || !currentUser.doctor.id) {
          console.error("Missing doctor information in user object");
          setError("Không thể tải lịch khám bệnh: Thiếu thông tin bác sĩ");
          setLoading(false);
          return;
        }
      } else {
        console.error("No user is currently logged in");
        setError("Vui lòng đăng nhập để xem lịch khám bệnh");
        setLoading(false);
        return;
      }

      try {
        // Import doctorService từ services
        const doctorService = require("../../services/doctorService").default;

        // Lấy doctorId từ thông tin người dùng
        const doctorId = currentUser.doctor.id;
        console.log("Fetching schedule for doctorId:", doctorId);

        // Chuẩn bị tham số ngày (format: YYYY-MM-DD)
        const dateParam = selectedDate
          ? selectedDate.format("YYYY-MM-DD")
          : null;
        console.log("Fetching appointments for date:", dateParam);

        // Gọi API lịch hẹn sử dụng getDoctorSchedule từ doctorService với tham số ngày
        const response = await doctorService.getDoctorSchedule(
          doctorId,
          dateParam
        );
        console.log("API response:", response);

        // Kiểm tra cấu trúc phản hồi và truy cập đúng dữ liệu
        const appointmentsData = response.appointments || [];
        console.log("Dữ liệu cuộc hẹn:", appointmentsData);

        // Chuyển đổi dữ liệu từ API sang định dạng mà giao diện hiểu được
        const formattedAppointments = appointmentsData.map((appointment) => ({
          id: appointment.id,

          patientName: appointment.customerName || "Chưa có tên",
          patientPhone: appointment.customerPhone || "Chưa có SĐT",
          date: appointment.appointmentDate
            ? dayjs(appointment.appointmentDate).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
          time: appointment.timeSlot || "Chưa xác định",
          service: appointment.type || "Khám tổng quát",
          status: (appointment.status || "pending").toLowerCase(),
          notes: appointment.notes || "",
          medicalHistory: appointment.medicalHistory || "Chưa có thông tin",
          createdAt: appointment.createdAt
            ? dayjs(appointment.createdAt).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
        }));

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
  }, [selectedDate]); // Chỉ phụ thuộc vào selectedDate để khi chọn ngày khác sẽ tải lại dữ liệu

  const getStatusTag = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return (
          <Tag color="cyan" className="status-tag">
            {APPOINTMENT_STATUS.SCHEDULED}
          </Tag>
        );
      case "confirmed":
        return (
          <Tag color="blue" className="status-tag">
            {APPOINTMENT_STATUS.CONFIRMED}
          </Tag>
        );

      case "in progress":
        return (
          <Tag color="orange" className="status-tag">
            {APPOINTMENT_STATUS.IN_PROGRESS}
          </Tag>
        );
      case "completed":
        return (
          <Tag color="green" className="status-tag">
            {APPOINTMENT_STATUS.COMPLETED}
          </Tag>
        );
      case "cancelled":
        return (
          <Tag color="red" className="status-tag">
            {APPOINTMENT_STATUS.CANCELLED}
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
    message.loading("Đang tải lịch khám...");
    setLoading(true);

    try {
      // Import doctorService và authService từ services
      const doctorService = require("../../services/doctorService").default;
      const authService = require("../../services/authService").default;

      // Lấy thông tin người dùng hiện tại
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.doctor || !currentUser.doctor.id) {
        console.error("Missing doctor information");
        throw new Error("Missing doctor information");
      }

      // Lấy doctorId từ thông tin người dùng
      const doctorId = currentUser.doctor.id;
      console.log("Reloading schedule for doctorId:", doctorId);

      // Chuẩn bị tham số ngày (format: YYYY-MM-DD)
      const dateParam = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;
      console.log("Reloading appointments for date:", dateParam);

      // Gọi API lịch hẹn sử dụng getDoctorSchedule từ doctorService với tham số ngày
      const response = await doctorService.getDoctorSchedule(
        doctorId,
        dateParam
      );
      console.log("API response:", response);

      // Kiểm tra cấu trúc phản hồi và truy cập đúng dữ liệu
      const appointmentsData = response.appointments || [];
      console.log("Dữ liệu cuộc hẹn:", appointmentsData);

      // Chuyển đổi dữ liệu từ API sang định dạng mà giao diện hiểu được
      const formattedAppointments = appointmentsData.map((appointment) => ({
        id: appointment.id,
        patientId: appointment.customerId || appointment.id.toString(),
        patientName: appointment.customerName || "Chưa có tên",
        patientPhone: appointment.customerPhone || "Chưa có SĐT",

        date: appointment.appointmentDate
          ? dayjs(appointment.appointmentDate).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
        time: appointment.timeSlot || "Chưa xác định",
        service: appointment.type || "Khám tổng quát",
        status: (appointment.status || "pending").toLowerCase(),
        notes: appointment.notes || "",
        medicalHistory: appointment.medicalHistory || "Chưa có thông tin",
        createdAt: appointment.createdAt
          ? dayjs(appointment.createdAt).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
      }));

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

    // Chuyển đổi status từ lowercase sang Title Case (chỉ viết hoa chữ cái đầu)
    let statusValue = "";

    switch (appointment.status.toLowerCase()) {
      case "scheduled":
        statusValue = "Scheduled";
        break;
      case "confirmed":
        statusValue = "Confirmed";
        break;

      case "in progress":
        statusValue = "In Progress";
        break;
      case "completed":
        statusValue = "Completed";
        break;
      case "cancelled":
        statusValue = "Cancelled";
        break;
      default:
        statusValue = appointment.status;
    }

    statusForm.setFieldsValue({
      status: statusValue,
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

          const result = await appointmentService.updateAppointmentStatus(
            currentAppointment.id,
            values.status
          );

          if (result.success) {
            message.success("Cập nhật trạng thái lịch hẹn thành công");
            statusForm.resetFields();
            setIsUpdateStatusVisible(false);

            // Tải lại dữ liệu sau khi cập nhật
            reloadSchedule();
          } else {
            message.error(
              result.message || "Không thể cập nhật trạng thái lịch hẹn"
            );
          }
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
      title: "BỆNH NHÂN",
      dataIndex: "patientName",
      key: "patientName",
      width: "25%",
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: "KHUNG GIỜ",
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
      title: "DỊCH VỤ",
      dataIndex: "service",
      key: "service",
      width: "25%",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => getStatusTag(status),
      filters: [
        { text: APPOINTMENT_STATUS.SCHEDULED, value: "scheduled" },
        { text: APPOINTMENT_STATUS.CONFIRMED, value: "confirmed" },
        { text: APPOINTMENT_STATUS.IN_PROGRESS, value: "in_progress" },
        { text: APPOINTMENT_STATUS.COMPLETED, value: "completed" },
        { text: APPOINTMENT_STATUS.CANCELLED, value: "cancelled" },
      ],
      onFilter: (value, record) => record.status.toLowerCase() === value,
    },
    {
      title: "HÀNH ĐỘNG",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<InfoCircleOutlined />}
              size="small"
              onClick={() => showAppointmentDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
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
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Lịch hẹn</Title>
          </Col>
          <Col>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              format="DD/MM/YYYY"
              style={datePickerStyle}
              placeholder="Chọn ngày"
              allowClear={false}
            />
          </Col>
        </Row>
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
                  <BarsOutlined /> Lịch hẹn cho{" "}
                  {selectedDate.format("MMMM D, YYYY")}
                </span>
                <div>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={reloadSchedule}
                    style={{ marginLeft: 8 }}
                  >
                    Làm mới
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
              locale={{ emptyText: "Không có lịch hẹn cho ngày này" }}
              style={tableStyle}
              bordered
              className="appointment-table"
            />
          </Card>
        )}
      </div>
      {/* Appointment Details Modal */}
      <Modal
        title="Chi tiết lịch hẹn"
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
            Cập nhật trạng thái
          </Button>,
          <Button key="close" onClick={handleCancel}>
            Đóng
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
                      <CalendarOutlined /> Thông tin lịch hẹn
                    </span>
                  }
                  className="details-card"
                >
                  {" "}
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>
                        <Text strong>Ngày:</Text>{" "}
                        {dayjs(currentAppointment.date).format("MMMM D, YYYY")}
                      </p>
                      <p>
                        <Text strong>Giờ:</Text> {currentAppointment.time}
                      </p>
                      <p>
                        <Text strong>Dịch vụ:</Text>{" "}
                        {currentAppointment.service}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <Text strong>Trạng thái:</Text>{" "}
                        {getStatusTag(currentAppointment.status)}
                      </p>
                      <p>
                        <Text strong>Tạo lúc:</Text>{" "}
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
                      <UserOutlined /> Thông tin bệnh nhân
                    </span>
                  }
                  className="details-card"
                >
                  {" "}
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>
                        <Text strong>Tên:</Text>{" "}
                        {currentAppointment.patientName}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <Text strong>Số điện thoại:</Text>{" "}
                        {currentAppointment.patientPhone}
                      </p>
                      <p>
                        <Text strong>Email:</Text>{" "}
                        {currentAppointment.patientEmail}
                      </p>
                    </Col>
                  </Row>
                  <div className="medical-history-section">
                    <Text strong>Lịch sử bệnh tật:</Text>
                    <p>
                      {currentAppointment.medicalHistory ||
                        "Chưa có lịch sử bệnh tật ghi nhận"}
                    </p>
                  </div>
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  title={
                    <span>
                      <InfoCircleOutlined /> Ghi chú
                    </span>
                  }
                  className="details-card"
                >
                  <p>{currentAppointment.notes || "Không có ghi chú"}</p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      {/* Update Status Modal */}
      <Modal
        title="Cập nhật trạng thái lịch hẹn"
        open={isUpdateStatusVisible}
        onOk={handleUpdateStatus}
        onCancel={handleCancel}
      >
        {currentAppointment && (
          <Form form={statusForm} layout="vertical">
            <div className="appointment-summary">
              <p>
                <Text strong>Bệnh nhân:</Text> {currentAppointment.patientName}
              </p>
              <p>
                <Text strong>Ngày & Giờ:</Text>{" "}
                {dayjs(currentAppointment.date).format("MMMM D, YYYY")} lúc{" "}
                {currentAppointment.time}
              </p>
              <p>
                <Text strong>Dịch vụ:</Text> {currentAppointment.service}
              </p>
              <p>
                <Text strong>Trạng thái hiện tại:</Text>{" "}
                {getStatusTag(currentAppointment.status)}
              </p>
            </div>{" "}
            <Form.Item
              name="status"
              label="Cập nhật trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Scheduled">
                  {APPOINTMENT_STATUS.SCHEDULED}
                </Option>
                <Option value="Confirmed">
                  {APPOINTMENT_STATUS.CONFIRMED}
                </Option>
                <Option value="In Progress">
                  {APPOINTMENT_STATUS.IN_PROGRESS}
                </Option>
                <Option value="Completed">
                  {APPOINTMENT_STATUS.COMPLETED}
                </Option>
                <Option value="Cancelled">
                  {APPOINTMENT_STATUS.CANCELLED}
                </Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentSchedule;