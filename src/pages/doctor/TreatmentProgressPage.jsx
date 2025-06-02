import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Tabs,
  Modal,
  Form,
  Select,
  DatePicker,
  Tooltip,
  message,
  Spin,
  Progress,
  Card,
  Timeline,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/TreatmentProgressPage.css";
// import axios from "axios";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const TreatmentProgressPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [viewTab, setViewTab] = useState("1");
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Replace with your API endpoint
        // const response = await axios.get('/api/treatment-progress');
        // setPatients(response.data);

        // Mock data
        setPatients([
          {
            id: 1,
            patientId: "P001",
            name: "Nguyen Van A",
            age: 35,
            condition: "Dental Implant",
            startDate: "2025-03-15",
            estimatedEndDate: "2025-06-15",
            progress: 60,
            status: "in-progress",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-20",
          },
          {
            id: 2,
            patientId: "P002",
            name: "Tran Thi B",
            age: 28,
            condition: "Root Canal Treatment",
            startDate: "2025-04-10",
            estimatedEndDate: "2025-05-30",
            progress: 80,
            status: "in-progress",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-22",
          },
          {
            id: 3,
            patientId: "P003",
            name: "Le Van C",
            age: 42,
            condition: "Orthodontic Treatment",
            startDate: "2025-01-05",
            estimatedEndDate: "2025-07-05",
            progress: 45,
            status: "in-progress",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-15",
          },
          {
            id: 4,
            patientId: "P004",
            name: "Pham Thi D",
            age: 50,
            condition: "Periodontal Treatment",
            startDate: "2025-04-25",
            estimatedEndDate: "2025-06-25",
            progress: 30,
            status: "in-progress",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-10",
          },
          {
            id: 5,
            patientId: "P005",
            name: "Hoang Van E",
            age: 22,
            condition: "Wisdom Tooth Extraction",
            startDate: "2025-05-01",
            estimatedEndDate: "2025-05-15",
            progress: 100,
            status: "completed",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-15",
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        message.error("Failed to load patient data");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchText.toLowerCase())
  );

  const showViewModal = (patient) => {
    setCurrentPatient(patient);
    fetchTreatmentHistory(patient.id);
    setIsViewModalVisible(true);
  };

  const showAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const showUpdateModal = (patient) => {
    setCurrentPatient(patient);
    updateForm.setFieldsValue({
      progress: patient.progress,
      status: patient.status,
      notes: "",
      nextAppointment:
        patient.status !== "completed" ? dayjs().add(7, "day") : null,
    });
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsAddModalVisible(false);
    setIsUpdateModalVisible(false);
  };

  const handleAddSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Replace with API call to add new patient
        // axios.post('/api/treatment-progress', values)

        message.success("New treatment progress added successfully!");
        form.resetFields();
        setIsAddModalVisible(false);

        // Refresh patient list (mock implementation)
        const newPatient = {
          id: patients.length + 1,
          patientId: values.patientId,
          name: values.name,
          age: values.age,
          condition: values.condition,
          startDate: values.startDate.format("YYYY-MM-DD"),
          estimatedEndDate: values.estimatedEndDate.format("YYYY-MM-DD"),
          progress: 0,
          status: "new",
          doctor: "Dr. Tran Minh", // Replace with actual logged-in doctor
          lastUpdate: dayjs().format("YYYY-MM-DD"),
        };

        setPatients([...patients, newPatient]);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleUpdateSubmit = () => {
    updateForm
      .validateFields()
      .then((values) => {
        // Replace with API call to update patient progress
        // axios.put(`/api/treatment-progress/${currentPatient.id}`, values)

        message.success("Treatment progress updated successfully!");
        updateForm.resetFields();
        setIsUpdateModalVisible(false);

        // Update patient list (mock implementation)
        const updatedPatients = patients.map((patient) => {
          if (patient.id === currentPatient.id) {
            return {
              ...patient,
              progress: values.progress,
              status: values.status,
              lastUpdate: dayjs().format("YYYY-MM-DD"),
            };
          }
          return patient;
        });

        setPatients(updatedPatients);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const fetchTreatmentHistory = (patientId) => {
    // Replace with API call to get treatment history
    // axios.get(`/api/treatment-history/${patientId}`)

    // Mock treatment history data
    setTreatmentHistory([
      {
        id: 1,
        date: "2025-03-15",
        progress: 0,
        status: "new",
        notes: "Initial examination. Treatment plan created.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-03-22",
      },
      {
        id: 2,
        date: "2025-03-22",
        progress: 15,
        status: "in-progress",
        notes: "First treatment session completed. Patient responding well.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-04-05",
      },
      {
        id: 3,
        date: "2025-04-05",
        progress: 30,
        status: "in-progress",
        notes: "Second treatment session. Minor complications resolved.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-04-19",
      },
      {
        id: 4,
        date: "2025-04-19",
        progress: 45,
        status: "in-progress",
        notes: "Progress is as expected. Continuing with treatment plan.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-05-03",
      },
      {
        id: 5,
        date: "2025-05-03",
        progress: 60,
        status: "in-progress",
        notes: "Good progress. Patient reports improvement in symptoms.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-05-24",
      },
    ]);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "new":
        return <Tag color="blue">New</Tag>;
      case "in-progress":
        return <Tag color="processing">In Progress</Tag>;
      case "completed":
        return <Tag color="success">Completed</Tag>;
      case "cancelled":
        return <Tag color="error">Cancelled</Tag>;
      case "on-hold":
        return <Tag color="warning">On Hold</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "red";
    if (progress < 70) return "blue";
    return "green";
  };

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "patientId",
      key: "patientId",
      sorter: (a, b) => a.patientId.localeCompare(b.patientId),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
    },
    {
      title: "Est. End Date",
      dataIndex: "estimatedEndDate",
      key: "estimatedEndDate",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          strokeColor={getProgressColor(progress)}
        />
      ),
      sorter: (a, b) => a.progress - b.progress,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "New", value: "new" },
        { text: "In Progress", value: "in-progress" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
        { text: "On Hold", value: "on-hold" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Last Update",
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      sorter: (a, b) => dayjs(a.lastUpdate).unix() - dayjs(b.lastUpdate).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => showViewModal(record)}
            />
          </Tooltip>
          <Tooltip title="Update Progress">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => showUpdateModal(record)}
              disabled={
                record.status === "completed" || record.status === "cancelled"
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="treatment-progress-container">
      <div className="treatment-progress-header">
        <h1>Treatment Progress Management</h1>
        <Space>
          <Input
            placeholder="Search by name, ID or condition"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add New Treatment
          </Button>
        </Space>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="treatment-table"
        />
      )}

      {/* View Patient Treatment Details Modal */}
      <Modal
        title="Treatment Progress Details"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {currentPatient && (
          <div className="treatment-details">
            <Tabs defaultActiveKey="1" onChange={(key) => setViewTab(key)}>
              <TabPane tab="Patient Information" key="1">
                <Row gutter={16} className="patient-info-row">
                  <Col span={12}>
                    <Card title="Patient Details" className="patient-card">
                      <p>
                        <strong>Patient ID:</strong> {currentPatient.patientId}
                      </p>
                      <p>
                        <strong>Name:</strong> {currentPatient.name}
                      </p>
                      <p>
                        <strong>Age:</strong> {currentPatient.age}
                      </p>
                      <p>
                        <strong>Attending Doctor:</strong>{" "}
                        {currentPatient.doctor}
                      </p>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Treatment Details" className="treatment-card">
                      <p>
                        <strong>Condition:</strong> {currentPatient.condition}
                      </p>
                      <p>
                        <strong>Start Date:</strong> {currentPatient.startDate}
                      </p>
                      <p>
                        <strong>Est. End Date:</strong>{" "}
                        {currentPatient.estimatedEndDate}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusTag(currentPatient.status)}
                      </p>
                    </Card>
                  </Col>
                </Row>
                <Card title="Treatment Progress" className="progress-card">
                  <Progress
                    percent={currentPatient.progress}
                    status={
                      currentPatient.status === "completed"
                        ? "success"
                        : currentPatient.status === "cancelled"
                        ? "exception"
                        : "active"
                    }
                  />
                  <div className="last-update-info">
                    <p>
                      <strong>Last Updated:</strong> {currentPatient.lastUpdate}
                    </p>
                  </div>
                </Card>
              </TabPane>
              <TabPane tab="Treatment History" key="2">
                <Timeline
                  mode="left"
                  items={treatmentHistory.map((record) => ({
                    children: (
                      <Card className="history-card">
                        <p>
                          <strong>Date:</strong> {record.date}
                        </p>
                        <p>
                          <strong>Progress:</strong> {record.progress}%
                        </p>
                        <p>
                          <strong>Status:</strong> {getStatusTag(record.status)}
                        </p>
                        <p>
                          <strong>Notes:</strong> {record.notes}
                        </p>
                        <p>
                          <strong>Attending Doctor:</strong> {record.doctor}
                        </p>
                        <p>
                          <strong>Next Appointment:</strong>{" "}
                          {record.nextAppointment}
                        </p>
                      </Card>
                    ),
                    dot:
                      record.status === "completed" ? (
                        <CheckCircleOutlined style={{ color: "green" }} />
                      ) : record.status === "cancelled" ? (
                        <CloseCircleOutlined style={{ color: "red" }} />
                      ) : (
                        <ClockCircleOutlined style={{ color: "blue" }} />
                      ),
                  }))}
                />
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>

      {/* Add New Treatment Modal */}
      <Modal
        title="Add New Treatment"
        open={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="patientId"
            label="Patient ID"
            rules={[{ required: true, message: "Please input patient ID" }]}
          >
            <Input placeholder="Enter patient ID" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Patient Name"
            rules={[{ required: true, message: "Please input patient name" }]}
          >
            <Input placeholder="Enter patient name" />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please input patient age" }]}
          >
            <Input type="number" placeholder="Enter age" />
          </Form.Item>
          <Form.Item
            name="condition"
            label="Condition"
            rules={[{ required: true, message: "Please input condition" }]}
          >
            <Input placeholder="Enter medical condition" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="estimatedEndDate"
            label="Estimated End Date"
            rules={[
              { required: true, message: "Please select estimated end date" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="initialNotes"
            label="Initial Notes"
            rules={[{ required: true, message: "Please add initial notes" }]}
          >
            <TextArea rows={4} placeholder="Enter initial treatment notes" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Treatment Progress Modal */}
      <Modal
        title="Update Treatment Progress"
        open={isUpdateModalVisible}
        onOk={handleUpdateSubmit}
        onCancel={handleCancel}
      >
        {currentPatient && (
          <Form form={updateForm} layout="vertical">
            <div className="patient-update-info">
              <p>
                <strong>Patient:</strong> {currentPatient.name} (
                {currentPatient.patientId})
              </p>
              <p>
                <strong>Condition:</strong> {currentPatient.condition}
              </p>
              <p>
                <strong>Current Progress:</strong> {currentPatient.progress}%
              </p>
            </div>
            <Form.Item
              name="progress"
              label="Update Progress (%)"
              rules={[
                { required: true, message: "Please input progress percentage" },
              ]}
            >
              <Input type="number" min={0} max={100} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select treatment status">
                <Option value="new">New</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
                <Option value="on-hold">On Hold</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="notes"
              label="Progress Notes"
              rules={[{ required: true, message: "Please add progress notes" }]}
            >
              <TextArea rows={4} placeholder="Enter progress notes" />
            </Form.Item>
            <Form.Item name="nextAppointment" label="Next Appointment">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default TreatmentProgressPage;
