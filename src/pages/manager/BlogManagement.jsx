import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Upload, Space, Statistic, Row, Col, message } from 'antd';
import { PlusOutlined, SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        setBlogs(data);
        setStats({
          total: data.length,
          published: data.filter(b => b.status === 'published').length,
          drafts: data.filter(b => b.status === 'draft').length
        });
      } catch (error) {
        message.error('Failed to load blogs');
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
    const matchesStatus = !statusFilter || blog.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSaveBlog = async (values) => {
    try {
      const blogData = {
        ...values,
        coverImage: values.coverImage?.fileList?.[0]?.thumbUrl || (currentBlog?.coverImage || 'https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png')
      };

      if (currentBlog) {
        const updatedBlog = await updateBlog(currentBlog.id || currentBlog.key, blogData);
        setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
        message.success('Blog updated successfully!');
      } else {
        const newBlog = await createBlog(blogData);
        setBlogs([...blogs, newBlog]);
        message.success('Blog created successfully!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setCurrentBlog(null);
    } catch (error) {
      message.error('Failed to save blog');
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
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this blog?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteBlog(id);
          setBlogs(blogs.filter(blog => (blog.id || blog.key) !== id));
          message.success('Blog deleted successfully!');
        } catch (error) {
          message.error('Failed to delete blog');
        }
      },
    });
  };

  const handleBulkAction = async (action) => {
    try {
      if (action === 'delete') {
        await Promise.all(selectedRowKeys.map(id => deleteBlog(id)));
        setBlogs(blogs.filter(blog => !selectedRowKeys.includes(blog.id || blog.key)));
        message.success('Selected blogs deleted successfully!');
      } else {
        const updates = selectedRowKeys.map(id => updateBlog(id, { status: action }));
        await Promise.all(updates);
        setBlogs(blogs.map(blog => 
          selectedRowKeys.includes(blog.id || blog.key) ? { ...blog, status: action } : blog
        ));
        message.success(`Selected blogs ${action === 'published' ? 'published' : 'unpublished'} successfully!`);
      }
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('Failed to perform bulk action');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Button type="link" onClick={() => handlePreviewBlog(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
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
        <Col span={8}>
          <Statistic title="Total Blogs" value={stats.total} />
        </Col>
        <Col span={8}>
          <Statistic title="Published" value={stats.published} />
        </Col>
        <Col span={8}>
          <Statistic title="Drafts" value={stats.drafts} />
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Input.Search
              placeholder="Search by title or author"
              onSearch={setSearchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Filter by category"
              style={{ width: 150 }}
              allowClear
              onChange={setCategoryFilter}
            >
              <Option value="IVF">IVF</Option>
              <Option value="IUI">IUI</Option>
              <Option value="Nutrition">Nutrition</Option>
              <Option value="Tips">Tips</Option>
              <Option value="Success Stories">Success Stories</Option>
            </Select>
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              allowClear
              onChange={setStatusFilter}
            >
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
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
              New Blog
            </Button>
          </Space>
        </Space>

        {selectedRowKeys.length > 0 && (
          <Space style={{ marginBottom: 16 }}>
            <Button onClick={() => handleBulkAction('published')}>
              Publish Selected
            </Button>
            <Button onClick={() => handleBulkAction('draft')}>
              Unpublish Selected
            </Button>
            <Button danger onClick={() => handleBulkAction('delete')}>
              Delete Selected
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
        title={currentBlog ? 'Edit Blog' : 'New Blog'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentBlog(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveBlog}
          initialValues={{ status: 'draft' }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter blog title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter blog content' }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select>
              <Option value="IVF">IVF</Option>
              <Option value="IUI">IUI</Option>
              <Option value="Nutrition">Nutrition</Option>
              <Option value="Tips">Tips</Option>
              <Option value="Success Stories">Success Stories</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: 'Please enter author name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="coverImage"
            label="Cover Image"
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              accept=".png,.jpg,.jpeg"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
          >
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="published">Published</Option>
            </Select>
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
            <p><strong>Category:</strong> {previewBlog.category}</p>
            <p><strong>Author:</strong> {previewBlog.author}</p>
            <p><strong>Created:</strong> {previewBlog.createdAt}</p>
            <p>{previewBlog.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogManagement;