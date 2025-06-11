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
  Progress as AntdProgress,
  Card,
  Timeline,
  Row,
  Col,
  Typography,
  Empty,
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
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  MinusCircleTwoTone,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/TreatmentProgressPage.css";
// import axios from "axios";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// Timeline component for patient treatment progress
const PatientTimeline = () => {
  // Patients data
  const patientsList = [
    { id: "p1", name: "Nguyễn Thị A" },
    { id: "p2", name: "Trần Văn B và Lê Thị M" },
    { id: "p3", name: "Lê Minh C và Phạm Thị N" },
    { id: "p4", name: "Phạm Hoàng D và Trần Thị P" },
  ];

  // Progress data for each patient
  const [progressData, setProgressData] = useState({
    p1: [
      {
        id: 1,
        step: "Khám tổng quát",
        time: "2025-05-20",
        status: "done",
        note: "Kiểm tra sức khỏe sinh sản, hẹn thực hiện các xét nghiệm",
      },
      {
        id: 2,
        step: "Xét nghiệm hormone",
        time: "2025-05-20",
        status: "done",
        note: "Phát hiện hormone FSH thấp, cần điều trị",
      },
      {
        id: 3,
        step: "Kích thích buồng trứng",
        time: "2025-05-24",
        status: "done",
        note: "Bắt đầu liệu trình kích thích buồng trứng",
      },
      {
        id: 4,
        step: "Theo dõi phát triển nang noãn",
        time: "2025-06-01",
        status: "doing",
        note: "Đang theo dõi sự phát triển của nang noãn",
      },
      {
        id: 5,
        step: "Thu hoạch trứng",
        time: "2025-06-15",
        status: "pending",
        note: "Dự kiến thu hoạch trứng",
      },
    ],
    p2: [
      {
        id: 1,
        step: "Khám tổng quát",
        time: "2025-05-22",
        status: "done",
        note: "Cặp vợ chồng cần điều trị IVF",
      },
      {
        id: 2,
        step: "Tư vấn phương pháp IVF",
        time: "2025-05-25",
        status: "doing",
        note: "Đang tư vấn về phương pháp và chi phí",
      },
      {
        id: 3,
        step: "Kích thích buồng trứng",
        time: "2025-06-10",
        status: "pending",
        note: "Chuẩn bị cho liệu trình kích thích buồng trứng",
      },
      {
        id: 4,
        step: "Thu hoạch và thụ tinh",
        time: "2025-06-20",
        status: "pending",
        note: "Dự kiến thực hiện thụ tinh trong ống nghiệm",
      },
    ],
    p3: [
      {
        id: 1,
        step: "Khám tổng quát",
        time: "2025-05-15",
        status: "done",
        note: "Cặp vợ chồng cần thụ tinh nhân tạo IUI",
      },
      {
        id: 2,
        step: "Xét nghiệm tinh trùng",
        time: "2025-05-15",
        status: "done",
        note: "Tinh trùng có chất lượng thấp, cần hỗ trợ",
      },
      {
        id: 3,
        step: "Chuẩn bị IUI",
        time: "2025-05-30",
        status: "done",
        note: "Đã hoàn thành quá trình chuẩn bị",
      },
      {
        id: 4,
        step: "Thực hiện IUI",
        time: "2025-06-06",
        status: "pending",
        note: "Dự kiến thực hiện thụ tinh nhân tạo IUI",
      },
    ],
    p4: [
      {
        id: 1,
        step: "Khám tổng quát",
        time: "2025-05-28",
        status: "done",
        note: "Cần hỗ trợ điều trị vô sinh thứ phát",
      },
      {
        id: 2,
        step: "Siêu âm buồng trứng",
        time: "2025-06-10",
        status: "pending",
        note: "Đặt lịch kiểm tra chức năng buồng trứng",
      },
    ],
  });

  const [selectedPatient, setSelectedPatient] = useState("p1");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(null);
  const [form] = Form.useForm();

  const patient = patientsList.find((p) => p.id === selectedPatient);
  const currentSteps = (progressData[selectedPatient] || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(a.time || "2100-01-01") - new Date(b.time || "2100-01-01")
    );

  const doneCount = currentSteps.filter((s) => s.status === "done").length;
  const percent =
    currentSteps.length > 0
      ? Math.round((doneCount / currentSteps.length) * 100)
      : 0;

  const globalStatus = currentSteps.every((s) => s.status === "done")
    ? "Hoàn thành"
    : currentSteps.some((s) => s.status === "doing")
    ? "Đang điều trị"
    : "Chưa bắt đầu";

  const statusColor = {
    done: "green",
    doing: "blue",
    pending: "gray",
  };

  const statusIcon = {
    done: (
      <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginLeft: 8 }} />
    ),
    doing: (
      <ClockCircleTwoTone twoToneColor="#1890ff" style={{ marginLeft: 8 }} />
    ),
    pending: (
      <MinusCircleTwoTone twoToneColor="#999" style={{ marginLeft: 8 }} />
    ),
  };

  const showAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const showEditModal = (progress) => {
    setCurrentProgress(progress);
    form.setFieldsValue({
      step: progress.step,
      time: progress.time ? dayjs(progress.time) : null,
      status: progress.status,
      note: progress.note || "",
    });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setCurrentProgress(null);
  };

  const handleAddProgress = () => {
    form
      .validateFields()
      .then((values) => {
        // Create a new progress entry
        const newProgress = {
          id: Date.now(), // Generate a unique ID
          step: values.step,
          time: values.time ? values.time.format("YYYY-MM-DD") : "",
          status: values.status,
          note: values.note,
        };

        // Update state with the new progress entry
        setProgressData({
          ...progressData,
          [selectedPatient]: [
            ...(progressData[selectedPatient] || []),
            newProgress,
          ],
        });

        message.success("Tiến độ điều trị đã được thêm thành công!");
        setIsAddModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEditProgress = () => {
    form
      .validateFields()
      .then((values) => {
        // Update the existing progress entry
        const updatedProgress = progressData[selectedPatient].map((p) =>
          p.id === currentProgress.id
            ? {
                ...p,
                step: values.step,
                time: values.time ? values.time.format("YYYY-MM-DD") : "",
                status: values.status,
                note: values.note,
              }
            : p
        );

        // Update state with the modified progress entry
        setProgressData({
          ...progressData,
          [selectedPatient]: updatedProgress,
        });

        message.success("Tiến độ điều trị đã được cập nhật thành công!");
        setIsEditModalVisible(false);
        setCurrentProgress(null);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDeleteProgress = (progressId) => {
    // Filter out the progress entry to be deleted
    const updatedProgress = progressData[selectedPatient].filter(
      (p) => p.id !== progressId
    );

    // Update state without the deleted progress entry
    setProgressData({
      ...progressData,
      [selectedPatient]: updatedProgress,
    });

    message.success("Tiến độ điều trị đã được xóa thành công!");
  };

  // Create a custom timeline component that renders the timeline horizontally
  const HorizontalTimeline = ({ steps }) => (
    <div className="horizontal-timeline">
      <div className="timeline-steps">
        {steps.map((step, index) => (
          <div className={`timeline-step status-${step.status}`} key={index}>
            <div className="timeline-marker">
              {step.status === "done" && (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              )}
              {step.status === "doing" && (
                <ClockCircleTwoTone twoToneColor="#1890ff" />
              )}
              {step.status === "pending" && (
                <MinusCircleTwoTone twoToneColor="#999" />
              )}
            </div>
            <div className="timeline-content">
              <h4>{step.step}</h4>
              {step.time && (
                <div className="timeline-date">
                  {dayjs(step.time).format("DD/MM/YYYY")}
                </div>
              )}
              <div className="timeline-status">
                {step.status === "done" && <>Hoàn thành {statusIcon.done}</>}
                {step.status === "doing" && (
                  <>Đang thực hiện {statusIcon.doing}</>
                )}
                {step.status === "pending" && (
                  <>Chưa thực hiện {statusIcon.pending}</>
                )}
              </div>
              {step.note && (
                <div className="timeline-note">Ghi chú: {step.note}</div>
              )}
              <div className="timeline-actions">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => showEditModal(step)}
                >
                  Sửa
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteProgress(step.id)}
                  style={{ marginLeft: 8 }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="horizontal-timeline-container">
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Tiến trình điều trị hiếm muộn
      </h2>
      <div
        className="patient-selector"
        style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}
      >
        <Select
          placeholder="Chọn bệnh nhân/cặp đôi"
          value={selectedPatient}
          style={{ width: 280, marginBottom: 16 }}
          onChange={(val) => setSelectedPatient(val)}
        >
          {patientsList.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.name}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          style={{ marginLeft: "16px" }}
        >
          Thêm tiến độ điều trị hiếm muộn
        </Button>
      </div>
      <AntdProgress
        percent={percent}
        status={globalStatus === "Hoàn thành" ? "success" : "active"}
        format={(p) => `${globalStatus} – ${p}%`}
        style={{ marginBottom: 24 }}
      />{" "}
      <Card
        title={`Tiến trình điều trị hiếm muộn của ${patient?.name}`}
        className="progress-card"
        style={{ maxHeight: "100%", overflowY: "auto" }}
      >
        {currentSteps.length === 0 ? (
          <Empty description="Chưa có tiến trình điều trị" />
        ) : (
          <HorizontalTimeline steps={currentSteps} />
        )}
      </Card>
      {/* Add Progress Modal */}{" "}
      <Modal
        title="Thêm tiến độ điều trị hiếm muộn mới"
        open={isAddModalVisible}
        onOk={handleAddProgress}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="step"
            label="Bước điều trị hiếm muộn"
            rules={[{ required: true, message: "Vui lòng nhập bước điều trị" }]}
          >
            <Select placeholder="Chọn bước điều trị">
              <Option value="Khám tổng quát">Khám tổng quát</Option>
              <Option value="Xét nghiệm hormone">Xét nghiệm hormone</Option>
              <Option value="Siêu âm buồng trứng">Siêu âm buồng trứng</Option>
              <Option value="Xét nghiệm tinh trùng">
                Xét nghiệm tinh trùng
              </Option>
              <Option value="Kích thích buồng trứng">
                Kích thích buồng trứng
              </Option>
              <Option value="Theo dõi phát triển nang noãn">
                Theo dõi phát triển nang noãn
              </Option>
              <Option value="Thu hoạch trứng">Thu hoạch trứng</Option>
              <Option value="Thụ tinh trong ống nghiệm">
                Thụ tinh trong ống nghiệm
              </Option>
              <Option value="Nuôi cấy phôi">Nuôi cấy phôi</Option>
              <Option value="Chuyển phôi">Chuyển phôi</Option>
              <Option value="Thụ tinh nhân tạo IUI">
                Thụ tinh nhân tạo IUI
              </Option>
              <Option value="Chuẩn bị IUI">Chuẩn bị IUI</Option>
              <Option value="Thực hiện IUI">Thực hiện IUI</Option>
              <Option value="Xét nghiệm thai">Xét nghiệm thai</Option>
              <Option value="Theo dõi thai kỳ">Theo dõi thai kỳ</Option>
              <Option value="Tư vấn phương pháp điều trị">
                Tư vấn phương pháp điều trị
              </Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            label="Ngày thực hiện"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="done">Hoàn thành</Option>
              <Option value="doing">Đang thực hiện</Option>
              <Option value="pending">Chưa thực hiện</Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú và kết quả">
            <TextArea rows={3} placeholder="Nhập kết quả và ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>{" "}
      {/* Edit Progress Modal */}
      <Modal
        title="Chỉnh sửa tiến độ điều trị hiếm muộn"
        open={isEditModalVisible}
        onOk={handleEditProgress}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="step"
            label="Bước điều trị hiếm muộn"
            rules={[{ required: true, message: "Vui lòng nhập bước điều trị" }]}
          >
            <Select placeholder="Chọn bước điều trị">
              <Option value="Khám tổng quát">Khám tổng quát</Option>
              <Option value="Xét nghiệm hormone">Xét nghiệm hormone</Option>
              <Option value="Siêu âm buồng trứng">Siêu âm buồng trứng</Option>
              <Option value="Xét nghiệm tinh trùng">
                Xét nghiệm tinh trùng
              </Option>
              <Option value="Kích thích buồng trứng">
                Kích thích buồng trứng
              </Option>
              <Option value="Theo dõi phát triển nang noãn">
                Theo dõi phát triển nang noãn
              </Option>
              <Option value="Thu hoạch trứng">Thu hoạch trứng</Option>
              <Option value="Thụ tinh trong ống nghiệm">
                Thụ tinh trong ống nghiệm
              </Option>
              <Option value="Nuôi cấy phôi">Nuôi cấy phôi</Option>
              <Option value="Chuyển phôi">Chuyển phôi</Option>
              <Option value="Thụ tinh nhân tạo IUI">
                Thụ tinh nhân tạo IUI
              </Option>
              <Option value="Chuẩn bị IUI">Chuẩn bị IUI</Option>
              <Option value="Thực hiện IUI">Thực hiện IUI</Option>
              <Option value="Xét nghiệm thai">Xét nghiệm thai</Option>
              <Option value="Theo dõi thai kỳ">Theo dõi thai kỳ</Option>
              <Option value="Tư vấn phương pháp điều trị">
                Tư vấn phương pháp điều trị
              </Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            label="Ngày thực hiện"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="done">Hoàn thành</Option>
              <Option value="doing">Đang thực hiện</Option>
              <Option value="pending">Chưa thực hiện</Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú và kết quả">
            <TextArea rows={3} placeholder="Nhập kết quả và ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const TreatmentProgressPage = () => {
  // Use the PatientTimeline component for the main view
  return (
    <div className="treatment-progress-container">
      <PatientTimeline />
    </div>
  );
};

// This is the original TreatmentProgressPage implementation kept for reference
const TreatmentProgressTablePage = () => {
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
        // setPatients(response.data);        // Mock data
        setPatients([
          {
            id: 1,
            patientId: "P001",
            name: "Nguyen Van A và Nguyen Thi H",
            age: 35,
            condition: "Thụ tinh trong ống nghiệm (IVF)",
            startDate: "2025-03-15",
            estimatedEndDate: "2025-06-15",
            status: "in-progress",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-20",
          },
          {
            id: 2,
            patientId: "P002",
            name: "Tran Thi B",
            age: 28,
            condition: "Hỗ trợ sinh sản IUI",
            startDate: "2025-04-10",
            estimatedEndDate: "2025-05-30",
            status: "in-progress",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-22",
          },
          {
            id: 3,
            patientId: "P003",
            name: "Le Van C và Pham Thi D",
            age: 42,
            condition: "Điều trị vô sinh nam",
            startDate: "2025-01-05",
            estimatedEndDate: "2025-07-05",
            status: "in-progress",
            doctor: "Dr. Tran Minh",
            lastUpdate: "2025-05-15",
          },
          {
            id: 4,
            patientId: "P004",
            name: "Pham Thi D",
            age: 38,
            condition: "Điều trị nội tiết và kích thích buồng trứng",
            startDate: "2025-04-25",
            estimatedEndDate: "2025-06-25",
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
        setIsAddModalVisible(false); // Refresh patient list (mock implementation)
        const newPatient = {
          id: patients.length + 1,
          patientId: values.patientId,
          name: values.name,
          age: values.age,
          condition: values.condition,
          startDate: values.startDate.format("YYYY-MM-DD"),
          estimatedEndDate: values.estimatedEndDate.format("YYYY-MM-DD"),
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

        message.success("Treatment status updated successfully!");
        updateForm.resetFields();
        setIsUpdateModalVisible(false);

        // Update patient list (mock implementation)
        const updatedPatients = patients.map((patient) => {
          if (patient.id === currentPatient.id) {
            return {
              ...patient,
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
    // axios.get(`/api/treatment-history/${patientId}`)    // Mock treatment history data
    setTreatmentHistory([
      {
        id: 1,
        date: "2025-03-15",
        status: "new",
        notes: "Initial examination. Treatment plan created.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-03-22",
      },
      {
        id: 2,
        date: "2025-03-22",
        status: "in-progress",
        notes: "First treatment session completed. Patient responding well.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-04-05",
      },
      {
        id: 3,
        date: "2025-04-05",
        status: "in-progress",
        notes: "Second treatment session. Minor complications resolved.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-04-19",
      },
      {
        id: 4,
        date: "2025-04-19",
        status: "in-progress",
        notes: "Progress is as expected. Continuing with treatment plan.",
        doctor: "Dr. Tran Minh",
        nextAppointment: "2025-05-03",
      },
      {
        id: 5,
        date: "2025-05-03",
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
        <Title level={2}>Treatment Progress</Title>
        <Space size="middle">
          <Input
            placeholder="Search patients"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add New Patient
          </Button>
        </Space>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="treatment-table">
          <Table
            dataSource={filteredPatients}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No patients found" }}
          />
        </div>
      )}

      {/* Patient view modal with tabs */}
      <Modal
        title="Patient Treatment Details"
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
                  </Col>{" "}
                </Row>
                <Card title="Treatment Information" className="progress-card">
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
                        {" "}
                        <p>
                          <strong>Date:</strong> {record.date}
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

      {/* Add Patient Modal */}
      <Modal
        title="Add New Patient Treatment"
        open={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleCancel}
        width={600}
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
        width={600}
      >
        {currentPatient && (
          <Form form={updateForm} layout="vertical">
            {" "}
            <div className="patient-update-info">
              <p>
                <strong>Patient:</strong> {currentPatient.name} (
                {currentPatient.patientId})
              </p>
              <p>
                <strong>Condition:</strong> {currentPatient.condition}
              </p>
            </div>
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
