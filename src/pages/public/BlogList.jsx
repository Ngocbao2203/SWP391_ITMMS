import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Input, Select, Empty, Pagination, Button } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { getPublishedBlogs } from '../../services/blogService';
import dayjs from 'dayjs';
import '../../styles/BlogList.css';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await getPublishedBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
    sessionStorage.setItem('previousPath', window.location.pathname);
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <MainLayout>
      <div className="blog-list-container">
        <div className="blog-list-header">
          <div className="blog-header-content">
            <Title level={2}>Bài viết & Chia sẻ kinh nghiệm</Title>
            <Paragraph>
              Tìm hiểu về các phương pháp điều trị hiếm muộn, chia sẻ từ bệnh nhân và những lời khuyên hữu ích.
            </Paragraph>
          </div>
        </div>
        <div className="blog-filters">
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            className="blog-search"
          />
          <Select
            defaultValue="all"
            onChange={value => setCategory(value)}
            className="category-filter"
          >
            {categories.map(cat => (
              <Option key={cat} value={cat}>
                {cat === 'all' ? 'Tất cả danh mục' : cat}
              </Option>
            ))}
          </Select>
        </div>
        {loading ? (
          <div className="loading-blogs">Đang tải bài viết...</div>
        ) : paginatedBlogs.length === 0 ? (
          <Empty description="Không tìm thấy bài viết nào phù hợp" />
        ) : (
          <>
            <Row gutter={[40, 40]} className="blog-grid">
              {paginatedBlogs.map(blog => (
                <Col xs={24} sm={12} md={8} key={blog.id || blog.key} className="blog-col">
                  <Link to={`/blog/${blog.id || blog.key}?from=list`}>
                    <Card
                      hoverable
                      cover={<img alt={blog.title} src={blog.coverImage} className="blog-cover-image" />}
                      className="blog-card"
                    >
                      <div className="blog-card-content">
                        <div className="blog-meta">
                          <span className={`blog-category ${blog.category}`}>{blog.category}</span>
                          <span className="blog-date">
                            {dayjs(blog.createdAt).format('DD Thg M, YYYY')}
                          </span>
                        </div>
                        <Title level={4} className="blog-title">{blog.title}</Title>
                        <Paragraph ellipsis={{ rows: 2 }} className="blog-summary">{blog.summary}</Paragraph>
                        <div className="blog-author">
                          <UserOutlined /> By {blog.author}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
            <div className="blog-pagination">
              <Pagination
                current={currentPage}
                total={filteredBlogs.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                hideOnSinglePage
                showSizeChanger={false}
                showQuickJumper
                prevText="Trước"
                nextText="Sau"
              />
            </div>
            <div className="blog-cta">
              <Paragraph>
                📣 Bạn có câu chuyện muốn chia sẻ?{' '}
                <Button type="primary">
                  <Link to="/submit-blog">Gửi bài viết cho chúng tôi ngay!</Link>
                </Button>
              </Paragraph>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogList;