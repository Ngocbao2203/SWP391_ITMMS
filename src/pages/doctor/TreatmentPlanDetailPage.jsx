import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import {
  treatmentPlans as treatmentPlansService,
  patientService,
  treatmentService,
  authService,
} from "../../services";
import "../../styles/TreatmentProgressPage.css";
import "../../styles/TreatmentPlanDetail.css";

const TreatmentPlanDetailPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thay đổi từ lưu một kế hoạch sang lưu tất cả kế hoạch điều trị
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // State for new treatment plan modal
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [treatmentServices, setTreatmentServices] = useState([]);
  const [formData, setFormData] = useState({
    treatmentType: "",
    treatmentServiceId: "",
    description: "",
    phaseDescription: "",
    nextPhaseDate: "",
    nextVisitDate: "",
    notes: "",
  });

  // Hàm fetch dữ liệu kế hoạch điều trị
  const fetchTreatmentPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Đang tìm kế hoạch điều trị cho bệnh nhân ID:", patientId);

      // Gọi API để lấy kế hoạch điều trị của bệnh nhân
      const response = await patientService.getPatientTreatmentPlans(patientId);
      console.log("API response for treatment plans:", response);

      if (response && response.data) {
        let plansData = [];

        if (Array.isArray(response.data)) {
          console.log("Tìm thấy", response.data.length, "kế hoạch điều trị");
          plansData = response.data;
        } else {
          // Nếu response.data không phải là mảng, đưa nó vào mảng
          plansData = [response.data];
        }

        // Nếu có kế hoạch điều trị, lấy chi tiết cho từng kế hoạch
        if (plansData.length > 0) {
          const detailedPlans = [];
          let activeOrFirstPlan = null;

          // Lấy chi tiết từng kế hoạch điều trị
          for (const plan of plansData) {
            if (plan.id) {
              try {
                const detailResponse = await treatmentPlansService.getById(
                  plan.id
                );
                if (detailResponse && detailResponse.data) {
                  detailedPlans.push(detailResponse.data);

                  // Xác định kế hoạch active hoặc kế hoạch đầu tiên để chọn mặc định
                  const isActive =
                    plan.status?.toLowerCase() === "active" ||
                    plan.status?.toLowerCase() === "in_progress";
                  if (isActive || !activeOrFirstPlan) {
                    activeOrFirstPlan = detailResponse.data;
                  }
                }
              } catch (detailErr) {
                console.error(
                  `Lỗi khi lấy chi tiết cho kế hoạch ID: ${plan.id}`,
                  detailErr
                );
              }
            }
          }

          if (detailedPlans.length > 0) {
            // Sắp xếp kế hoạch điều trị theo ngày tạo, mới nhất lên đầu
            detailedPlans.sort((a, b) => {
              const dateA = new Date(a.createdAt || a.startDate || 0);
              const dateB = new Date(b.createdAt || b.startDate || 0);
              return dateB - dateA;
            });

            setPlans(detailedPlans);
            setSelectedPlan(activeOrFirstPlan || detailedPlans[0]);
          } else {
            setError("Không thể tải thông tin chi tiết kế hoạch điều trị.");
          }
        } else {
          setPlans([]);
          setError("Không tìm thấy kế hoạch điều trị cho bệnh nhân này.");
        }
      } else {
        console.error("Không có dữ liệu trả về từ API:", response);
        setError("Không tìm thấy kế hoạch điều trị cho bệnh nhân này.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu kế hoạch điều trị:", err);
      setError(
        "Không thể tải thông tin kế hoạch điều trị. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Fetch treatment services for the modal
  const fetchTreatmentServices = useCallback(async () => {
    try {
      const response = await treatmentService.getAllTreatmentServices();
      if (response && response.data) {
        setTreatmentServices(response.data);
      } else if (Array.isArray(response)) {
        setTreatmentServices(response);
      } else {
        console.error("Unexpected response format:", response);
        setTreatmentServices([]);
      }
    } catch (error) {
      console.error("Error fetching treatment services:", error);
      setTreatmentServices([]);
    }
  }, []);

  useEffect(() => {
    if (patientId) {
      fetchTreatmentPlan();
    } else {
      setError("Không có thông tin bệnh nhân để tìm kế hoạch điều trị.");
      setLoading(false);
    }
  }, [patientId, fetchTreatmentPlan]);

  // Load treatment services when modal opens
  useEffect(() => {
    if (showModal) {
      fetchTreatmentServices();
    }
  }, [showModal, fetchTreatmentServices]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  // Hàm chọn kế hoạch điều trị để xem chi tiết
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    document
      .getElementById(`plan-${plan.id}`)
      .scrollIntoView({ behavior: "smooth" });
  };

  // Hàm mở modal thêm kế hoạch điều trị
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      treatmentType: "",
      treatmentServiceId: "",
      description: "",
      phaseDescription: "",
      nextPhaseDate: "",
      nextVisitDate: "",
      notes: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      // Get current doctor information
      const currentUser = authService.getCurrentUser();

      const doctorId = currentUser.doctor.id || null;

      if (!doctorId) {
        alert("Không thể xác định thông tin bác sĩ. Vui lòng đăng nhập lại.");
        return;
      }

      // Prepare data for API call
      const planData = {
        customerId: Number(patientId),
        doctorId: Number(doctorId),
        treatmentServiceId: Number(formData.treatmentServiceId),
        treatmentType: formData.treatmentType,
        description: formData.description,
        phaseDescription: formData.phaseDescription,
        nextPhaseDate: formData.nextPhaseDate,
        nextVisitDate: formData.nextVisitDate,
        notes: formData.notes,
      };

      // Call the API to create the treatment plan
      const result = await treatmentService.createTreatmentPlan(planData);

      if (result && (result.success || result.data)) {
        // Close modal and refresh data
        alert("Tạo kế hoạch điều trị thành công!");
        setShowModal(false);
        // Reset form data
        setFormData({
          treatmentType: "",
          treatmentServiceId: "",
          description: "",
          phaseDescription: "",
          nextPhaseDate: "",
          nextVisitDate: "",
          notes: "",
        });
        // Reload treatment plan data
        fetchTreatmentPlan();
      } else {
        throw new Error(result?.message || "Tạo kế hoạch điều trị thất bại");
      }
    } catch (error) {
      console.error("Error creating treatment plan:", error);
      alert(`Lỗi: ${error.message || "Không thể tạo kế hoạch điều trị"}`);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Container className="treatment-progress-container">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/doctor/treatment-plans")}>
            <i className="fas fa-clipboard-list me-1"></i> Kế hoạch điều trị
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <i className="fas fa-clipboard-check me-1"></i> Chi tiết kế hoạch
            điều trị
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
          <p className="patient-info mt-2">
            <i className="fas fa-user-tag me-2"></i>
            Mã bệnh nhân:{" "}
            <span className="patient-id">{patientId || "N/A"}</span>
          </p>
        </div>
        <Button
          variant="primary"
          className="back-button"
          onClick={() => navigate("/doctor/treatment-plans")}
        >
          <i className="fas fa-arrow-left me-2"></i> Quay lại kế hoạch điều trị
        </Button>
      </div>

      {/* Loading và Error */}
      {loading ? (
        <div className="loading-container">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            className="spinner"
          />
          <p className="loading-text">
            Đang tải thông tin kế hoạch điều trị...
          </p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="error-alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      ) : plans.length > 0 ? (
        <div className="treatment-plan-content">
          {/* Timeline các kế hoạch điều trị */}
          <div className="treatment-plans-container">
            <h4 className="mb-4 treatment-plans-title">
              <i className="fas fa-clipboard-list me-2"></i>
              Các kế hoạch điều trị
            </h4>

            <div className="treatment-timeline">
              <div className="treatment-cards-container">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id || index}
                    id={`plan-${plan.id}`}
                    className={`treatment-plan-card ${
                      selectedPlan?.id === plan.id ? "active" : ""
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <div className="plan-card-info w-100">
                      <div className="plan-card-header">
                        <h6 className="mb-0">Kế hoạch {index + 1}</h6>
                        <Badge
                          bg={getStatusVariant(plan.status)}
                          className="status-badge"
                        >
                          {getStatusText(plan.status)}
                        </Badge>
                      </div>
                      <div className="info-row">
                        <span className="info-label">
                          <i className="fas fa-tag"></i> Loại điều trị:
                        </span>
                        <span className="info-value">
                          {plan.treatmentType || "N/A"}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">
                          <i className="fas fa-calendar-alt"></i> Bắt đầu:
                        </span>
                        <span className="info-value">
                          {formatDate(plan.startDate).split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thông tin chi tiết kế hoạch đã chọn */}
          {selectedPlan && (
            <div className="plan-detail-section">
              <Card className="mb-4 plan-overview">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Thông tin kế hoạch điều trị
                  </h5>
                  <Badge
                    bg={getStatusVariant(selectedPlan.status)}
                    pill
                    className="status-badge"
                  >
                    {getStatusText(selectedPlan.status)}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>
                            <i className="fas fa-tag me-1"></i> Loại điều trị:
                          </strong>{" "}
                          {selectedPlan.treatmentType || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>
                            <i className="fas fa-stethoscope me-1"></i> Dịch vụ:
                          </strong>{" "}
                          {selectedPlan.treatmentService?.serviceName || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>
                            <i className="fas fa-user-md me-1"></i> Bác sĩ phụ
                            trách:
                          </strong>{" "}
                          {selectedPlan.doctor?.name || "N/A"}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>
                            <i className="fas fa-calendar-day me-1"></i> Ngày
                            bắt đầu:
                          </strong>{" "}
                          {formatDate(selectedPlan.startDate)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>
                            <i className="fas fa-calendar-check me-1"></i> Lần
                            khám tiếp theo:
                          </strong>{" "}
                          {formatDate(selectedPlan.nextVisitDate)}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>
                            <i className="fas fa-step-forward me-1"></i> Giai
                            đoạn hiện tại:
                          </strong>{" "}
                          {selectedPlan.currentPhase || "N/A"}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <h6>
                      <i className="fas fa-file-alt me-1"></i> Mô tả kế hoạch:
                    </h6>
                    <p>{selectedPlan.description || "Không có mô tả"}</p>
                  </div>
                </Card.Body>
              </Card>

              {/* Nút thao tác */}
              {/* <div className="d-flex justify-content-center mb-5">
                <Button
                  variant="primary"
                  className="add-treatment-plan-btn"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-plus-circle me-2"></i> Thêm kế hoạch điều
                  trị
                </Button>
              </div> */}
            </div>
          )}

          {/* Modal thêm kế hoạch điều trị mới */}
          {showModal && (
            <div className="custom-modal-overlay">
              <div className="custom-modal">
                <div className="custom-modal-header">
                  <h5 className="custom-modal-title">
                    <i className="fas fa-plus-circle me-2"></i>
                    Thêm kế hoạch điều trị mới
                  </h5>
                  <button
                    type="button"
                    className="custom-modal-close"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="custom-modal-body">
                  <form className="custom-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                      <h6 className="section-header">
                        <i className="fas fa-info-circle me-2"></i>
                        Thông tin cơ bản
                      </h6>
                      <div className="form-row">
                        <div className="form-column">
                          <div className="form-group">
                            <label className="form-label">
                              <i className="fas fa-tag me-1"></i> Loại điều trị
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="treatmentType"
                              value={formData.treatmentType}
                              onChange={handleInputChange}
                              placeholder="Ví dụ: Điều trị IVF, Tư vấn sức khỏe..."
                              required
                            />
                          </div>
                        </div>
                        <div className="form-column">
                          <div className="form-group">
                            <label className="form-label">
                              <i className="fas fa-stethoscope me-1"></i> Dịch
                              vụ điều trị
                            </label>
                            <select
                              className="form-select"
                              name="treatmentServiceId"
                              value={formData.treatmentServiceId}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">-- Chọn dịch vụ --</option>
                              {treatmentServices.map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.serviceName} - {service.serviceCode}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h6 className="section-header">
                        <i className="fas fa-file-medical-alt me-2"></i>
                        Chi tiết kế hoạch
                      </h6>
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-file-alt me-1"></i> Mô tả kế
                          hoạch
                        </label>
                        <textarea
                          className="form-control form-control-textarea"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Nhập mô tả chi tiết về kế hoạch điều trị..."
                          required
                          rows={3}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-layer-group me-1"></i> Mô tả giai
                          đoạn đầu tiên
                        </label>
                        <textarea
                          className="form-control form-control-textarea"
                          name="phaseDescription"
                          value={formData.phaseDescription}
                          onChange={handleInputChange}
                          placeholder="Mô tả giai đoạn đầu tiên của kế hoạch điều trị..."
                          required
                          rows={2}
                        ></textarea>
                      </div>
                    </div>

                    <div className="form-section">
                      <h6 className="section-header">
                        <i className="fas fa-calendar me-2"></i>
                        Lịch trình điều trị
                      </h6>
                      <div className="form-row">
                        <div className="form-column">
                          <div className="form-group">
                            <label className="form-label">
                              <i className="fas fa-calendar-alt me-1"></i> Ngày
                              chuyển giai đoạn tiếp theo
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              name="nextPhaseDate"
                              value={formData.nextPhaseDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-column">
                          <div className="form-group">
                            <label className="form-label">
                              <i className="fas fa-calendar-check me-1"></i>{" "}
                              Ngày tái khám tiếp theo
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              name="nextVisitDate"
                              value={formData.nextVisitDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h6 className="section-header">
                        <i className="fas fa-clipboard me-2"></i>
                        Thông tin bổ sung
                      </h6>
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-sticky-note me-1"></i> Ghi chú
                        </label>
                        <textarea
                          className="form-control form-control-textarea"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Nhập các ghi chú khác (không bắt buộc)..."
                          rows={2}
                        ></textarea>
                      </div>
                    </div>

                    <div className="button-container">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                        disabled={modalLoading}
                      >
                        <i className="fas fa-times me-1"></i> Hủy
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={modalLoading}
                      >
                        {modalLoading ? (
                          <>
                            <div className="spinner"></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-1"></i> Lưu kế hoạch
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
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
