import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Badge,
  Modal,
  Button,
  Form,
  Select,
  message,
  Tabs,
  Table,
  Tag,
  Space,
  Tooltip,
  Card,
  Row,
  Col,
  Typography,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import axios from "axios";
import "../../styles/AppointmentSchedule.css";

const { Option } = Select;
const { TabPane } = Tabs;
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
  const [activeTab, setActiveTab] = useState("1");
  const [statusForm] = Form.useForm();
  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Replace with your API endpoint
        // const response = await axios.get('/api/appointments');
        // setAppointments(response.data);
        // Mock data
        setAppointments([
          {
            id: 1,
            patientId: "PT001",
            patientName: "Nguyen Van A",
            patientPhone: "0901234567",
            patientEmail: "nguyenvana@email.com",
            date: "2025-06-02",
            duration: 30,
            service: "Regular Checkup",
            status: "confirmed",
            notes: "First-time checkup",
            medicalHistory: "No significant medical history",
            createdAt: "2025-05-20",
          },
          {
            id: 2,
            patientId: "PT002",
            patientName: "Tran Thi B",
            patientPhone: "0912345678",
            patientEmail: "tranthib@email.com",
            date: "2025-06-02",
            duration: 45,
            service: "Dental Cleaning",
            status: "confirmed",
            notes: "Regular cleaning appointment",
            medicalHistory: "Allergic to penicillin",
            createdAt: "2025-05-22",
          },
          {
            id: 3,
            patientId: "PT003",
            patientName: "Le Van C",
            patientPhone: "0923456789",
            patientEmail: "levanc@email.com",
            date: "2025-06-02",
            duration: 60,
            service: "Root Canal Treatment",
            status: "pending",
            notes: "Patient reported severe tooth pain",
            medicalHistory: "Hypertension",
            createdAt: "2025-05-25",
          },
          {
            id: 4,
            patientId: "PT004",
            patientName: "Pham Thi D",
            patientPhone: "0934567890",
            patientEmail: "phamthid@email.com",
            date: "2025-06-03",
            duration: 30,
            service: "Consultation",
            status: "confirmed",
            notes: "Considering orthodontic treatment",
            medicalHistory: "No significant medical history",
            createdAt: "2025-05-26",
          },
          {
            id: 5,
            patientId: "PT005",
            patientName: "Hoang Van E",
            patientPhone: "0945678901",
            patientEmail: "hoangvane@email.com",
            date: "2025-06-04",
            duration: 45,
            service: "Dental Implant Consultation",
            status: "cancelled",
            notes: "Patient requested cancellation",
            medicalHistory: "Diabetes",
            createdAt: "2025-05-27",
          },
          {
            id: 6,
            patientId: "PT006",
            patientName: "Vu Thi F",
            patientPhone: "0956789012",
            patientEmail: "vuthif@email.com",
            date: "2025-06-05",
            duration: 60,
            service: "Wisdom Tooth Extraction",
            status: "confirmed",
            notes: "Pre-surgery consultation",
            medicalHistory: "No significant medical history",
            createdAt: "2025-05-28",
          },
          {
            id: 7,
            patientId: "PT007",
            patientName: "Nguyen Van G",
            patientPhone: "0967890123",
            patientEmail: "nguyenvang@email.com",
            date: "2025-06-05",
            duration: 30,
            service: "Follow-up",
            status: "completed",
            notes: "Post-treatment checkup",
            medicalHistory: "Asthma",
            createdAt: "2025-05-29",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        message.error("Failed to load appointment data");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  const dateCellRender = useCallback(
    (value) => {
      const formattedDate = value.format("YYYY-MM-DD");
      const listData = appointments.filter(
        (appointment) => appointment.date === formattedDate
      );

      return (
        <ul className="events">
          {listData.map((item) => (
            <li key={item.id}>
              <Badge
                status={getStatusBadge(item.status)}
                text={`${item.patientName}`}
                className="appointment-badge"
              />
            </li>
          ))}
        </ul>
      );
    },
    [appointments]
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "processing";
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };
  const getStatusTag = (status) => {
    switch (status) {
      case "confirmed":
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
  const handleDateSelect = (value) => {
    setSelectedDate(value);
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
      .then((values) => {
        // Replace with API call to update appointment status
        // axios.put(`/api/appointments/${currentAppointment.id}/status`, values)

        message.success("Appointment status updated successfully");
        statusForm.resetFields();
        setIsUpdateStatusVisible(false); // Update local state (mock implementation)
        const updatedAppointments = appointments.map((appointment) => {
          if (appointment.id === currentAppointment.id) {
            return {
              ...appointment,
              status: values.status,
              // Không cập nhật notes
            };
          }
          return appointment;
        });

        setAppointments(updatedAppointments);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };
  const getDailyAppointments = useCallback(() => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    return appointments.filter(
      (appointment) => appointment.date === formattedDate
    );
  }, [appointments, selectedDate]);

  const getUpcomingAppointments = useCallback(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return appointments.filter(
      (appointment) =>
        appointment.date >= today &&
        appointment.status !== "completed" &&
        appointment.status !== "cancelled"
    );
  }, [appointments]);
  const columns = [
    {
      title: "PATIENT",
      dataIndex: "patientName",
      key: "patientName",
      width: "30%",
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: "SERVICE",
      dataIndex: "service",
      key: "service",
      width: "30%",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Confirmed", value: "confirmed" },
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
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
  const upcomingColumns = [
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      width: "15%",
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "PATIENT",
      dataIndex: "patientName",
      key: "patientName",
      width: "25%",
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
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
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
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        className="appointment-tabs"
      >
        <TabPane
          tab={
            <span>
              <CalendarOutlined /> Calendar View
            </span>
          }
          key="1"
        >
          <div className="calendar-container">
            {" "}
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : (
              <Calendar
                dateCellRender={dateCellRender}
                onSelect={handleDateSelect}
                value={selectedDate}
                key="appointment-calendar"
              />
            )}
            <div className="daily-appointments">
              <Card
                title={
                  <span>
                    <BarsOutlined /> Appointments for{" "}
                    {selectedDate.format("MMMM D, YYYY")}
                  </span>
                }
              >
                {/* Tránh gọi useMemo trong điều kiện */}{" "}
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
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <TeamOutlined /> Upcoming Appointments
            </span>
          }
          key="2"
        >
          {" "}
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={getUpcomingAppointments()}
              columns={upcomingColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: "No upcoming appointments" }}
              style={tableStyle}
              bordered
              className="appointment-table"
            />
          )}
        </TabPane>{" "}
      </Tabs>
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
