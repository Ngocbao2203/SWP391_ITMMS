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
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import axios from "axios";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const MedicalRecords = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [form] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Replace with your API endpoint
        // const response = await axios.get('/api/patients');
        // setPatients(response.data);

        // Mock data
        setPatients([
          {
            id: 1,
            name: "Nguyễn Thị A",
            age: 32,
            gender: "Nữ",
            phone: "0901234567",
            email: "nguyen.a@example.com",
            status: "Đang điều trị",
            treatmentType: "IVF",
            lastVisit: "2025-05-15",
            nextVisit: "2025-06-10",
          },
          {
            id: 2,
            name: "Trần Văn B",
            age: 35,
            gender: "Nam",
            phone: "0912345678",
            email: "tran.b@example.com",
            status: "Mới",
            treatmentType: "IUI",
            lastVisit: "2025-05-20",
            nextVisit: "2025-05-30",
          },
          {
            id: 3,
            name: "Lê Thị C",
            age: 29,
            gender: "Nữ",
            phone: "0923456789",
            email: "le.c@example.com",
            status: "Theo dõi",
            treatmentType: "Thuốc kích trứng",
            lastVisit: "2025-05-10",
            nextVisit: "2025-06-05",
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        message.error("Không thể tải dữ liệu bệnh nhân");
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
      patient.phone.includes(searchText) ||
      patient.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewPatient = (patient) => {
    setCurrentPatient(patient);
    setIsViewModalVisible(true);
  };

  const handleAddPatient = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleAddSubmit = async (values) => {
    try {
      // Format dates for API
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      };

      // Replace with your API endpoint
      // await axios.post('/api/patients', formattedValues);

      // For demo purposes
      const newPatient = {
        id: patients.length + 1,
        name: values.name,
        age: values.age,
        gender: values.gender,
        phone: values.phone,
        email: values.email,
        status: "Mới",
        treatmentType: values.treatmentType,
        lastVisit: dayjs().format("YYYY-MM-DD"),
        nextVisit: values.nextVisit?.format("YYYY-MM-DD"),
      };

      setPatients([...patients, newPatient]);
      setIsAddModalVisible(false);
      message.success("Thêm bệnh nhân thành công");
    } catch (error) {
      console.error("Error adding patient:", error);
      message.error("Không thể thêm bệnh nhân");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Mới":
        return "blue";
      case "Đang điều trị":
        return "processing";
      case "Theo dõi":
        return "warning";
      case "Hoàn thành":
        return "success";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
      width: 80,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        { text: "Nam", value: "Nam" },
        { text: "Nữ", value: "Nữ" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Phương pháp điều trị",
      dataIndex: "treatmentType",
      key: "treatmentType",
      filters: [
        { text: "IVF", value: "IVF" },
        { text: "IUI", value: "IUI" },
        { text: "Thuốc kích trứng", value: "Thuốc kích trứng" },
      ],
      onFilter: (value, record) => record.treatmentType === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Mới", value: "Mới" },
        { text: "Đang điều trị", value: "Đang điều trị" },
        { text: "Theo dõi", value: "Theo dõi" },
        { text: "Hoàn thành", value: "Hoàn thành" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Lần khám gần nhất",
      dataIndex: "lastVisit",
      key: "lastVisit",
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: "Lịch hẹn tiếp theo",
      dataIndex: "nextVisit",
      key: "nextVisit",
      sorter: (a, b) => new Date(a.nextVisit) - new Date(b.nextVisit),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem hồ sơ">
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => handleViewPatient(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật hồ sơ">
            <Button
              icon={<EditOutlined />}
              onClick={() => message.info("Chức năng đang phát triển")}
            />
          </Tooltip>
          <Tooltip title="Lịch sử điều trị">
            <Button
              icon={<HistoryOutlined />}
              onClick={() => message.info("Chức năng đang phát triển")}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="medical-records-container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0 }}>Hồ Sơ Bệnh Nhân</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddPatient}
        >
          Thêm bệnh nhân
        </Button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên, số điện thoại hoặc email"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Tabs defaultActiveKey="all">
        <TabPane tab="Tất cả bệnh nhân" key="all">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredPatients}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng ${total} bệnh nhân`,
              }}
            />
          </Spin>
        </TabPane>
        <TabPane tab="Đang điều trị" key="active">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredPatients.filter(
                (p) => p.status === "Đang điều trị"
              )}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Spin>
        </TabPane>
        <TabPane tab="Bệnh nhân mới" key="new">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredPatients.filter((p) => p.status === "Mới")}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Spin>
        </TabPane>
        <TabPane tab="Theo dõi" key="followup">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredPatients.filter(
                (p) => p.status === "Theo dõi"
              )}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Spin>
        </TabPane>
      </Tabs>

      {/* View Patient Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <MedicineBoxOutlined
              style={{ marginRight: "8px", color: "#1890ff" }}
            />
            Chi tiết hồ sơ bệnh nhân
          </div>
        }
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setIsViewModalVisible(false);
              message.info("Chức năng cập nhật đang phát triển");
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
      >
        {currentPatient && (
          <Tabs defaultActiveKey="info">
            <TabPane tab="Thông tin cá nhân" key="info">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <p>
                    <strong>Họ và tên:</strong> {currentPatient.name}
                  </p>
                  <p>
                    <strong>Tuổi:</strong> {currentPatient.age}
                  </p>
                  <p>
                    <strong>Giới tính:</strong> {currentPatient.gender}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {currentPatient.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {currentPatient.email}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    <Tag color={getStatusColor(currentPatient.status)}>
                      {currentPatient.status}
                    </Tag>
                  </p>
                  <p>
                    <strong>Phương pháp điều trị:</strong>{" "}
                    {currentPatient.treatmentType}
                  </p>
                  <p>
                    <strong>Ngày khám gần nhất:</strong>{" "}
                    {currentPatient.lastVisit}
                  </p>
                  <p>
                    <strong>Lịch hẹn tiếp theo:</strong>{" "}
                    {currentPatient.nextVisit}
                  </p>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Lịch sử khám bệnh" key="history">
              <p>Dữ liệu lịch sử khám bệnh sẽ được hiển thị tại đây</p>
            </TabPane>
            <TabPane tab="Kết quả xét nghiệm" key="results">
              <p>Kết quả xét nghiệm sẽ được hiển thị tại đây</p>
            </TabPane>
            <TabPane tab="Tiến trình điều trị" key="treatment">
              <p>Thông tin phác đồ điều trị sẽ được hiển thị tại đây</p>
            </TabPane>
            <TabPane tab="Ghi chú" key="notes">
              <p>Các ghi chú của bác sĩ sẽ được hiển thị tại đây</p>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Add Patient Modal */}
      <Modal
        title="Thêm bệnh nhân mới"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên bệnh nhân" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="age"
              label="Tuổi"
              rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>

            <Form.Item name="occupation" label="Nghề nghiệp">
              <Input />
            </Form.Item>

            <Form.Item
              name="treatmentType"
              label="Phương pháp điều trị"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phương pháp điều trị",
                },
              ]}
            >
              <Select>
                <Option value="IVF">IVF (Thụ tinh trong ống nghiệm)</Option>
                <Option value="IUI">
                  IUI (Bơm tinh trùng vào buồng tử cung)
                </Option>
                <Option value="Thuốc kích trứng">Thuốc kích trứng</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item name="nextVisit" label="Lịch hẹn tiếp theo">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <Form.Item name="medicalHistory" label="Tiền sử bệnh lý">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="initialDiagnosis" label="Chẩn đoán ban đầu">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            style={{ textAlign: "right", marginBottom: 0, marginTop: "20px" }}
          >
            <Space>
              <Button onClick={() => setIsAddModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Thêm bệnh nhân
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalRecords;
