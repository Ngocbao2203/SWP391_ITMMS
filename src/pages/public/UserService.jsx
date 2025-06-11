import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/UserService.css";
import MainLayout from "../../layouts/MainLayout";
import { Button, Row, Col, Card, Rate, Collapse, Tooltip, Tag, Divider } from 'antd';
import { 
  HeartOutlined, 
  RightOutlined, 
  CheckCircleOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined, 
  QuestionCircleOutlined,
  StarFilled,
  LikeOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;

export default function UserService() {
  const navigate = useNavigate();
  const [expandedService, setExpandedService] = useState(null);

  React.useEffect(() => {
    // Đảm bảo các card có chiều cao đồng nhất
    const equalizeCardHeights = () => {
      const cardElements = document.querySelectorAll('.fertility-service-card');
      let maxHeight = 0;
      
      // Reset heights
      cardElements.forEach(card => {
        card.style.height = 'auto';
        const height = card.offsetHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });
      
      // Apply equal height
      if (window.innerWidth >= 768) { // Only equalize on desktop
        cardElements.forEach(card => {
          card.style.minHeight = `${maxHeight}px`;
        });
      }
    };
    
    // Run on initial load and resize
    equalizeCardHeights();
    window.addEventListener('resize', equalizeCardHeights);
    
    return () => {
      window.removeEventListener('resize', equalizeCardHeights);
    };
  }, []);

  const showRegistrationForm = (service) => {
    // Điều hướng đến trang đăng ký dịch vụ mới với ID dịch vụ
    navigate(`/service-register/${service.id}`);
  };

  const dataServices = [
    {
      id: "ivf", // 👈 PHẢI THÊM id TƯƠNG ỨNG VỚI `useParams()` Ở ServiceDetail
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Thụ tinh trong ống nghiệm (IVF)",
      desc: "Phương pháp điều trị hiệu quả cao giúp các cặp vợ chồng hiếm muộn có cơ hội làm cha mẹ.",
      type: "IVF",
      successRate: "65%",
      features: [
        "Phù hợp với nhiều nguyên nhân vô sinh hiếm muộn",
        "Quy trình chuẩn quốc tế",
        "Đội ngũ bác sĩ giàu kinh nghiệm",
        "Phòng lab đạt tiêu chuẩn châu Âu"
      ]
    },
    {
      id: "icsi",
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Tiêm tinh trùng vào bào tương noãn (ICSI)",
      desc: "Kỹ thuật hỗ trợ sinh sản tiên tiến dành cho các trường hợp vô sinh do yếu tố nam.",
      type: "ICSI",
      successRate: "70%",
      features: [
        "Giải pháp hiệu quả cho tinh trùng yếu hoặc bất thường",
        "Công nghệ vi thao tác tiên tiến",
        "Tỷ lệ thành công cao",
        "Theo dõi sát sao trong quá trình điều trị"
      ]
    },
    {
      id: "iui",
      img: "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
      title: "Bơm tinh trùng vào buồng tử cung (IUI)",
      desc: "Phương pháp đơn giản, ít xâm lấn giúp tăng khả năng thụ thai tự nhiên.",
      type: "IUI",
      successRate: "25%",
      features: [
        "Quy trình đơn giản và nhanh chóng",
        "Chi phí thấp hơn các phương pháp khác",
        "Ít can thiệp, ít tác dụng phụ",
        "Thích hợp với nhiều trường hợp vô sinh nhẹ"
      ]
    },
  ];

  const testimonials = [
    {
      name: "Chị Minh Anh",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment: "Sau 5 năm chờ đợi, chúng tôi đã được làm cha mẹ nhờ quy trình IVF tại đây. Đội ngũ y bác sĩ rất tận tâm và chuyên nghiệp.",
      service: "IVF"
    },
    {
      name: "Anh Thanh & Chị Hương",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      comment: "Phương pháp ICSI đã giúp chúng tôi có được bé trai khỏe mạnh sau nhiều năm điều trị không thành công ở nơi khác.",
      service: "ICSI"
    },
    {
      name: "Chị Phương Thảo",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4,
      comment: "Từ lúc tư vấn đến khi kết thúc quá trình điều trị, tôi luôn cảm thấy được quan tâm và hỗ trợ nhiệt tình.",
      service: "IUI"
    }
  ];

  const faqs = [
    {
      question: "Phương pháp IVF có phù hợp với tất cả các trường hợp vô sinh hiếm muộn không?",
      answer: "IVF phù hợp với nhiều nguyên nhân vô sinh hiếm muộn, bao gồm vấn đề về ống dẫn trứng, chất lượng tinh trùng kém, vấn đề về rụng trứng, lão hóa buồng trứng, và vô sinh không rõ nguyên nhân. Tuy nhiên, không phải trường hợp nào cũng cần đến IVF ngay lập tức. Bác sĩ sẽ đánh giá tình trạng cụ thể và tư vấn phương pháp phù hợp nhất."
    },
    {
      question: "Chi phí điều trị IVF, ICSI, và IUI là bao nhiêu?",
      answer: "Chi phí điều trị phụ thuộc vào nhiều yếu tố, bao gồm loại phương pháp, thuốc sử dụng, và các thủ thuật bổ sung cần thiết. Phương pháp IUI có chi phí thấp nhất, khoảng 15-20 triệu VND. ICSI và IVF có chi phí cao hơn, từ 60-150 triệu VND một chu kỳ. Chúng tôi cung cấp tư vấn chi tiết về chi phí trước khi bắt đầu bất kỳ quy trình điều trị nào."
    },
    {
      question: "Tỷ lệ thành công của các phương pháp hỗ trợ sinh sản?",
      answer: "Tỷ lệ thành công phụ thuộc vào nhiều yếu tố như tuổi tác, nguyên nhân vô sinh, và sức khỏe tổng quát. Đối với phụ nữ dưới 35 tuổi, tỷ lệ thành công của IVF/ICSI vào khoảng 40-65% mỗi chu kỳ, giảm xuống 20-30% ở phụ nữ trên 40 tuổi. IUI có tỷ lệ thành công thấp hơn, khoảng 15-25% mỗi chu kỳ."
    },
    {
      question: "Quá trình điều trị kéo dài bao lâu?",
      answer: "Một chu kỳ IUI thường kéo dài 2-3 tuần. Với IVF hoặc ICSI, từ khi bắt đầu dùng thuốc kích thích buồng trứng đến khi chuyển phôi mất khoảng 4-6 tuần. Kết quả thụ thai có thể biết sau 2 tuần sau khi chuyển phôi."
    }
  ];
  // Không cần các hàm xử lý form đăng ký nữa

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="fertility-hero">
        <div className="hero-content">
          <h1>Dịch vụ điều trị hiếm muộn<br/>
            <span className="accent-text">Chuyên sâu & Tận tâm</span>
          </h1>
          <p>Mang đến giải pháp toàn diện và tiên tiến nhất, đồng hành cùng bạn trên hành trình làm cha mẹ</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-text">Năm kinh nghiệm</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-text">Khách hàng hài lòng</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-text">Ca điều trị thành công</span>
            </div>
          </div>
          <div className="hero-buttons">
            <Button type="primary" size="large" className="primary-btn" onClick={() => navigate('/bookappointment')}>
              Đặt lịch hẹn <RightOutlined />
            </Button>
            <Button size="large" className="secondary-btn" onClick={() => navigate('/doctors')}>
              Đội ngũ chuyên gia
            </Button>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="fertility-services-container">
        <div className="services-header">
          <h2 className="section-title">Dịch vụ điều trị hiếm muộn</h2>
          <p className="section-description">
            Chúng tôi cung cấp các giải pháp y tế hiện đại và toàn diện để hỗ trợ hành trình làm cha mẹ của bạn
          </p>
        </div>

        <div className="fertility-services-grid">
          {dataServices.map((service) => (
            <Card
              key={service.id}
              hoverable
              className={`fertility-service-card ${expandedService === service.id ? 'expanded' : ''}`}
              onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
              cover={
                <div className="service-image">
                  <img src={service.img} alt={service.title} />
                  <div className="service-overlay">
                    <div className="service-type-badge">{service.type}</div>
                  </div>
                </div>
              }
            >
              <Tag color="#8e24aa" className="success-rate-tag">Tỷ lệ thành công: {service.successRate}</Tag>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.desc}</p>
              
              <div className="service-features">
                {service.features.map((feature, idx) => (
                  <div className="feature-item" key={idx}>
                    <CheckCircleOutlined className="check-icon" /> {feature}
                  </div>
                ))}
              </div>              <div className="service-buttons">
                <Button
                  type="primary"
                  className="btn-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/services/${service.id}`);
                  }}
                >
                  Tìm hiểu thêm <RightOutlined />
                </Button>
                <Button
                  type="default"
                  className="btn-register"
                  onClick={(e) => {
                    e.stopPropagation();
                    showRegistrationForm(service);
                  }}
                >
                  <CalendarOutlined /> Đăng ký
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Our Strengths */}
        <div className="strengths-section">
          <h2 className="section-title">Tại sao chọn chúng tôi</h2>
          <p className="section-description">
            Chúng tôi cam kết mang đến những dịch vụ chất lượng cao nhất với sự tận tâm và thấu hiểu
          </p>
          
          <Row gutter={[32, 32]} className="strengths-grid">
            <Col xs={24} sm={12} md={8}>
              <div className="strength-card">
                <div className="strength-icon">
                  <TeamOutlined />
                </div>
                <h3>Đội ngũ chuyên gia hàng đầu</h3>
                <p>Các bác sĩ và chuyên gia của chúng tôi có nhiều năm kinh nghiệm trong lĩnh vực hỗ trợ sinh sản</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="strength-card">
                <div className="strength-icon">
                  <SafetyCertificateOutlined />
                </div>
                <h3>Công nghệ hiện đại</h3>
                <p>Ứng dụng những kỹ thuật và thiết bị tiên tiến nhất trong lĩnh vực hỗ trợ sinh sản</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="strength-card">
                <div className="strength-icon">
                  <HeartOutlined />
                </div>
                <h3>Chăm sóc tận tâm</h3>
                <p>Mỗi khách hàng được chăm sóc và theo dõi cá nhân hóa trong suốt quá trình điều trị</p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
          <h2 className="section-title">Khách hàng của chúng tôi nói gì?</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-info">
                    <h3>{testimonial.name}</h3>
                    <p>Dịch vụ: {testimonial.service}</p>
                    <Rate disabled defaultValue={testimonial.rating} />
                  </div>
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="section-title">Câu hỏi thường gặp</h2>
          <p className="section-description">
            Những thông tin cơ bản về các phương pháp điều trị hiếm muộn
          </p>
          
          <Collapse 
            expandIconPosition="right" 
            className="faq-collapse"
          >
            {faqs.map((faq, index) => (
              <Panel 
                header={<span><QuestionCircleOutlined /> {faq.question}</span>} 
                key={index}
                className="faq-panel"
              >
                <p>{faq.answer}</p>
              </Panel>
            ))}
          </Collapse>
        </div>

        {/* Enhanced CTA */}
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Hãy để chúng tôi đồng hành cùng bạn</h2>
            <p className="cta-description">
              Đội ngũ bác sĩ giàu kinh nghiệm và thiết bị hiện đại sẵn sàng hỗ trợ giấc mơ làm cha mẹ của bạn
            </p>
            <div className="cta-features">
              <div className="cta-feature">
                <LikeOutlined /> Tư vấn riêng tư
              </div>
              <div className="cta-feature">
                <SafetyCertificateOutlined /> Đảm bảo an toàn
              </div>
              <div className="cta-feature">
                <StarFilled /> Dịch vụ 5 sao
              </div>
            </div>
            <Button 
              size="large"
              type="primary"
              className="cta-button"
              onClick={() => showRegistrationForm({ id: "consult", title: "Tư vấn miễn phí", type: "CONSULT" })}>
              Tư vấn miễn phí ngay
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
