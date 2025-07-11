import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Alert,
  ListGroup,
  Table,
  Spinner,
  ProgressBar,
  Breadcrumb
} from "react-bootstrap";
import { treatmentPlans, patientService } from "../../services";
import "../../styles/TreatmentProgressPage.css";

const TreatmentPlanDetailPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);

  useEffect(() => {
    // Hàm fetch dữ liệu kế hoạch điều trị
    const fetchTreatmentPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Đang tìm kế hoạch điều trị cho bệnh nhân ID:", patientId);
        
        // Gọi API để lấy kế hoạch điều trị của bệnh nhân
        const response = await patientService.getPatientTreatmentPlans(patientId);
        console.log("API response for treatment plans:", response);
        
        if (response && response.data) {
          // Nếu có nhiều kế hoạch, chọn kế hoạch đang active hoặc kế hoạch gần nhất
          let treatmentPlanData;
          
          if (Array.isArray(response.data)) {
            console.log("Tìm thấy", response.data.length, "kế hoạch điều trị");
            // Ưu tiên kế hoạch đang active
            treatmentPlanData = response.data.find(plan => 
              plan.status?.toLowerCase() === "active" || 
              plan.status?.toLowerCase() === "in_progress"
            );
            
            // Nếu không có kế hoạch active, lấy kế hoạch gần nhất
            if (!treatmentPlanData && response.data.length > 0) {
              treatmentPlanData = response.data[0];
            }
          } else {
            treatmentPlanData = response.data;
          }
          
          console.log("Kế hoạch điều trị được chọn:", treatmentPlanData);
          
          if (treatmentPlanData?.id) {
            // Nếu đã có ID kế hoạch điều trị, lấy thông tin chi tiết
            const detailResponse = await treatmentPlans.getById(treatmentPlanData.id);
            console.log("Chi tiết kế hoạch điều trị:", detailResponse);
            
            if (detailResponse && detailResponse.data) {
              console.log("Dữ liệu chi tiết:", detailResponse.data);
              setTreatmentPlan(detailResponse.data);
            } else {
              console.error("Không có dữ liệu chi tiết hoặc có lỗi:", detailResponse);
              setError("Không thể tải thông tin chi tiết kế hoạch điều trị.");
            }
          } else {
            console.error("Không tìm thấy ID kế hoạch điều trị:", treatmentPlanData);
            setError("Không tìm thấy kế hoạch điều trị cho bệnh nhân này.");
          }
        } else {
          console.error("Không có dữ liệu trả về từ API:", response);
          setError("Không tìm thấy kế hoạch điều trị cho bệnh nhân này.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu kế hoạch điều trị:", err);
        setError("Không thể tải thông tin kế hoạch điều trị. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchTreatmentPlan();
    } else {
      setError("Không có thông tin bệnh nhân để tìm kế hoạch điều trị.");
      setLoading(false);
    }
  }, [patientId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Tính tiến độ hoàn thành
  const calculateProgress = () => {
    console.log("Tính tiến độ với dữ liệu:", treatmentPlan);
    
    // Kiểm tra nếu không có kế hoạch điều trị
    if (!treatmentPlan) return 0;
    
    // Nếu có thuộc tính progress trực tiếp, sử dụng nó
    if (typeof treatmentPlan.progress === 'number') {
      return treatmentPlan.progress;
    }
    
    // Nếu có thuộc tính completionPercentage, sử dụng nó
    if (typeof treatmentPlan.completionPercentage === 'number') {
      return treatmentPlan.completionPercentage;
    }
    
    // Nếu có phases, tính dựa trên số giai đoạn đã hoàn thành
    if (treatmentPlan.phases && Array.isArray(treatmentPlan.phases) && treatmentPlan.phases.length > 0) {
      const completedPhases = treatmentPlan.phases.filter(phase => 
        phase.status?.toLowerCase() === "completed" || 
        phase.status?.toLowerCase() === "complete"
      ).length;
      
      return Math.round((completedPhases / treatmentPlan.phases.length) * 100);
    }
    
    // Nếu có currentPhase và totalPhases, tính dựa trên giai đoạn hiện tại
    if (typeof treatmentPlan.currentPhase === 'number' && typeof treatmentPlan.totalPhases === 'number') {
      return Math.round((treatmentPlan.currentPhase / treatmentPlan.totalPhases) * 100);
    }
    
    // Nếu không có thông tin gì, trả về 0
    return 0;
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    if (!status) return "secondary";
    
    switch (status.toLowerCase()) {
      case "active":
      case "in_progress":
      case "inprogress":
      case "in progress":
        return "primary";
      case "completed":
      case "complete":
      case "finished":
        return "success";
      case "pending":
      case "scheduled":
        return "warning";
      case "cancelled":
      case "canceled":
        return "danger";
      default:
        return "info";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    if (!status) return "Không xác định";
    
    switch (status.toLowerCase()) {
      case "active":
      case "in_progress":
      case "inprogress": 
        return "Đang điều trị";
      case "completed":
      case "complete":
        return "Hoàn thành";
      case "pending":
      case "scheduled":
        return "Chờ thực hiện";
      case "cancelled":
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <Container className="treatment-progress-container">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/doctor/treatmentsprogress")}>
            <i className="fas fa-chart-line me-1"></i> Tiến trình điều trị
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <i className="fas fa-clipboard-list me-1"></i> Chi tiết kế hoạch điều trị
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="treatment-progress-header">
        <div>
          <h1 className="page-title">
            <i className="fas fa-clipboard-list me-2"></i>
            Chi tiết kế hoạch điều trị
          </h1>
          <p className="text-muted mt-2">
            <i className="fas fa-user-tag me-1"></i>
            Mã bệnh nhân: {patientId || "N/A"}
          </p>
        </div>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate("/doctor/treatmentsprogress")}
        >
          <i className="fas fa-arrow-left me-1"></i> Quay lại
        </Button>
      </div>

      {/* Loading và Error */}
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" role="status" variant="primary" className="spinner" />
          <p className="loading-text">Đang tải thông tin kế hoạch điều trị...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="error-alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      ) : treatmentPlan ? (
        <>
          {/* Thông tin tổng quan */}
          <Card className="mb-4 plan-overview">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin tổng quan
              </h5>
              <Badge bg={getStatusVariant(treatmentPlan.status)} className="status-badge">
                {getStatusText(treatmentPlan.status)}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong><i className="fas fa-tag me-1"></i> Loại điều trị:</strong> {treatmentPlan.treatmentType || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-stethoscope me-1"></i> Dịch vụ:</strong> {treatmentPlan.treatmentService?.name || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-user-md me-1"></i> Bác sĩ phụ trách:</strong> {treatmentPlan.doctor?.name || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-calendar-day me-1"></i> Ngày bắt đầu:</strong> {formatDate(treatmentPlan.startDate)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-calendar-check me-1"></i> Lần khám tiếp theo:</strong> {formatDate(treatmentPlan.nextVisitDate)}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong><i className="fas fa-step-forward me-1"></i> Giai đoạn hiện tại:</strong> {treatmentPlan.currentPhase || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-coins me-1"></i> Tổng chi phí:</strong> {formatCurrency(treatmentPlan.totalCost)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-money-bill-wave me-1"></i> Đã thanh toán:</strong> {formatCurrency(treatmentPlan.paidAmount)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-receipt me-1"></i> Trạng thái thanh toán:</strong>{" "}
                      <Badge bg={treatmentPlan.paymentStatus === "Paid" ? "success" : "warning"}>
                        {treatmentPlan.paymentStatus === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong><i className="fas fa-tasks me-1"></i> Tiến độ điều trị:</strong>
                      <ProgressBar 
                        now={calculateProgress()} 
                        label={`${calculateProgress()}%`}
                        variant="success" 
                        className="mt-2" 
                      />
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              
              <div className="mt-4">
                <h6><i className="fas fa-file-alt me-1"></i> Mô tả kế hoạch:</h6>
                <p>{treatmentPlan.description || "Không có mô tả"}</p>
              </div>
            </Card.Body>
          </Card>

          {/* Các giai đoạn điều trị */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-layer-group me-2"></i>
                Giai đoạn điều trị
              </h5>
            </Card.Header>
            <Card.Body>
              {treatmentPlan.phases && Array.isArray(treatmentPlan.phases) && treatmentPlan.phases.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên giai đoạn</th>
                      <th>Mô tả</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatmentPlan.phases.map((phase, index) => (
                      <tr key={phase.id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{phase.name || `Giai đoạn ${index + 1}`}</strong>
                        </td>
                        <td>{phase.description || "Không có mô tả"}</td>
                        <td>
                          <i className="far fa-calendar-alt me-1"></i>
                          {formatDate(phase.startDate).split(",")[0]} 
                          <br />
                          <i className="far fa-calendar-check me-1"></i>
                          {formatDate(phase.endDate).split(",")[0]}
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(phase.status)}>
                            {getStatusText(phase.status)}
                          </Badge>
                        </td>
                        <td>{phase.doctorNotes || "Chưa có ghi chú"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  Chưa có thông tin về các giai đoạn điều trị.
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Lịch sử cuộc hẹn */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i>
                Lịch sử cuộc hẹn
              </h5>
            </Card.Header>
            <Card.Body>
              {treatmentPlan.appointments && Array.isArray(treatmentPlan.appointments) && treatmentPlan.appointments.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Mã cuộc hẹn</th>
                      <th>Ngày hẹn</th>
                      <th>Loại cuộc hẹn</th>
                      <th>Trạng thái</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatmentPlan.appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <i className="fas fa-hashtag me-1"></i>
                          {appointment.id}
                        </td>
                        <td>
                          <i className="far fa-calendar-alt me-1"></i>
                          {formatDate(appointment.date)}
                        </td>
                        <td>
                          <i className="fas fa-stethoscope me-1"></i>
                          {appointment.type || "Khám thông thường"}
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </td>
                        <td>{appointment.doctorNotes || "Không có ghi chú"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  Chưa có thông tin về lịch sử cuộc hẹn.
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Nút thao tác */}
          <div className="d-flex justify-content-between mb-5">
            <Button variant="outline-secondary" onClick={() => navigate("/doctor/treatmentsprogress")}>
              <i className="fas fa-arrow-left me-1"></i> Quay lại danh sách
            </Button>
            <div>
              <Button variant="primary" className="me-2">
                <i className="fas fa-edit me-1"></i> Cập nhật tiến trình
              </Button>
              <Button variant="success">
                <i className="fas fa-file-medical me-1"></i> Thêm ghi chú
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Alert variant="warning">
          <i className="fas fa-exclamation-circle me-2"></i>
          Không tìm thấy thông tin kế hoạch điều trị cho bệnh nhân này.
        </Alert>
      )}
    </Container>
  );
};

export default TreatmentPlanDetailPage; 