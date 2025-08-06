import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  Progress,
  Modal,
  Form,
  message,
  Avatar,
  Divider,
  Timeline,
  Statistic,
  Tabs,
  List,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  FileTextOutlined,
  PhoneOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService, authService } from "../../services";
import "../../styles/TreatmentPlansManagement.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const TreatmentPlansManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTreatmentPlans();
  }, []);

  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();

      if (!currentUser?.doctor?.id) {
        message.error("Không thể tải kế hoạch điều trị");
        return;
      }

      const doctorId = currentUser.doctor.id;

      // Gọi API thực để lấy treatment plans của doctor
      const response = await treatmentService.getDoctorTreatmentPlans(doctorId);

      // Handle the new API response structure
      if (
        response &&
        response.success &&
        response.data &&
        Array.isArray(response.data)
      ) {
        setTreatmentPlans(response.data);
      } else if (response && response.treatmentPlans) {
        setTreatmentPlans(response.treatmentPlans);
      } else if (Array.isArray(response)) {
        setTreatmentPlans(response);
      } else {
        setTreatmentPlans([]);
      }
    } catch (error) {
      message.error(
        "Không thể tải danh sách kế hoạch điều trị: " +
          (error.message || "Unknown error")
      );
      setTreatmentPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...treatmentPlans];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((item) => {
        const plan = item.treatmentPlan || item;
        return plan.status === filters.status;
      });
    }

    // Phase filter removed as requested

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((item) => {
        const plan = item.treatmentPlan || item;
        const customer = item.customer || {};

        const patientName = (
          customer.fullName ||
          customer.user?.fullName ||
          plan.customerName ||
          plan.patientName ||
          ""
        ).toLowerCase();
        const treatmentType = (
          plan.treatmentType ||
          plan.treatmentService?.serviceName ||
          plan.serviceName ||
          ""
        ).toLowerCase();
        const phone = (customer.phone || "").toLowerCase();
        const email = (customer.email || "").toLowerCase();

        return (
          patientName.includes(searchTerm) ||
          treatmentType.includes(searchTerm) ||
          phone.includes(searchTerm) ||
          email.includes(searchTerm)
        );
      });
    }

    setFilteredPlans(filtered);
  }, [treatmentPlans, filters]);

  useEffect(() => {
    applyFilters();
  }, [treatmentPlans, filters, applyFilters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Completed":
        return "blue";
      case "On-Hold":
        return "orange";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getPhaseProgress = (currentPhase, treatmentType) => {
    // Xác định số giai đoạn tối đa dựa theo loại điều trị
    const maxPhases = treatmentType?.toUpperCase().includes("IVF") ? 7 : 5;
    return (currentPhase / maxPhases) * 100;
  };

  const handleViewDetails = (plan) => {
    // Navigate to detail page with patient ID
    const patientId = plan.customer?.id || plan.patientId;
    if (patientId) {
      navigate(`/doctor/treatmentsprogress/detail/${patientId}`);
    } else {
      message.error(
        "Không tìm thấy thông tin bệnh nhân cho kế hoạch điều trị này"
      );
    }
  };

  const handleUpdateProgress = (planData) => {
    setSelectedPlan(planData);

    const plan = planData.treatmentPlan || planData;
    const nextVisitDate = plan.nextVisitDate || plan.nextAppointmentDate;
    // Đã loại bỏ nextPhaseDate theo yêu cầu

    form.setFieldsValue({
      currentPhase: plan.currentPhase || plan.phase || 1,
      phaseDescription: plan.phaseDescription || plan.description || "",
      nextVisitDate: nextVisitDate ? dayjs(nextVisitDate) : null,
      // Đã loại bỏ trường nextPhaseDate theo yêu cầu
      progressNotes: plan.progressNotes || plan.notes || "",
      status: plan.status || "Active",
    });
    setUpdateModalVisible(true);
  };

  const handleUpdateSubmit = async (values) => {
    try {
      const plan = selectedPlan.treatmentPlan || selectedPlan;

      // Validate plan ID
      if (!plan.id) {
        message.error("Không thể xác định ID kế hoạch điều trị");
        return;
      }

      // Format dates properly - handle both dayjs objects and string values from date inputs
      const formatDate = (dateValue) => {
        if (!dateValue) return null;
        if (dayjs.isDayjs(dateValue)) {
          return dateValue.format("YYYY-MM-DD");
        }
        return dateValue; // Already a string from the date input
      };

      const updateData = {
        currentPhase: values.currentPhase,
        phaseDescription: values.phaseDescription,
        nextVisitDate: formatDate(values.nextVisitDate),
        // Đã loại bỏ trường nextPhaseDate theo yêu cầu
        progressNotes: values.progressNotes,
        status: values.status,
      };

      // Add loading state
      const loadingMessage = message.loading(
        "Đang cập nhật tiến trình điều trị...",
        0
      );

      try {
        const result = await treatmentService.updateTreatmentProgress(
          plan.id,
          updateData
        );

        if (result.success) {
          message.success(result.message || "Cập nhật tiến trình thành công!");
          setUpdateModalVisible(false);
          form.resetFields();

          // Refresh data without full reload
          await fetchTreatmentPlans();
        } else {
          message.error(
            result.message || "Có lỗi xảy ra khi cập nhật tiến trình"
          );

          // Log validation errors if any
          if (result.errors) {
            console.error("Validation errors:", result.errors);
          }
        }
      } finally {
        loadingMessage();
      }
    } catch (error) {
      // More specific error messages
      if (error.status === 404) {
        message.error("Không tìm thấy kế hoạch điều trị");
      } else if (error.status === 401) {
        message.error("Không có quyền cập nhật kế hoạch điều trị");
      } else if (error.status === 400) {
        message.error(
          "Dữ liệu không hợp lệ: " +
            (error.message || "Unknown validation error")
        );
      } else {
        message.error(
          "Có lỗi xảy ra khi cập nhật tiến trình: " +
            (error.message || "Unknown error")
        );
      }
    }
  };

  const columns = [
    {
      title: "Bệnh nhân",
      key: "patientName",
      render: (_, record) => {
        const customer = record.customer || {};
        const patientName = customer.fullName || customer.name || "Chưa có tên";
        // const customerId = customer.id || "N/A";
        const phone = customer.phone || "";

        return (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <div>
              <Text strong>{patientName}</Text>

              {/* <Text type="secondary">ID: {customerId}</Text> */}
              {phone && (
                <>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    <PhoneOutlined /> {phone}
                  </Text>
                </>
              )}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Dịch vụ điều trị",
      key: "treatmentType",
      render: (_, record) => {
        const plan = record.treatmentPlan || record;
        const treatmentType =
          plan.treatmentType ||
          plan.treatmentService?.serviceName ||
          "Chưa xác định";
        const basePrice =
          plan.treatmentService?.basePrice || plan.totalCost || 0;
        const successRate = plan.treatmentService?.successRate || 0;

        return (
          <div>
            <Text strong>{treatmentType}</Text>
            <br />
            <Text type="secondary">
              <DollarOutlined /> {basePrice.toLocaleString()} VND
            </Text>
            {successRate > 0 && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Tỷ lệ thành công: {successRate}%
                </Text>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "Tiến trình",
      key: "progress",
      render: (_, record) => {
        const plan = record.treatmentPlan || record;
        const currentPhase = plan.currentPhase || plan.phase || 1;
        const treatmentType = plan.treatmentType || "";
        // Xác định số giai đoạn tối đa dựa theo loại điều trị
        const maxPhase = treatmentType?.toUpperCase().includes("IVF") ? 7 : 5;
        const stats = record.stats || {};

        return (
          <div>
            <Progress
              percent={getPhaseProgress(currentPhase, treatmentType)}
              showInfo={false}
              strokeColor="#1976d2"
            />
            <Text type="secondary">
              Giai đoạn {currentPhase}/{maxPhase}
            </Text>
            {stats.daysInTreatment && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {stats.daysInTreatment} ngày điều trị
                </Text>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const plan = record.treatmentPlan || record;
        const status = plan.status || "Active";

        return (
          <div>
            <Tag color={getStatusColor(status)}>
              {status === "Active"
                ? "Đang điều trị"
                : status === "Completed"
                ? "Hoàn thành"
                : status === "On-Hold"
                ? "Tạm dừng"
                : "Đã hủy"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="middle"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            style={{
              backgroundColor: "#f5f5f5",
              color: "#1890ff",
              borderColor: "#e8e8e8",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 16px",
            }}
          >
            Chi tiết
          </Button>
          <Button
            size="middle"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleUpdateProgress(record)}
            style={{
              backgroundColor: "#4cd964",
              borderColor: "#4cd964",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 16px",
            }}
          >
            Cập nhật
          </Button>
        </Space>
      ),
    },
  ];

  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString() + " VND" : "0 VND";
  };

  return (
    <div className="treatment-plans-management">
      <div className="page-header">
        <Title level={2}>Quản lý kế hoạch điều trị</Title>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Tìm kiếm bệnh nhân, SĐT, email..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Active">Đang điều trị</Option>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="On-Hold">Tạm dừng</Option>
              <Option value="Cancelled">Đã hủy</Option>
            </Select>
          </Col>
          {/* Phase filter removed as requested */}
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPlans}
          rowKey={(record) => record.treatmentPlan?.id || record.id}
          loading={loading}
          pagination={{
            total: filteredPlans.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} kế hoạch điều trị`,
          }}
        />
      </Card>

      {/* Enhanced Detail Modal */}
      <Modal
        title="Chi tiết kế hoạch điều trị"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedPlan && (
          <div>
            <Tabs defaultActiveKey="overview">
              <TabPane tab="Tổng quan" key="overview">
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Statistic
                      title="Bệnh nhân"
                      value={selectedPlan.customer?.fullName || "Chưa có tên"}
                      prefix={<UserOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Loại điều trị"
                      value={
                        selectedPlan.treatmentPlan?.treatmentType ||
                        "Chưa xác định"
                      }
                      prefix={<MedicineBoxOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Trạng thái"
                      value={selectedPlan.treatmentPlan?.status || "Active"}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                </Row>

                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Statistic
                      title="Tổng chi phí"
                      value={formatCurrency(
                        selectedPlan.treatmentPlan?.totalCost
                      )}
                      prefix={<DollarOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Đã thanh toán"
                      value={formatCurrency(
                        selectedPlan.treatmentPlan?.paidAmount
                      )}
                      prefix={<DollarOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Tỷ lệ thành công"
                      value={`${
                        selectedPlan.treatmentPlan?.treatmentService
                          ?.successRate || 0
                      }%`}
                      precision={1}
                    />
                  </Col>
                </Row>

                <Divider />

                <Timeline>
                  <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
                    <Text strong>Bắt đầu điều trị</Text>
                    <br />
                    <Text type="secondary">
                      {dayjs(selectedPlan.treatmentPlan?.startDate).format(
                        "DD/MM/YYYY"
                      )}
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item color="blue" dot={<ClockCircleOutlined />}>
                    <Text strong>
                      Giai đoạn hiện tại:{" "}
                      {selectedPlan.treatmentPlan?.currentPhase || 1}/
                      {selectedPlan.treatmentPlan?.treatmentType
                        ?.toUpperCase()
                        .includes("IVF")
                        ? 7
                        : 5}
                    </Text>
                    <br />
                    <Text>
                      {selectedPlan.treatmentPlan?.phaseDescription ||
                        "Không có mô tả"}
                    </Text>
                  </Timeline.Item>

                  {selectedPlan.treatmentPlan?.nextVisitDate && (
                    <Timeline.Item color="orange">
                      <Text strong>Lần khám tiếp theo</Text>
                      <br />
                      <Text type="secondary">
                        {dayjs(selectedPlan.treatmentPlan.nextVisitDate).format(
                          "DD/MM/YYYY"
                        )}
                      </Text>
                    </Timeline.Item>
                  )}

                  {selectedPlan.treatmentPlan?.nextPhaseDate && (
                    <Timeline.Item color="purple">
                      <Text strong>Dự kiến chuyển giai đoạn tiếp theo</Text>
                      <br />
                      <Text type="secondary">
                        {dayjs(selectedPlan.treatmentPlan.nextPhaseDate).format(
                          "DD/MM/YYYY"
                        )}
                      </Text>
                    </Timeline.Item>
                  )}
                </Timeline>
              </TabPane>

              <TabPane tab="Thông tin bệnh nhân" key="patient">
                <div style={{ padding: "16px 0" }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Họ tên:</Text>
                      <br />
                      <Text>
                        {selectedPlan.customer?.fullName || "Chưa có thông tin"}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Email:</Text>
                      <br />
                      <Text>
                        {selectedPlan.customer?.email || "Chưa có thông tin"}
                      </Text>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Text strong>Số điện thoại:</Text>
                      <br />
                      <Text>
                        {selectedPlan.customer?.phone || "Chưa có thông tin"}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Giới tính:</Text>
                      <br />
                      <Text>
                        {selectedPlan.customer?.gender || "Chưa có thông tin"}
                      </Text>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Text strong>Ngày sinh:</Text>
                      <br />
                      <Text>
                        {selectedPlan.customer?.dateOfBirth
                          ? dayjs(selectedPlan.customer.dateOfBirth).format(
                              "DD/MM/YYYY"
                            )
                          : "Chưa có thông tin"}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Tình trạng hôn nhân:</Text>
                      <br />
                      <Text>
                        {selectedPlan.customer?.maritalStatus ||
                          "Chưa có thông tin"}
                      </Text>
                    </Col>
                  </Row>
                  {selectedPlan.customer?.medicalHistory && (
                    <Row gutter={16} style={{ marginTop: 16 }}>
                      <Col span={24}>
                        <Text strong>Tiền sử bệnh:</Text>
                        <br />
                        <Text>{selectedPlan.customer.medicalHistory}</Text>
                      </Col>
                    </Row>
                  )}
                </div>
              </TabPane>

              <TabPane tab="Lịch hẹn" key="appointments">
                <div style={{ padding: "16px 0" }}>
                  <Title level={4}>Lịch hẹn gần đây</Title>
                  <List
                    dataSource={selectedPlan.recentAppointments || []}
                    renderItem={(appointment) => (
                      <List.Item>
                        <div style={{ width: "100%" }}>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Text strong>
                                {dayjs(appointment.appointmentDate).format(
                                  "DD/MM/YYYY"
                                )}
                              </Text>
                              <br />
                              <Text type="secondary">
                                {appointment.timeSlot}
                              </Text>
                            </Col>
                            <Col span={8}>
                              <Text>{appointment.type}</Text>
                              <br />
                              <Tag
                                color={
                                  appointment.status === "Completed"
                                    ? "green"
                                    : "blue"
                                }
                              >
                                {appointment.status === "Completed"
                                  ? "Hoàn thành"
                                  : "Đã đặt"}
                              </Tag>
                            </Col>
                            <Col span={8}>
                              <Text type="secondary">{appointment.notes}</Text>
                            </Col>
                          </Row>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </TabPane>

              <TabPane tab="Hồ sơ y tế" key="medical">
                <div style={{ padding: "16px 0" }}>
                  <Title level={4}>Hồ sơ y tế gần đây</Title>
                  <List
                    dataSource={selectedPlan.recentMedicalRecords || []}
                    renderItem={(record) => (
                      <List.Item>
                        <div style={{ width: "100%" }}>
                          <Row gutter={16}>
                            <Col span={6}>
                              <Text strong>Ngày khám:</Text>
                              <br />
                              <Text>
                                {dayjs(record.recordDate).format("DD/MM/YYYY")}
                              </Text>
                            </Col>
                            <Col span={6}>
                              <Text strong>Chẩn đoán:</Text>
                              <br />
                              <Text>{record.diagnosis}</Text>
                            </Col>
                            <Col span={6}>
                              <Text strong>Điều trị:</Text>
                              <br />
                              <Text>{record.treatment}</Text>
                            </Col>
                            <Col span={6}>
                              <Text strong>Đơn thuốc:</Text>
                              <br />
                              <Text>{record.prescription}</Text>
                            </Col>
                          </Row>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </TabPane>

              <TabPane tab="Thống kê" key="stats">
                <div style={{ padding: "16px 0" }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Tổng số lịch hẹn"
                        value={selectedPlan.stats?.totalAppointments || 0}
                        prefix={<CalendarOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Đã hoàn thành"
                        value={selectedPlan.stats?.completedAppointments || 0}
                        prefix={<CheckCircleOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Hồ sơ y tế"
                        value={selectedPlan.stats?.totalMedicalRecords || 0}
                        prefix={<FileTextOutlined />}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Statistic
                        title="Ngày điều trị"
                        value={selectedPlan.stats?.daysInTreatment || 0}
                        prefix={<HistoryOutlined />}
                        suffix="ngày"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Có lịch hẹn hôm nay"
                        value={
                          selectedPlan.stats?.hasTodayAppointment
                            ? "Có"
                            : "Không"
                        }
                        prefix={<CalendarOutlined />}
                      />
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>

      {/* Update Progress Modal */}
      <Modal
        title="Cập nhật tiến trình điều trị"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateSubmit}>
          <Form.Item
            label="Giai đoạn hiện tại"
            name="currentPhase"
            rules={[{ required: true, message: "Vui lòng chọn giai đoạn" }]}
          >
            <Select>
              <Option value={1}>Giai đoạn 1</Option>
              <Option value={2}>Giai đoạn 2</Option>
              <Option value={3}>Giai đoạn 3</Option>
              <Option value={4}>Giai đoạn 4</Option>
              <Option value={5}>Giai đoạn 5</Option>
              <Option value={6}>Giai đoạn 6</Option>
              <Option value={7}>Giai đoạn 7</Option>
              <Option value={8}>Giai đoạn 8</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mô tả giai đoạn"
            name="phaseDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết giai đoạn hiện tại..."
            />
          </Form.Item>

          <Row gutter={16} className="update-form-date-inputs">
            <Col span={24}>
              <Form.Item
                label="Ngày tái khám"
                name="nextVisitDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày khám tiếp theo",
                  },
                ]}
              >
                <Input type="date" min={dayjs().format("YYYY-MM-DD")} />
              </Form.Item>
            </Col>
            {/* Đã loại bỏ trường ngày chuyển giai đoạn tiếp theo theo yêu cầu */}
          </Row>

          <Text
            type="secondary"
            style={{ display: "block", marginBottom: "16px" }}
          ></Text>

          <Form.Item label="Ghi chú tiến trình" name="progressNotes">
            <TextArea
              rows={3}
              placeholder="Ghi chú về tiến trình điều trị..."
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value="Active">Đang điều trị</Option>
              <Option value="On-Hold">Tạm dừng</Option>
              <Option value="Completed">Hoàn thành</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setUpdateModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TreatmentPlansManagement;
