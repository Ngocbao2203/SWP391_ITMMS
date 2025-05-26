import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Upload, Space, Divider, message } from 'antd';
import { PlusOutlined, SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../../services/blogService';
import '../../styles/BlogManagement.css';

const { Option } = Select;
const { TextArea } = Input;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);

  // Fetch blogs when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        message.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  // Lọc dữ liệu theo tìm kiếm
  const filteredBlogs = blogs.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase()) ||
      item.author.toLowerCase().includes(searchText.toLowerCase())
  );
  // Xử lý khi thêm/sửa blog
  const handleSaveBlog = async (values) => {
    try {
      if (currentBlog) {
        // Cập nhật blog
        const blogData = {
          ...values,
          coverImage: values.coverImage?.fileList?.[0]?.thumbUrl || values.coverImage || currentBlog.coverImage
        };
        
        const updatedBlog = await updateBlog(currentBlog.id || currentBlog.key, blogData);
        
        setBlogs(blogs.map(blog => 
          blog.id === updatedBlog.id || blog.key === updatedBlog.key ? updatedBlog : blog
        ));
        
        message.success('Cập nhật bài viết thành công!');
      } else {
        // Thêm blog mới
        const blogData = {
          ...values,
          coverImage: values.coverImage?.fileList?.[0]?.thumbUrl || 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png',
        };
        
        const newBlog = await createBlog(blogData);
        setBlogs([...blogs, newBlog]);
        
        message.success('Thêm bài viết mới thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setCurrentBlog(null);
    } catch (error) {
      console.error('Error saving blog:', error);
      message.error('Lỗi khi lưu bài viết. Vui lòng thử lại.');
    }
  };

  // Xử lý khi xóa blog
  const handleDeleteBlog = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài viết này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await deleteBlog(id);
          setBlogs(blogs.filter(blog => (blog.id || blog.key) !== id));
          message.success('Đã xóa bài viết!');
        } catch (error) {
          console.error('Error deleting blog:', error);
          message.error('Lỗi khi xóa bài viết. Vui lòng thử lại.');
        }
      }
    });
  };

  // Xử lý khi mở form để sửa blog
  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    form.setFieldsValue({
      ...blog,
      coverImage: blog.coverImage
    });
    setIsModalVisible(true);
  };

  // Xử lý khi xem trước blog
  const handlePreviewBlog = (blog) => {
    setPreviewBlog(blog);
    setPreviewVisible(true);
  };

  // Cấu hình cột cho bảng blogs
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Button type="link" onClick={() => handlePreviewBlog(record)} style={{ padding: 0, textAlign: 'left' }}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Tóm tắt',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'published' ? '#52c41a' : '#faad14',
          fontWeight: '500'
        }}>
          {status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handlePreviewBlog(record)}
          />
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditBlog(record)}
          />          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeleteBlog(record.id || record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="blog-management-container">
      <div className="blog-management-header">
        <h2 className="blog-management-title">Quản lý bài viết</h2>
      </div>

      <Card className="blog-management-card">
        <div className="blog-management-actions">
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề, mô tả, thể loại hoặc tác giả"
            allowClear
            className="blog-search"
            prefix={<SearchOutlined />}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setCurrentBlog(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Thêm bài viết
          </Button>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <Table 
          columns={columns} 
          dataSource={filteredBlogs}
          rowKey="key"
          pagination={{ pageSize: 6 }}
          loading={loading}
        />
      </Card>

      {/* Modal thêm/sửa bài viết */}
      <Modal
        title={currentBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentBlog(null);
          form.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => {
            setIsModalVisible(false);
            setCurrentBlog(null);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => {
              form.validateFields()
                .then(handleSaveBlog)
                .catch((info) => {
                  console.log('Validate Failed:', info);
                });
            }}
          >
            {currentBlog ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" className="blog-form">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>
          
          <Form.Item
            name="summary"
            label="Tóm tắt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt bài viết!' }]}
          >
            <Input placeholder="Nhập tóm tắt ngắn gọn về bài viết" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
          >
            <TextArea rows={10} placeholder="Nhập nội dung chi tiết của bài viết" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Thể loại"
            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
          >
            <Select placeholder="Chọn thể loại">
              <Option value="IVF">IVF</Option>
              <Option value="IUI">IUI</Option>
              <Option value="Nutrition">Dinh dưỡng</Option>
              <Option value="Tips">Lời khuyên</Option>
              <Option value="Success Stories">Câu chuyện thành công</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
          >
            <Input placeholder="Nhập tên tác giả" />
          </Form.Item>

          <Form.Item
            name="coverImage"
            label="Ảnh bìa"
            valuePropName="file"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".png,.jpg,.jpeg"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="draft"
          >
            <Select>
              <Option value="draft">Bản nháp</Option>
              <Option value="published">Xuất bản</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem trước bài viết */}
      <Modal
        title={previewBlog?.title}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {previewBlog && (
          <div className="blog-preview">
            <div className="blog-preview-header">
              <div className="blog-preview-cover">
                <img src={previewBlog.coverImage} alt={previewBlog.title} />
              </div>
              <h2>{previewBlog.title}</h2>
              <p className="blog-preview-meta">
                Thể loại: <strong>{previewBlog.category}</strong> | 
                Tác giả: <strong>{previewBlog.author}</strong> | 
                Ngày đăng: <strong>{previewBlog.createdAt}</strong>
              </p>
              <p className="blog-preview-summary">{previewBlog.summary}</p>
            </div>
            <div className="blog-preview-content">
              <p>{previewBlog.content}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogManagement;
