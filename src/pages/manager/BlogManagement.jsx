import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Upload, Space, Statistic, Row, Col, message } from 'antd';
import { PlusOutlined, SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../../services/blogService';

const { Option } = Select;
const { TextArea } = Input;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [stats, setStats] = useState({ total: 0, published: 0 });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        setBlogs(data);
        setStats({
          total: data.length,
          published: data.filter(b => b.status === 'published').length
        });
      } catch (error) {
        message.error('Không thể tải danh sách bài viết');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || blog.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveBlog = async (values) => {
    try {
      const blogData = {
        ...values,
        coverImage: values.coverImage?.fileList?.[0]?.thumbUrl || (currentBlog?.coverImage || 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png'),
        status: 'published'
      };

      if (currentBlog) {
        const updatedBlog = await updateBlog(currentBlog.id || currentBlog.key, blogData);
        setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
        message.success('Bài viết đã được cập nhật thành công!');
      } else {
        const newBlog = await createBlog(blogData);
        setBlogs([...blogs, newBlog]);
        message.success('Bài viết đã được tạo thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setCurrentBlog(null);
    } catch (error) {
      message.error('Không thể lưu bài viết');
    }
  };

  const handlePreviewBlog = (blog) => {
    setPreviewBlog(blog);
    setPreviewVisible(true);
  };

  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    form.setFieldsValue({
      ...blog,
      coverImage: blog.coverImage
    });
    setIsModalVisible(true);
  };

  const handleDeleteBlog = (id) => {
    Modal.confirm({
      title: 'Xác Nhận Xóa',
      content: 'Bạn có chắc chắn muốn xóa bài viết này không?',
      okText: 'Xóa',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteBlog(id);
          setBlogs(blogs.filter(blog => (blog.id || blog.key) !== id));
          message.success('Bài viết đã được xóa thành công!');
        } catch (error) {
          message.error('Không thể xóa bài viết');
        }
      },
    });
  };

  const handleBulkAction = async (action) => {
    try {
      if (action === 'delete') {
        await Promise.all(selectedRowKeys.map(id => deleteBlog(id)));
        setBlogs(blogs.filter(blog => !selectedRowKeys.includes(blog.id || blog.key)));
        message.success('Các bài viết được chọn đã được xóa thành công!');
      }
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('Không thể thực hiện hành động hàng loạt');
    }
  };

  const columns = [
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Button type="link" onClick={() => handlePreviewBlog(record)} style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Mô Tả',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
        <div style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Tác Giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => handleEditBlog(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteBlog(record.id || record.key)} />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="blog-management" style={{ padding: '24px' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Statistic title="Tổng Số Bài Viết" value={stats.total} />
        </Col>
        <Col span={12}>
          <Statistic title="Đã Xuất Bản" value={stats.published} />
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm theo tiêu đề hoặc tác giả"
              onSearch={setSearchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Lọc theo danh mục"
              style={{ width: 150 }}
              allowClear
              onChange={setCategoryFilter}
            >
              <Option value="IVF">IVF</Option>
              <Option value="IUI">IUI</Option>
              <Option value="Nutrition">Dinh Dưỡng</Option>
              <Option value="Tips">Mẹo</Option>
              <Option value="Success Stories">Câu Chuyện Thành Công</Option>
            </Select>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentBlog(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Thêm Bài Viết
            </Button>
          </Space>
        </Space>

        {selectedRowKeys.length > 0 && (
          <Space style={{ marginBottom: 16 }}>
            <Button danger onClick={() => handleBulkAction('delete')}>
              Xóa Đã Chọn
            </Button>
          </Space>
        )}

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>

      <Modal
        title={currentBlog ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentBlog(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveBlog}
          initialValues={{ status: 'published' }}
        >
          <Form.Item
            name="title"
            label="Tiêu Đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội Dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết' }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh Mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select>
              <Option value="IVF">IVF</Option>
              <Option value="IUI">IUI</Option>
              <Option value="Nutrition">Dinh Dưỡng</Option>
              <Option value="Tips">Mẹo</Option>
              <Option value="Success Stories">Câu Chuyện Thành Công</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="author"
            label="Tác Giả"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="coverImage"
            label="Ảnh Bìa"
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              accept=".png,.jpg,.jpeg"
            >
              <Button icon={<UploadOutlined />}>Tải Lên</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={previewBlog?.title}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewBlog && (
          <div>
            <img src={previewBlog.coverImage} alt={previewBlog.title} style={{ width: '100%', marginBottom: 16 }} />
            <p><strong>Danh Mục:</strong> {previewBlog.category}</p>
            <p><strong>Tác Giả:</strong> {previewBlog.author}</p>
            <p><strong>Ngày Tạo:</strong> {previewBlog.createdAt}</p>
            <p>{previewBlog.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogManagement;