import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Card, Breadcrumb, Divider, Spin, Button, Empty } from 'antd';
import { HomeOutlined, ReadOutlined, CalendarOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import { getBlogById } from '../../services/blogService';
import '../../styles/BlogDetail.css';

const { Title, Paragraph, Text } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sourceIsHome, setSourceIsHome] = useState(false);
    useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        console.log(`Fetching blog with ID: ${id}`);
        const data = await getBlogById(id);
        console.log('Blog data received:', data);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);    // Check if user came from home page
    const queryParams = new URLSearchParams(window.location.search);
    const fromPage = queryParams.get('from');
    
    if (fromPage === 'home' || sessionStorage.getItem('previousPath') === '/') {
      setSourceIsHome(true);
    }
    
    // Save current path for future reference
    return () => {
      sessionStorage.setItem('previousPath', window.location.pathname);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (loading) {
    return (
      <MainLayout>
        <div className="blog-detail-loading">
          <Spin size="large" />
          <p>Đang tải nội dung bài viết...</p>
        </div>
      </MainLayout>
    );
  }
  if (!blog) {
    return (
      <MainLayout>
        <div className="blog-detail-not-found">
          <Empty
            description="Không tìm thấy bài viết hoặc bài viết đã bị xóa"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Link to="/blog">
            <Button type="primary">Quay lại danh sách bài viết</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="blog-detail-container">        <Breadcrumb className="blog-breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined /> Trang chủ
            </Link>
          </Breadcrumb.Item>
          {!sourceIsHome && (
            <Breadcrumb.Item>
              <Link to="/blog">
                <ReadOutlined /> Danh sách bài viết
              </Link>
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="blog-detail-card">
          <div className="blog-detail-header">
            <Title level={1} className="blog-title">
              {blog.title}
            </Title>

            <div className="blog-meta">
              <div className="blog-meta-item">
                <CalendarOutlined /> {blog.createdAt}
              </div>
              <div className="blog-meta-item">
                <UserOutlined /> {blog.author}
              </div>
              <div className="blog-meta-item">
                <TagOutlined /> {blog.category}
              </div>
            </div>

            {blog.coverImage && (
              <div className="blog-cover-image">
                <img src={blog.coverImage} alt={blog.title} />
              </div>
            )}

            <Paragraph className="blog-summary">
              {blog.summary}
            </Paragraph>

            <Divider />
          </div>

          <div className="blog-content">
            {blog.content.split('\n').map((paragraph, index) => (
              <Paragraph key={index}>
                {paragraph}
              </Paragraph>
            ))}
          </div>

          <Divider />

          <div className="blog-footer">            <Text type="secondary" className="blog-disclaimer">
              Lưu ý: Thông tin trong bài viết này chỉ mang tính chất tham khảo và không thay thế cho lời khuyên y tế chuyên nghiệp. Vui lòng tham khảo ý kiến của các chuyên gia y tế trước khi đưa ra quyết định y tế.
            </Text>            <div className="blog-navigation">
              {sourceIsHome ? (
                <Link to="/">
                  <Button type="primary">Quay lại trang chủ</Button>
                </Link>
              ) : (
                <Link to="/blog">
                  <Button type="primary">Quay lại danh sách bài viết</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BlogDetail;
