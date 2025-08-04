import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Card,
  Container,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { appointmentService } from "../../services";
import "../../../src/styles/TreatmentProgressPage.css";

const TreatmentProgressPage = () => {
  // Thêm hook navigate
  const navigate = useNavigate();

  // State cho danh sách lịch hẹn
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lịch hẹn khi component mount
  useEffect(() => {
    fetchDoctorSchedule();
  }, []);

  // Hàm fetch lịch hẹn từ API
  const fetchDoctorSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API getMySchedule
      const response = await appointmentService.getMySchedule();
      // console.log("API response:", response);

      if (response && response.data) {
        // Nếu data là mảng, sử dụng trực tiếp
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        }
        // Nếu response.data.appointments tồn tại và là mảng, sử dụng
        else if (
          response.data.appointments &&
          Array.isArray(response.data.appointments)
        ) {
          setAppointments(response.data.appointments);
        }
        // Nếu data là object với key-value pairs, convert thành mảng
        else if (
          typeof response.data === "object" &&
          !Array.isArray(response.data)
        ) {
          const appointmentsArray = Object.values(response.data);
          setAppointments(
            Array.isArray(appointmentsArray) ? appointmentsArray : []
          );
        } else {
          setAppointments([]);
          console.warn("Định dạng phản hồi không mong đợi:", response.data);
        }
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy lịch của bác sĩ:", err);
      setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Sửa hàm handleTreatmentDetailClick để chuyển hướng sang trang chi tiết
  const handleTreatmentDetailClick = (appointmentId, customerId) => {
    console.log(
      `Chuyển đến trang chi tiết điều trị cho bệnh nhân ${customerId}`
    );

    if (!customerId) {
      console.error("Không tìm thấy ID bệnh nhân cho cuộc hẹn này");
      return;
    }

    // Chuyển hướng đến trang chi tiết kế hoạch điều trị
    navigate(`/doctor/treatmentsprogress/detail/${customerId}`);
  };

  // Định dạng ngày hiển thị
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Container fluid className="treatment-progress-container">
      <div className="treatment-progress-header">
        <h1 className="page-title">
          <i className="fas fa-chart-line me-2"></i>
          Tiến trình điều trị
        </h1>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <Alert variant="danger" className="error-alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Bảng danh sách lịch hẹn */}
      <Card className="table-card">
        <Card.Header className="table-header">
          <h5 className="mb-0">
            <i className="fas fa-calendar-check me-2"></i>Danh sách lịch hẹn
          </h5>
        </Card.Header>
        <Card.Body className="p-0 p-sm-2">
          {loading ? (
            <div className="loading-container">
              <Spinner
                animation="border"
                role="status"
                variant="primary"
                className="spinner"
              />
              <p className="loading-text">Đang tải dữ liệu...</p>
            </div>
          ) : !Array.isArray(appointments) || appointments.length === 0 ? (
            <Alert variant="info" className="no-data-alert m-3">
              <i className="fas fa-info-circle me-2"></i>
              Không có lịch hẹn nào.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="appointment-table">
                <thead>
                  <tr className="table-header-row">
                    <th>Mã</th>
                    <th>Bệnh nhân</th>
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th>Dịch vụ</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="appointment-row">
                      <td className="appointment-id">
                        <i className="fas fa-hashtag me-1"></i>
                        {appointment.id}
                      </td>
                      <td className="patient-name">
                        <i className="fas fa-user me-1"></i>
                        {appointment.patientName ||
                          appointment.patient?.name ||
                          appointment.patient?.fullName ||
                          `ID: ${
                            appointment.customerId ||
                            appointment.patient?.id ||
                            appointment.patientId ||
                            "N/A"
                          }`}
                      </td>
                      <td>
                        <i className="far fa-calendar-alt me-1"></i>
                        {formatDate(appointment.appointmentDate)}
                      </td>
                      <td>
                        <i className="far fa-clock me-1"></i>
                        {appointment.timeSlot}
                      </td>
                      <td>
                        <i className="fas fa-stethoscope me-1"></i>
                        {appointment ? appointment.type : "N/A"}
                      </td>
                      <td>
                        <Badge
                          bg={getStatusBadgeClass(appointment.status)}
                          className="status-badge"
                        >
                          {getStatusText(appointment.status)}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          className="action-button"
                          onClick={() =>
                            handleTreatmentDetailClick(
                              appointment.id,
                              appointment.customerId ||
                                appointment.patient?.id ||
                                appointment.patientId
                            )
                          }
                        >
                          <i className="fas fa-info-circle me-1 d-none d-sm-inline"></i>
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

// Helper function để lấy class cho badge trạng thái
function getStatusBadgeClass(status) {
  if (!status) return "secondary";

  switch (status.toLowerCase()) {
    case "pending":
      return "warning";
    case "confirmed":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
}

// Helper function để lấy text hiển thị trạng thái
function getStatusText(status) {
  if (!status) return "Không xác định";

  switch (status.toLowerCase()) {
    case "pending":
      return "Chờ xử lý";
    case "confirmed":
      return "Đã xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

export default TreatmentProgressPage;
