// Quản lý dịch vụ điều trị cho admin/manager
// Sử dụng Ant Design cho UI, quản lý state bằng React hook
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Switch,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
  Card,
  Typography,
  Tag,
  Tooltip,
  Row,
  Col,
  Statistic,
  Divider,
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import treatmentService from '../../services/treatmentService';

const { Title, Text } = Typography;

// Component chính quản lý dịch vụ
const Services = () => {
  // State lưu trữ danh sách dịch vụ, modal, form, loading, v.v.
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [isModalOpen, setIsModalOpen] = useState(false); // Hiển thị modal thêm/sửa
  const [editingService, setEditingService] = useState(null); // Dịch vụ đang chỉnh sửa
  const [form] = Form.useForm(); // Form cho modal
  const [loading, setLoading] = useState(false); // Đang tải dữ liệu

  // Tải danh sách dịch vụ khi component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Gọi API lấy danh sách dịch vụ điều trị
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await treatmentService.getAllTreatmentServices();
      // Định dạng lại dữ liệu dịch vụ để hiển thị
      const formattedServices = response.data.map((service, index) => {
        return {
          id: service.id || (index + 1).toString().padStart(2, '0'),
          key: service.id ? service.id.toString() : (index + 1).toString(),
          serviceName: service.serviceName,
          serviceCode: service.serviceCode,
          description: service.description,
          basePrice: service.basePrice,
          procedures: service.procedures,
          requirements: service.requirements,
          durationDays: service.durationDays,
          successRate: service.successRate,
          isActive: service.isActive || true,
        };
      });
      setServices(formattedServices);
      setLoading(false);
    } catch (error) {
      console.error('Fetch Services Error:', error);
      message.error('Lỗi khi tải danh sách dịch vụ');
      setLoading(false);
    }
  };

  // Mở modal thêm mới hoặc chỉnh sửa dịch vụ
  const handleOpenModal = (service = null) => {
    setEditingService(service);
    if (service) {
      // Nếu chỉnh sửa, set giá trị form theo dịch vụ đang chọn
      form.setFieldsValue({
        serviceName: service.serviceName,
        serviceCode: service.serviceCode,
        description: service.description,
        basePrice: service.basePrice,
        procedures: service.procedures,
        requirements: service.requirements,
        durationDays: service.durationDays,
        successRate: service.successRate,
      });
    } else {
      // Nếu thêm mới, reset form
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Xử lý submit form thêm/sửa dịch vụ
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        serviceName: values.serviceName,
        serviceCode: values.serviceCode,
        description: values.description,
        basePrice: values.basePrice,
        procedures: values.procedures,
        requirements: values.requirements,
        durationDays: values.durationDays,
        successRate: values.successRate,
      };

      if (editingService) {
        // Nếu đang chỉnh sửa, gọi API update
        const response = await treatmentService.updateTreatmentService(editingService.id, payload);
        if (response.success) {
          setServices((prev) =>
            prev.map((s) =>
              s.key === editingService.key ? { ...s, ...payload, isActive: s.isActive } : s
            )
          );
          message.success(response.message);
        } else {
          message.error(response.message);
        }
      } else {
        // Nếu thêm mới, gọi API create
        const response = await treatmentService.createTreatmentService(payload);
        if (response.success && response.data) {
          const newService = {
            ...payload,
            id: response.data.id ? response.data.id.toString().padStart(2, '0') : (services.length + 1).toString().padStart(2, '0'),
            key: response.data.id ? response.data.id.toString() : (services.length + 1).toString(),
            isActive: true,
          };
          setServices([...services, newService]);
          message.success(response.message);
        } else {
          message.error(response.message || 'Tạo dịch vụ thất bại');
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingService(null);
      setLoading(false);
    } catch (error) {
      message.error('Lỗi khi lưu dịch vụ: ' + error.message);
      console.error(error);
      setLoading(false);
    }
  };

  // Bật/tắt trạng thái hoạt động của dịch vụ
  const handleToggleStatus = async (key) => {
    const service = services.find((s) => s.key === key);
    const updatedStatus = !service.isActive;
    try {
      setLoading(true);
      const response = await treatmentService.updateTreatmentService(service.id, {
        ...service,
        isActive: updatedStatus,
      });
      if (response.success) {
        setServices((prev) =>
          prev.map((s) => (s.key === key ? { ...s, isActive: updatedStatus } : s))
        );
        message.success('Cập nhật trạng thái thành công');
      } else {
        message.error(response.message);
      }
      setLoading(false);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
      setLoading(false);
    }
  };

  // Xóa dịch vụ
  const handleDeleteService = async (key) => {
    const service = services.find((s) => s.key === key);
    try {
      setLoading(true);
      const response = await treatmentService.deleteTreatmentService(service.id);
      if (response.success) {
        setServices((prev) => prev.filter((s) => s.key !== key));
        message.success(response.message);
      } else {
        message.error(response.message);
      }
      setLoading(false);
    } catch (error) {
      message.error('Lỗi khi xóa dịch vụ');
      setLoading(false);
    }
  };

  // Tính toán thống kê dịch vụ
  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const avgPrice = services.length > 0 ? 
    Math.round(services.reduce((sum, s) => sum + s.basePrice, 0) / services.length) : 0;
  const avgSuccessRate = services.length > 0 ? 
    Math.round(services.reduce((sum, s) => sum + s.successRate, 0) / services.length) : 0;

  // Định nghĩa các cột cho bảng dịch vụ
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {id}
        </Tag>
      ),
      responsive: ['md'],
    },
    {
      title: 'Tên Dịch Vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text, record) => (
        <div>
          <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
            {text}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.serviceCode}
          </Text>
        </div>
      ),
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Text style={{ fontSize: '13px' }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (status, record) => (
        <div style={{ textAlign: 'center' }}>
          <Switch
            checked={status}
            onChange={() => handleToggleStatus(record.key)}
            disabled={loading}
            size="small"
          />
          <br />
          <Text 
            style={{ 
              fontSize: '11px', 
              color: status ? '#52c41a' : '#ff4d4f',
              fontWeight: '500'
            }}
          >
            {status ? 'Hoạt động' : 'Tạm dừng'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Thông Tin Chi Tiết',
      key: 'details',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarOutlined style={{ color: '#52c41a' }} />
            <Text style={{ fontSize: '13px', fontWeight: '500' }}>
              {record.basePrice.toLocaleString()} VNĐ
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClockCircleOutlined style={{ color: '#1890ff' }} />
            <Text style={{ fontSize: '13px' }}>{record.durationDays} ngày</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PercentageOutlined style={{ color: '#faad14' }} />
            <Text style={{ fontSize: '13px' }}>{record.successRate}% thành công</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              disabled={loading}
              style={{ 
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(24,144,255,0.2)'
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => handleDeleteService(record.key)}
            okText="Xóa"
            cancelText="Hủy"
            disabled={loading}
          >
            <Tooltip title="Xóa">
              <Button 
                danger 
                size="small"
                icon={<DeleteOutlined />} 
                disabled={loading}
                style={{ 
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(255,77,79,0.2)'
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Render giao diện quản lý dịch vụ
  return (
    <div style={{ 
      padding: '24px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Card header thống kê và nút thêm dịch vụ */}
      <Card 
        style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              <FileTextOutlined style={{ marginRight: '12px' }} />
              Quản Lý Dịch Vụ
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Quản lý các dịch vụ điều trị và chăm sóc sức khỏe
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => handleOpenModal()}
            icon={<PlusOutlined />}
            disabled={loading}
            style={{ 
              borderRadius: '8px',
              height: '48px',
              paddingLeft: '24px',
              paddingRight: '24px',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(24,144,255,0.3)'
            }}
          >
            Thêm Dịch Vụ Mới
          </Button>
        </div>

        {/* Thống kê tổng quan dịch vụ */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ borderRadius: '8px', background: '#e6f7ff' }}>
              <Statistic
                title="Tổng Dịch Vụ"
                value={totalServices}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ borderRadius: '8px', background: '#f6ffed' }}>
              <Statistic
                title="Đang Hoạt Động"
                value={activeServices}
                prefix={<PlusOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ borderRadius: '8px', background: '#fff7e6' }}>
              <Statistic
                title="Giá Trung Bình"
                value={avgPrice}
                suffix="VNĐ"
                prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ borderRadius: '8px', background: '#fff2e8' }}>
              <Statistic
                title="Tỷ Lệ TB"
                value={avgSuccessRate}
                suffix="%"
                prefix={<PercentageOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Card chứa bảng danh sách dịch vụ */}
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Table
          columns={columns}
          dataSource={services}
          pagination={{ 
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} dịch vụ`,
          }}
          rowKey="key"
          loading={loading}
          size="middle"
          style={{ borderRadius: '8px' }}
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </Card>

      {/* Modal thêm/sửa dịch vụ */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '18px',
            fontWeight: '600'
          }}>
            <FileTextOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            {editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
          </div>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingService(null);
          form.resetFields();
        }}
        okText={editingService ? 'Cập Nhật' : 'Thêm Mới'}
        cancelText="Hủy Bỏ"
        centered
        width={700}
        style={{ borderRadius: '12px' }}
        confirmLoading={loading}
        okButtonProps={{
          style: {
            borderRadius: '6px',
            height: '40px',
            paddingLeft: '24px',
            paddingRight: '24px',
            fontSize: '14px',
            fontWeight: '500'
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '6px',
            height: '40px',
            paddingLeft: '24px',
            paddingRight: '24px',
            fontSize: '14px'
          }
        }}
      >
        <Divider style={{ margin: '16px 0' }} />
        <Form form={form} layout="vertical" style={{ paddingTop: '8px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceName"
                label={<Text strong>Tên Dịch Vụ</Text>}
                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
              >
                <Input 
                  placeholder="Nhập tên dịch vụ"
                  style={{ borderRadius: '6px', height: '40px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serviceCode"
                label={<Text strong>Mã Dịch Vụ</Text>}
                rules={[{ required: true, message: 'Vui lòng nhập mã dịch vụ!' }]}
              >
                <Input 
                  placeholder="Nhập mã dịch vụ"
                  style={{ borderRadius: '6px', height: '40px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={<Text strong>Mô Tả</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập mô tả chi tiết về dịch vụ"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="basePrice"
                label={<Text strong>Giá Cơ Bản (VNĐ)</Text>}
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%', borderRadius: '6px', height: '40px' }}
                  placeholder="0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="durationDays"
                label={<Text strong>Thời Gian (Ngày)</Text>}
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%', borderRadius: '6px', height: '40px' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="successRate"
                label={<Text strong>Tỷ Lệ Thành Công (%)</Text>}
                rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ thành công!' }]}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  style={{ width: '100%', borderRadius: '6px', height: '40px' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="procedures"
            label={<Text strong>Quy Trình</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập quy trình!' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Mô tả quy trình thực hiện dịch vụ"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="requirements"
            label={<Text strong>Yêu Cầu</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập yêu cầu!' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Các yêu cầu cần thiết trước khi thực hiện"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Style cho bảng */}
      <style jsx>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
        .table-row-light:hover,
        .table-row-dark:hover {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default Services;
// Kết thúc file Services.jsx