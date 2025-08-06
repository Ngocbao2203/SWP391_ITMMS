/**
 * Component Lịch hẹn khám bệnh dành cho bác sĩ
 *
 * Component này hiển thị và quản lý lịch hẹn khám bệnh của bác sĩ theo ngày,
 * cho phép xem chi tiết, cập nhật trạng thái và theo dõi lịch hẹn.
 */
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
  CalendarOutlined, // Icon lịch
  UserOutlined, // Icon người dùng
  EditOutlined, // Icon chỉnh sửa
  InfoCircleOutlined, // Icon thông tin
  BarsOutlined, // Icon danh sách
  ReloadOutlined, // Icon làm mới
} from "@ant-design/icons";
import dayjs from "dayjs"; // Thư viện xử lý thời gian
import "../../styles/AppointmentSchedule.css";

// Hằng số trạng thái lịch hẹn - dùng để hiển thị nhất quán trên giao diện
const APPOINTMENT_STATUS = {
  SCHEDULED: "Scheduled", // Đã đặt lịch
  CONFIRMED: "Confirmed", // Đã xác nhận
  IN_PROGRESS: "In Progress", // Đang thực hiện
  COMPLETED: "Completed", // Đã hoàn thành
  CANCELLED: "Cancelled", // Đã hủy
};

// Trích xuất các component từ thư viện
const { Option } = Select; // Component tùy chọn trong dropdown
const { Title, Text } = Typography; // Component văn bản

// CSS inline để đảm bảo bảng hiển thị đúng
const tableStyle = {
  width: "100%",
  tableLayout: "fixed", // Đảm bảo độ rộng cột cố định
};

// Style cho DatePicker
const datePickerStyle = {
  width: "200px",
  marginLeft: 16,
};

const AppointmentSchedule = () => {
  // Quản lý danh sách lịch hẹn
  const [appointments, setAppointments] = useState([]);
  // Quản lý ngày được chọn (mặc định là ngày hiện tại)
  const [selectedDate, setSelectedDate] = useState(dayjs());
  // Hiển thị/ẩn modal chi tiết lịch hẹn
  const [isAppointmentDetailsVisible, setIsAppointmentDetailsVisible] =
    useState(false);
  // Hiển thị/ẩn modal cập nhật trạng thái
  const [isUpdateStatusVisible, setIsUpdateStatusVisible] = useState(false);
  // Lưu thông tin lịch hẹn hiện tại đang được thao tác
  const [currentAppointment, setCurrentAppointment] = useState(null);
  // Trạng thái đang tải dữ liệu
  const [loading, setLoading] = useState(true);
  // Form điều khiển cập nhật trạng thái
  const [statusForm] = Form.useForm();
  // Lưu thông tin lỗi nếu có
  const [error, setError] = useState(null);

  // Lấy lịch khám của bác sĩ khi component được tải hoặc khi ngày được chọn thay đổi
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Bắt đầu hiển thị trạng thái đang tải

      // Lấy thông tin người dùng hiện tại từ authService
      const authService = require("../../services/authService").default;
      const currentUser = authService.getCurrentUser();

      // Kiểm tra xem người dùng đã đăng nhập hay chưa
      if (currentUser) {
        // Kiểm tra xem thông tin bác sĩ có tồn tại không
        if (!currentUser.doctor || !currentUser.doctor.id) {
          setError("Không thể tải lịch khám bệnh: Thiếu thông tin bác sĩ");
          setLoading(false);
          return;
        }
      } else {
        // Hiển thị lỗi nếu chưa đăng nhập
        setError("Vui lòng đăng nhập để xem lịch khám bệnh");
        setLoading(false);
        return;
      }

      try {
        // Import doctorService để gọi các API liên quan đến bác sĩ
        const doctorService = require("../../services/doctorService").default;

        // Lấy ID bác sĩ từ thông tin người dùng đã đăng nhập
        const doctorId = currentUser.doctor.id;

        // Chuẩn bị tham số ngày theo định dạng YYYY-MM-DD cho API
        const dateParam = selectedDate
          ? selectedDate.format("YYYY-MM-DD")
          : null;

        // Gọi API lấy lịch hẹn của bác sĩ theo ngày đã chọn
        const response = await doctorService.getDoctorSchedule(
          doctorId,
          dateParam
        );

        // Trích xuất dữ liệu lịch hẹn từ phản hồi API, nếu không có thì dùng mảng rỗng
        const appointmentsData = response.appointments || [];

        // Chuyển đổi dữ liệu từ API sang định dạng phù hợp với giao diện
        const formattedAppointments = appointmentsData.map((appointment) => ({
          id: appointment.id,
          // Thông tin người bệnh
          patientName: appointment.customerName || "Chưa có tên",
          patientPhone: appointment.customerPhone || "Chưa có SĐT",
          // Thông tin lịch hẹn
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

        // Cập nhật state với dữ liệu đã định dạng
        setAppointments(formattedAppointments);
        setError(null); // Xóa lỗi nếu trước đó có
      } catch (error) {
        // Xử lý lỗi khi gọi API
        message.error("Không thể tải lịch khám bệnh");
        setError("Không thể tải lịch khám bệnh");
      } finally {
        // Luôn tắt trạng thái loading khi hoàn thành, bất kể thành công hay thất bại
        setLoading(false);
      }
    };

    // Gọi hàm lấy dữ liệu ngay khi effect được kích hoạt
    fetchAppointments();
  }, [selectedDate]); // Chỉ gọi lại khi ngày được chọn thay đổi

  // Hàm tạo thẻ trạng thái (Tag) với màu sắc tương ứng với từng trạng thái lịch hẹn
  const getStatusTag = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled": // Đã lên lịch
        return (
          <Tag color="cyan" className="status-tag">
            {APPOINTMENT_STATUS.SCHEDULED}
          </Tag>
        );
      case "confirmed": // Đã xác nhận
        return (
          <Tag color="blue" className="status-tag">
            {APPOINTMENT_STATUS.CONFIRMED}
          </Tag>
        );
      case "in progress": // Đang tiến hành
        return (
          <Tag color="orange" className="status-tag">
            {APPOINTMENT_STATUS.IN_PROGRESS}
          </Tag>
        );
      case "completed": // Đã hoàn thành
        return (
          <Tag color="green" className="status-tag">
            {APPOINTMENT_STATUS.COMPLETED}
          </Tag>
        );
      case "cancelled": // Đã hủy
        return (
          <Tag color="red" className="status-tag">
            {APPOINTMENT_STATUS.CANCELLED}
          </Tag>
        );
      default: // Trạng thái không xác định
        return (
          <Tag color="default" className="status-tag">
            {status}
          </Tag>
        );
    }
  };
  // Hàm để tải lại dữ liệu lịch khám bệnh từ server
  const reloadSchedule = async () => {
    message.loading("Đang tải lịch khám..."); // Hiển thị thông báo đang tải
    setLoading(true); // Bật trạng thái loading

    try {
      // Import các service cần thiết
      const doctorService = require("../../services/doctorService").default;
      const authService = require("../../services/authService").default;

      // Lấy thông tin người dùng hiện tại từ authService
      const currentUser = authService.getCurrentUser();

      // Kiểm tra xem có thông tin bác sĩ hợp lệ không
      if (!currentUser || !currentUser.doctor || !currentUser.doctor.id) {
        throw new Error("Thiếu thông tin bác sĩ");
      }

      // Lấy ID bác sĩ từ thông tin người dùng
      const doctorId = currentUser.doctor.id;

      // Chuẩn bị tham số ngày theo định dạng YYYY-MM-DD
      const dateParam = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;

      // Gọi API lấy lịch hẹn của bác sĩ theo ngày
      const response = await doctorService.getDoctorSchedule(
        doctorId,
        dateParam
      );

      // Lấy danh sách lịch hẹn từ phản hồi API
      const appointmentsData = response.appointments || [];

      // Chuyển đổi dữ liệu từ API sang định dạng phù hợp với giao diện
      const formattedAppointments = appointmentsData.map((appointment) => ({
        id: appointment.id,
        patientId: appointment.customerId || appointment.id.toString(),
        patientName: appointment.customerName || "Chưa có tên",
        patientPhone: appointment.customerPhone || "Chưa có SĐT",
        // Định dạng ngày tháng
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

      // Cập nhật state với dữ liệu mới
      setAppointments(formattedAppointments);
      setError(null); // Xóa lỗi nếu có
      message.success("Đã tải lịch khám thành công"); // Thông báo thành công
    } catch (error) {
      // Xử lý trường hợp lỗi
      setError("Không thể tải lịch khám bệnh");
      message.error("Không thể tải lịch khám bệnh");
    } finally {
      // Luôn tắt trạng thái loading khi hoàn thành
      setLoading(false);
    }
  };

  // Hiển thị modal chi tiết lịch hẹn khi người dùng nhấp vào một lịch hẹn
  const showAppointmentDetails = (appointment) => {
    setCurrentAppointment(appointment); // Lưu thông tin lịch hẹn được chọn
    setIsAppointmentDetailsVisible(true); // Hiển thị modal
  };

  // Hiển thị modal cập nhật trạng thái lịch hẹn
  const showUpdateStatusModal = (appointment) => {
    setCurrentAppointment(appointment); // Lưu thông tin lịch hẹn được chọn

    // Chuyển đổi trạng thái từ lowercase sang Title Case (viết hoa chữ cái đầu)
    // để hiển thị đúng trong form cập nhật
    let statusValue = "";

    switch (appointment.status.toLowerCase()) {
      case "scheduled":
        statusValue = "Scheduled"; // Đã lên lịch
        break;
      case "confirmed":
        statusValue = "Confirmed"; // Đã xác nhận
        break;
      case "in progress":
        statusValue = "In Progress"; // Đang tiến hành
        break;
      case "completed":
        statusValue = "Completed"; // Đã hoàn thành
        break;
      case "cancelled":
        statusValue = "Cancelled"; // Đã hủy
        break;
      default:
        statusValue = appointment.status; // Giữ nguyên nếu không khớp
    }

    // Điền trạng thái hiện tại vào form
    statusForm.setFieldsValue({
      status: statusValue,
    });
    setIsUpdateStatusVisible(true); // Hiển thị modal cập nhật trạng thái
  };

  // Xử lý đóng modal khi người dùng hủy thao tác
  const handleCancel = () => {
    setIsAppointmentDetailsVisible(false); // Ẩn modal chi tiết lịch hẹn
    setIsUpdateStatusVisible(false); // Ẩn modal cập nhật trạng thái
  };

  // Xử lý cập nhật trạng thái lịch hẹn
  const handleUpdateStatus = () => {
    // Xác thực dữ liệu form trước khi gửi
    statusForm
      .validateFields()
      .then(async (values) => {
        try {
          // Import service xử lý lịch hẹn
          const appointmentService =
            require("../../services/appointmentService").default;

          // Gọi API cập nhật trạng thái lịch hẹn
          const result = await appointmentService.updateAppointmentStatus(
            currentAppointment.id, // ID lịch hẹn cần cập nhật
            values.status // Trạng thái mới
          );

          // Xử lý kết quả trả về từ API
          if (result.success) {
            // Thông báo thành công
            message.success("Cập nhật trạng thái lịch hẹn thành công");
            statusForm.resetFields(); // Xóa dữ liệu form
            setIsUpdateStatusVisible(false); // Đóng modal

            // Tải lại dữ liệu lịch hẹn sau khi cập nhật thành công
            reloadSchedule();
          } else {
            // Thông báo lỗi từ API
            message.error(
              result.message || "Không thể cập nhật trạng thái lịch hẹn"
            );
          }
        } catch (error) {
          // Xử lý lỗi khi gọi API
          message.error("Không thể cập nhật trạng thái lịch hẹn");
        }
      })
      .catch((info) => {
        // Xử lý lỗi khi form không hợp lệ
        message.error("Vui lòng kiểm tra thông tin đã nhập");
      });
  };
  // Hàm lấy danh sách lịch hẹn trong ngày và sắp xếp theo thời gian
  const getDailyAppointments = useCallback(() => {
    // Sắp xếp các lịch hẹn theo thời gian tăng dần
    return appointments.sort((a, b) => {
      // Lấy giờ bắt đầu từ khoảng thời gian (ví dụ: từ "08:00-09:00" lấy "08:00")
      const timeA = a.time.split("-")[0];
      const timeB = b.time.split("-")[0];
      return timeA.localeCompare(timeB); // So sánh chuỗi thời gian
    });
  }, [appointments]); // Chạy lại khi danh sách lịch hẹn thay đổi

  // Định nghĩa cấu trúc các cột trong bảng lịch hẹn
  const columns = [
    {
      title: "BỆNH NHÂN", // Tiêu đề cột
      dataIndex: "patientName", // Trường dữ liệu cần hiển thị
      key: "patientName", // Khóa duy nhất cho cột
      width: "25%", // Độ rộng cột
      sorter: (a, b) => a.patientName.localeCompare(b.patientName), // Hàm sắp xếp theo tên bệnh nhân
    },
    {
      title: "KHUNG GIỜ",
      dataIndex: "time",
      key: "time",
      width: "20%",
      sorter: (a, b) => {
        // Sắp xếp theo giờ bắt đầu của khung giờ
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
      render: (status) => getStatusTag(status), // Hiển thị trạng thái dưới dạng thẻ màu
      filters: [
        { text: APPOINTMENT_STATUS.SCHEDULED, value: "scheduled" },
        { text: APPOINTMENT_STATUS.CONFIRMED, value: "confirmed" },
        { text: APPOINTMENT_STATUS.IN_PROGRESS, value: "in_progress" },
        { text: APPOINTMENT_STATUS.COMPLETED, value: "completed" },
        { text: APPOINTMENT_STATUS.CANCELLED, value: "cancelled" },
      ],
      // Lọc dữ liệu theo trạng thái được chọn
      onFilter: (value, record) => record.status.toLowerCase() === value,
    },
    {
      title: "HÀNH ĐỘNG",
      key: "actions",
      width: "20%",
      // Render các nút hành động cho mỗi dòng
      render: (_, record) => (
        <Space size="small">
          {/* Nút xem chi tiết lịch hẹn */}
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<InfoCircleOutlined />}
              size="small"
              onClick={() => showAppointmentDetails(record)}
            />
          </Tooltip>
          {/* Nút cập nhật trạng thái lịch hẹn - bị vô hiệu hóa nếu lịch hẹn đã hủy */}
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

  // Nội dung chính của component
  return (
    <div className="appointment-schedule-container">
      {/* Phần header - hiển thị tiêu đề và điều khiển chọn ngày */}
      <div className="appointment-schedule-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Lịch hẹn</Title>
          </Col>
          <Col>
            {/* Control để chọn ngày xem lịch */}
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

      {/* Phần nội dung - hiển thị danh sách lịch hẹn */}
      <div className="appointments-container">
        {/* Hiển thị spinner khi đang tải dữ liệu */}
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : error ? (
          // Hiển thị thông báo lỗi và nút thử lại nếu có lỗi
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
          // Hiển thị card chứa bảng lịch hẹn khi đã tải dữ liệu thành công
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Hiển thị tiêu đề với ngày được chọn */}
                <span>
                  <BarsOutlined /> Lịch hẹn cho{" "}
                  {selectedDate.format("MMMM D, YYYY")}
                </span>
                <div>
                  {/* Nút làm mới dữ liệu */}
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
            {/* Bảng hiển thị danh sách lịch hẹn */}
            <Table
              dataSource={getDailyAppointments()} // Lấy danh sách lịch hẹn đã sắp xếp
              columns={columns} // Cấu trúc các cột
              rowKey="id" // Khóa duy nhất cho mỗi dòng
              size="small" // Kích thước bảng nhỏ gọn
              pagination={false} // Không phân trang
              locale={{ emptyText: "Không có lịch hẹn cho ngày này" }} // Thông báo khi không có dữ liệu
              style={tableStyle} // Style cho bảng
              bordered // Hiển thị viền
              className="appointment-table" // Class CSS
            />
          </Card>
        )}
      </div>

      {/* Modal hiển thị chi tiết lịch hẹn */}
      <Modal
        title="Chi tiết lịch hẹn"
        open={isAppointmentDetailsVisible} // Điều khiển hiển thị/ẩn modal
        onCancel={handleCancel} // Xử lý khi đóng modal
        footer={[
          // Nút cập nhật trạng thái lịch hẹn - bị vô hiệu hóa nếu lịch hẹn đã hủy
          <Button
            key="update"
            type="primary"
            onClick={() => {
              handleCancel(); // Đóng modal hiện tại
              showUpdateStatusModal(currentAppointment); // Mở modal cập nhật trạng thái
            }}
            disabled={
              currentAppointment && currentAppointment.status === "cancelled"
            }
          >
            Cập nhật trạng thái
          </Button>,
          // Nút đóng modal
          <Button key="close" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        width={600} // Độ rộng modal
      >
        {/* Nội dung chi tiết lịch hẹn - chỉ hiển thị khi có lịch hẹn được chọn */}
        {currentAppointment && (
          <div className="appointment-details">
            <Row gutter={[16, 16]}>
              {/* Card thông tin lịch hẹn */}
              <Col span={24}>
                <Card
                  title={
                    <span>
                      <CalendarOutlined /> Thông tin lịch hẹn
                    </span>
                  }
                  className="details-card"
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      {/* Thông tin ngày, giờ và dịch vụ */}
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
                      {/* Thông tin trạng thái và thời gian tạo */}
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

              {/* Card thông tin bệnh nhân */}
              <Col span={24}>
                <Card
                  title={
                    <span>
                      <UserOutlined /> Thông tin bệnh nhân
                    </span>
                  }
                  className="details-card"
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      {/* Tên bệnh nhân */}
                      <p>
                        <Text strong>Tên:</Text>{" "}
                        {currentAppointment.patientName}
                      </p>
                    </Col>
                    <Col span={12}>
                      {/* Thông tin liên hệ bệnh nhân */}
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
                  {/* Phần lịch sử bệnh tật */}
                  <div className="medical-history-section">
                    <Text strong>Lịch sử bệnh tật:</Text>
                    <p>
                      {currentAppointment.medicalHistory ||
                        "Chưa có lịch sử bệnh tật ghi nhận"}
                    </p>
                  </div>
                </Card>
              </Col>

              {/* Card ghi chú */}
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

      {/* Modal cập nhật trạng thái lịch hẹn */}
      <Modal
        title="Cập nhật trạng thái lịch hẹn"
        open={isUpdateStatusVisible} // Điều khiển hiển thị/ẩn modal
        onOk={handleUpdateStatus} // Xử lý khi nhấn nút OK
        onCancel={handleCancel} // Xử lý khi đóng modal
      >
        {/* Chỉ hiển thị form khi có lịch hẹn được chọn */}
        {currentAppointment && (
          <Form form={statusForm} layout="vertical">
            {/* Tóm tắt thông tin lịch hẹn */}
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
            </div>

            {/* Form chọn trạng thái mới */}
            <Form.Item
              name="status"
              label="Cập nhật trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Scheduled">
                  {APPOINTMENT_STATUS.SCHEDULED} {/* Đã lên lịch */}
                </Option>
                <Option value="Confirmed">
                  {APPOINTMENT_STATUS.CONFIRMED} {/* Đã xác nhận */}
                </Option>
                <Option value="In Progress">
                  {APPOINTMENT_STATUS.IN_PROGRESS} {/* Đang tiến hành */}
                </Option>
                <Option value="Completed">
                  {APPOINTMENT_STATUS.COMPLETED} {/* Đã hoàn thành */}
                </Option>
                <Option value="Cancelled">
                  {APPOINTMENT_STATUS.CANCELLED} {/* Đã hủy */}
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
