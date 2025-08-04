import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Card,
  Typography,
  Tag,
  Tooltip,
  Row,
  Col,
  Statistic,
  Divider,
  Upload,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  FileTextOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import treatmentService from '../../services/treatmentService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title, Text } = Typography;

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const response = await treatmentService.getAllTreatmentServices();
      if (response.data && Array.isArray(response.data)) {
        const formattedServices = response.data.map((service, index) => ({
          id: service.id || (index + 1).toString().padStart(2, '0'),
          key: service.id ? service.id.toString() : (index + 1).toString(),
          serviceName: service.serviceName || '',
          serviceCode: service.serviceCode || '',
          description: service.description || '',
          basePrice: service.basePrice || 0,
          procedures: service.procedures || '',
          requirements: service.requirements || '',
          durationDays: service.durationDays || 0,
          successRate: service.successRate || 0,
          imageUrl: service.imageUrl || '', // Đảm bảo imageUrl được lấy từ API
          imageFile: service.imageFile || '',
        }));
        setServices(formattedServices);
        safeToast('success', 'Tải danh sách dịch vụ thành công!');
      } else {
        safeToast('error', 'Không có dữ liệu từ server!');
      }
    } catch (error) {
      console.error('Fetch Services Error:', error);
      safeToast('error', 'Lỗi khi tải danh sách dịch vụ: ' + (error.message || 'Không xác định'));
    } finally {
      setLoading(false);
    }
  }

  const safeToast = (type, message) => {
    if (document.getElementById('toast-container')) {
      toast[type](message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    if (service) {
      form.setFieldsValue({
        serviceName: service.serviceName,
        serviceCode: service.serviceCode,
        description: service.description,
        basePrice: service.basePrice,
        procedures: service.procedures,
        requirements: service.requirements,
        durationDays: service.durationDays,
        successRate: service.successRate,
        imageUrl: service.imageUrl,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append('serviceName', values.serviceName);
      formData.append('serviceCode', values.serviceCode);
      formData.append('description', values.description);
      formData.append('basePrice', values.basePrice);
      formData.append('procedures', values.procedures);
      formData.append('requirements', values.requirements);
      formData.append('durationDays', values.durationDays);
      formData.append('successRate', values.successRate);
      formData.append('imageUrl', values.imageUrl || '');
      if (values.imageFile && values.imageFile.originFileObj) {
        formData.append('imageFile', values.imageFile.originFileObj);
      }

      if (editingService) {
        const response = await treatmentService.updateTreatmentService(editingService.id, formData);
        if (response.success) {
          // Gọi lại fetchServices để đồng bộ dữ liệu từ server
          await fetchServices();
          safeToast('success', response.message || 'Cập nhật dịch vụ thành công!');
        } else {
          safeToast('error', response.message || 'Cập nhật dịch vụ thất bại!');
        }
      } else {
        const response = await treatmentService.createTreatmentService(formData);
        if (response.success && response.data) {
          // Gọi lại fetchServices để đồng bộ dữ liệu từ server
          await fetchServices();
          safeToast('success', response.message || 'Thêm dịch vụ thành công!');
        } else {
          safeToast('error', response.message || 'Tạo dịch vụ thất bại!');
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingService(null);
      setLoading(false);
    } catch (error) {
      safeToast('error', 'Lỗi khi lưu dịch vụ: ' + (error.message || 'Không xác định'));
      console.error(error);
      setLoading(false);
    }
  };

  const handleDeleteService = async (key) => {
    const service = services.find((s) => s.key === key);
    try {
      setLoading(true);
      const response = await treatmentService.deleteTreatmentService(service.id);
      if (response.success) {
        setServices((prev) => prev.filter((s) => s.key !== key));
        safeToast('success', response.message || 'Xóa dịch vụ thành công!');
      } else {
        safeToast('error', response.message || 'Xóa dịch vụ thất bại!');
      }
      setLoading(false);
    } catch (error) {
      safeToast('error', 'Lỗi khi xóa dịch vụ: ' + (error.message || 'Không xác định'));
      setLoading(false);
    }
  };

  const totalServices = services.length;
  const avgPrice = services.length > 0
    ? Math.round(services.reduce((sum, s) => sum + s.basePrice, 0) / services.length)
    : 0;
  const avgSuccessRate = services.length > 0
    ? Math.round(services.reduce((sum, s) => sum + s.successRate, 0) / services.length)
    : 0;

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
      title: 'Hình Ảnh',
      key: 'imageUrl',
      render: (_, record) => (
        record.imageUrl && record.imageUrl.trim() ? (
          <img src={record.imageUrl} alt={record.serviceName} style={{ width: '50px', height: '50px' }} onError={(e) => { e.target.style.display = 'none'; console.log('Image load failed for:', record.imageUrl); }} />
        ) : (
          <Text type="secondary">Chưa có hình ảnh</Text>
        )
      ),
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
      width: 150,
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
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '12px',
                height: '32px',
                background: '#1890ff',
                borderColor: '#1890ff',
                boxShadow: '0 2px 6px rgba(24, 144, 255, 0.3)',
                transition: 'all 0.3s',
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
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  height: '32px',
                  background: '#ff4d4f',
                  borderColor: '#ff4d4f',
                  boxShadow: '0 2px 6px rgba(255, 77, 79, 0.3)',
                  transition: 'all 0.3s',
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <ToastContainer />
      <Card
        style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
              boxShadow: '0 4px 12px rgba(24,144,255,0.3)',
            }}
          >
            Thêm Dịch Vụ Mới
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={8}>
            <Card size="small" style={{ borderRadius: '8px', background: '#e6f7ff' }}>
              <Statistic
                title="Tổng Dịch Vụ"
                value={totalServices}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8}>
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
          <Col xs={12} sm={8}>
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

      <Card
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Table
          columns={columns}
          dataSource={services}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} dịch vụ`,
          }}
          rowKey="key"
          loading={loading}
          size="middle"
          style={{ borderRadius: '8px' }}
          rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: '600' }}>
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
            fontWeight: '500',
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '6px',
            height: '40px',
            paddingLeft: '24px',
            paddingRight: '24px',
            fontSize: '14px',
          },
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="imageUrl"
                label={<Text strong>URL Hình Ảnh</Text>}
                rules={[{ required: false, message: 'Vui lòng nhập URL hình ảnh!' }]}
              >
                <Input
                  placeholder="Nhập URL hình ảnh (tùy chọn)"
                  style={{ borderRadius: '6px', height: '40px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="imageFile"
                label={<Text strong>Tệp Hình Ảnh</Text>}
                valuePropName="file"
                getValueFromEvent={(e) => {
                  return e && e.fileList && e.fileList.length > 0 ? e.fileList[0] : null;
                }}
                rules={[{ required: false, message: 'Vui lòng tải lên tệp hình ảnh!' }]}
              >
                <Upload
                  name="imageFile"
                  beforeUpload={() => false} // Ngăn upload tự động
                  maxCount={1} // Chỉ cho phép 1 file
                  onChange={(info) => {
                    if (info.file.status === 'removed') {
                      form.setFieldsValue({ imageFile: null }); // Reset khi xóa file
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Chọn file ảnh</Button>
                </Upload>
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