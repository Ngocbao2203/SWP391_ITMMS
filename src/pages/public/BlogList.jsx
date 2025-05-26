import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Input, Select, Empty, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { getPublishedBlogs } from '../../services/blogService';
import '../../styles/BlogList.css';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;  useEffect(() => {
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
    
    // Save current path to sessionStorage when on the blog list page
    sessionStorage.setItem('previousPath', window.location.pathname);
  }, []);

  // Filter blogs based on search text and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchText.toLowerCase()) || 
      blog.summary.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = category === 'all' || blog.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Get categories for filter dropdown
  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];

  // Pagination logic
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
          <Title level={2}>Blog & Experience Sharing</Title>
          <Paragraph>
            Read our latest articles about fertility treatments, patient experiences, and helpful tips.
          </Paragraph>
        </div>

        <div className="blog-filters">
          <Input 
            placeholder="Search blogs..." 
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
                {cat === 'all' ? 'All Categories' : cat}
              </Option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="loading-blogs">Loading blogs...</div>
        ) : paginatedBlogs.length === 0 ? (
          <Empty description="No blogs found matching your search" />
        ) : (
          <>
            <Row gutter={[24, 24]} className="blog-grid">
              {paginatedBlogs.map(blog => (                <Col xs={24} sm={12} md={8} key={blog.id || blog.key} className="blog-col">
                  <Link to={`/blog/${blog.id || blog.key}?from=list`}>
                    <Card 
                      hoverable
                      cover={<img alt={blog.title} src={blog.coverImage} className="blog-cover-image" />}
                      className="blog-card"
                    >
                      <div className="blog-card-content">
                        <div className="blog-meta">
                          <span className="blog-category">{blog.category}</span>
                          <span className="blog-date">{blog.createdAt}</span>
                        </div>
                        <Title level={4} className="blog-title">{blog.title}</Title>
                        <Paragraph ellipsis={{ rows: 2 }} className="blog-summary">{blog.summary}</Paragraph>
                        <div className="blog-author">By {blog.author}</div>
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
              />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogList;