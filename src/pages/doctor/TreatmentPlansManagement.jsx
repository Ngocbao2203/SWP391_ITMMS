import React, { useState, useEffect, useCallback } from "react";
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
  Badge,
} from "antd";
import {
  PlusOutlined,
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
  const [loading, setLoading] = useState(false);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    phase: "all",
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
      console.log("Fetching treatment plans for doctorId:", doctorId);

      // Gọi API thực để lấy treatment plans của doctor
      const response = await treatmentService.getDoctorTreatmentPlans(doctorId);

      console.log("Treatment plans API response:", response);

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
        console.warn("Unexpected API response structure:", response);
        setTreatmentPlans([]);
      }
    } catch (error) {
      console.error("Error fetching treatment plans:", error);
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

    // Filter by phase
    if (filters.phase !== "all") {
      filtered = filtered.filter((item) => {
        const plan = item.treatmentPlan || item;
        const currentPhase = plan.currentPhase || plan.phase || 1;
        return currentPhase === parseInt(filters.phase);
      });
    }

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

  const getPhaseProgress = (currentPhase) => {
    return (currentPhase / 5) * 100;
  };

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setDetailModalVisible(true);
  };

  const handleUpdateProgress = (planData) => {
    setSelectedPlan(planData);

    const plan = planData.treatmentPlan || planData;
    const nextDate =
      plan.nextVisitDate || plan.nextAppointmentDate || plan.nextPhaseDate;

    form.setFieldsValue({
      currentPhase: plan.currentPhase || plan.phase || 1,
      phaseDescription: plan.phaseDescription || plan.description || "",
      nextVisitDate: nextDate ? dayjs(nextDate) : null,
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

      const updateData = {
        currentPhase: values.currentPhase,
        phaseDescription: values.phaseDescription,
        nextVisitDate: values.nextVisitDate?.format("YYYY-MM-DD"),
        progressNotes: values.progressNotes,
        status: values.status,
      };

      console.log("=== UPDATING TREATMENT PLAN ===");
      console.log("Plan ID:", plan.id);
      console.log("Update data:", updateData);
      console.log("API URL: PUT /api/TreatmentPlans/" + plan.id + "/progress");

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

        console.log("=== UPDATE RESULT ===");
        console.log("Success:", result.success);
        console.log("Message:", result.message);
        console.log("Data:", result.data);
        console.log("Errors:", result.errors);

        if (result.success) {
          message.success(result.message || "Cập nhật tiến trình thành công!");
          setUpdateModalVisible(false);
          form.resetFields();

          // Refresh data without full reload
          await fetchTreatmentPlans();
        } else {
          console.error("Update failed:", result);
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
      console.error("Error updating treatment plan:", error);

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
        const patientName =
          customer.fullName || customer.user?.fullName || "Chưa có tên";
        const customerId = customer.id || "N/A";
        const phone = customer.phone || "";

        return (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <div>
              <Text strong>{patientName}</Text>
              <br />
              <Text type="secondary">ID: {customerId}</Text>
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
        const maxPhase = plan.maxPhase || 5;
        const stats = record.stats || {};

        return (
          <div>
            <Progress
              percent={getPhaseProgress(currentPhase)}
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
        const paymentStatus = plan.paymentStatus || "Pending";

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
            <br />
            <Tag
              color={paymentStatus === "Paid" ? "green" : "orange"}
              style={{ marginTop: 4 }}
            >
              {paymentStatus === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Lịch hẹn hôm nay",
      key: "todayAppointment",
      render: (_, record) => {
        const todayAppointment = record.todayAppointment;
        const stats = record.stats || {};

        return (
          <div>
            {todayAppointment ? (
              <div>
                <Badge status="processing" text="Có lịch hẹn" />
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {todayAppointment.timeSlot}
                </Text>
              </div>
            ) : (
              <Text type="secondary">Không có lịch hẹn</Text>
            )}
            {stats.hasTodayAppointment && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <CalendarOutlined /> Hôm nay
                </Text>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button> */}
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleUpdateProgress(record)}
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            /* Handle create new plan */
          }}
        >
          Tạo kế hoạch mới
        </Button>
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
          <Col xs={12} sm={8} md={6}>
            <Select
              placeholder="Giai đoạn"
              value={filters.phase}
              onChange={(value) => handleFilterChange("phase", value)}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả giai đoạn</Option>
              <Option value="1">Giai đoạn 1</Option>
              <Option value="2">Giai đoạn 2</Option>
              <Option value="3">Giai đoạn 3</Option>
              <Option value="4">Giai đoạn 4</Option>
              <Option value="5">Giai đoạn 5</Option>
            </Select>
          </Col>
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
                      {selectedPlan.treatmentPlan?.currentPhase || 1}/5
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
        width={600}
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
