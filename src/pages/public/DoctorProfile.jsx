// Trang chi tiết hồ sơ bác sĩ cho khách truy cập
// Sử dụng Ant Design cho UI, quản lý state bằng React hook
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Breadcrumb, message, Tag, Spin } from "antd";
import {
  CalendarOutlined,
  MessageOutlined,
  TrophyOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import guestService from "../../services/guestService";

const { Title, Paragraph, Text } = Typography;

// Component chính hiển thị chi tiết bác sĩ
const DoctorProfile = () => {
  // Lấy id bác sĩ từ URL
  const { id } = useParams();
  const navigate = useNavigate();
  // State lưu trữ thông tin bác sĩ và trạng thái loading
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin chi tiết bác sĩ từ API khi component mount hoặc id thay đổi
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await guestService.getPublicDoctorDetails(id);
        console.log("API Response:", response);
        // Định dạng lại dữ liệu bác sĩ để hiển thị
        const doctorData = response.data || {};
        const mappedDoctor = {
          id: doctorData.id,
          name: doctorData.doctorName || "Không rõ tên",
          specialty: doctorData.specialization || "Không rõ chuyên khoa",
          experience: doctorData.experienceYears
            ? `${doctorData.experienceYears} năm kinh nghiệm`
            : "Không rõ kinh nghiệm",
          rating: doctorData.averageRating || 0,
          reviewCount: doctorData.totalFeedbacks || 0,
          patientsCount: doctorData.totalPatients || 0,
          photo:
            doctorData.photo ||
            "https://res.cloudinary.com/dqnq00784/image/upload/v1746013282/udf9sd7mne0dalsnyjrq.png",
          description: doctorData.description || "Không có mô tả",
          education: doctorData.education || "Không rõ học vấn",
          licenseNumber: doctorData.licenseNumber || "Không rõ",
          consultationFee: Number(doctorData.consultationFee) || 0,
        };
        setDoctor(mappedDoctor);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        message.error("Không thể tải thông tin bác sĩ");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Xử lý khi nhấn đặt lịch tư vấn (hiện thông báo demo)
  const handleBookConsultation = () => {
    message.success(
      `Đã gửi yêu cầu đặt lịch tư vấn với ${doctor.name}. Chúng tôi sẽ liên hệ với bạn trong 24h!`
    );
  };

  // Xử lý khi nhấn liên hệ bác sĩ (hiện thông báo demo)
  const handleContactDoctor = () => {
    message.info(
      "Tính năng nhắn tin trực tiếp với bác sĩ sẽ được phát triển trong phiên bản tiếp theo."
    );
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <MainLayout>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: '20px 0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <Spin size="large" tip="Đang tải..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Hiển thị khi không tìm thấy bác sĩ
  if (!doctor) {
    return (
      <MainLayout>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: '20px 0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}>
              <Title level={3} style={{ color: '#666', marginBottom: '20px' }}>
                Không tìm thấy thông tin bác sĩ
              </Title>
              <Button 
                type="primary" 
                onClick={() => navigate("/doctors")}
                style={{
                  borderRadius: '12px',
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: '600'
                }}
              >
                Quay lại danh sách bác sĩ
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Render giao diện chi tiết bác sĩ
  return (
    <MainLayout>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Navigation Bar breadcrumb */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              background: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a href="/guest" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666',
                    textDecoration: 'none'
                  }}>
                    {/* Icon home */}
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      stroke="currentColor"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Trang chủ
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href="/doctors" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666',
                    textDecoration: 'none'
                  }}>
                    {/* Icon doctor list */}
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      stroke="currentColor"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Danh sách bác sĩ
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#1890ff',
                  fontWeight: '500'
                }}>
                  {/* Icon profile */}
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    stroke="currentColor"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {doctor.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          {/* Card header thông tin bác sĩ */}
          <Card style={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: 'none',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'flex-start',
              padding: '20px'
            }}>
              {/* Avatar bác sĩ */}
              <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                }}>
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}>
                  <MedicineBoxOutlined style={{ marginRight: '6px' }} />
                  {doctor.specialty}
                </div>
              </div>

              {/* Thông tin chính bác sĩ */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Title level={1} style={{
                  color: '#2c3e50',
                  marginBottom: '20px',
                  fontSize: '36px',
                  fontWeight: '700',
                  lineHeight: '1.2'
                }}>
                  {doctor.name}
                </Title>

                <div style={{
                  display: 'flex',
                  gap: '30px',
                  marginBottom: '25px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: '16px',
                  border: '1px solid #e9ecef'
                }}>
                  {/* Số năm kinh nghiệm */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    flex: 1
                  }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1890ff',
                      marginBottom: '4px'
                    }}>
                      {doctor.experience.split(" ")[0]}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Năm kinh nghiệm
                    </span>
                  </div>
                  {/* Số bệnh nhân */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    flex: 1
                  }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1890ff',
                      marginBottom: '4px'
                    }}>
                      {doctor.patientsCount}+
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Bệnh nhân
                    </span>
                  </div>
                  {/* Phí tư vấn */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    flex: 1
                  }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1890ff',
                      marginBottom: '4px'
                    }}>
                      {doctor.consultationFee.toLocaleString()}đ
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Phí tư vấn
                    </span>
                  </div>
                </div>

                <Paragraph style={{
                  color: '#555',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '30px'
                }}>
                  {doctor.description}
                </Paragraph>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    onClick={handleBookConsultation}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      height: '48px',
                      padding: '0 24px',
                      fontWeight: '600',
                      fontSize: '16px',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Đặt lịch
                  </Button>
                  <Button
                    size="large"
                    icon={<MessageOutlined />}
                    onClick={handleContactDoctor}
                    style={{
                      border: '2px solid #1890ff',
                      color: '#1890ff',
                      borderRadius: '12px',
                      height: '48px',
                      padding: '0 24px',
                      fontWeight: '600',
                      fontSize: '16px',
                      background: 'white'
                    }}
                  >
                    Liên hệ
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Card thông tin chi tiết bác sĩ */}
          <Card style={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <div style={{ padding: '10px' }}>
              <Title level={3} style={{
                color: 'white',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '24px'
              }}>
                <TrophyOutlined style={{ color: '#fff', fontSize: '18px' }} />
                <span>Thông tin chi tiết</span>
              </Title>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {/* Học vấn */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Text strong style={{
                    color: 'white',
                    marginBottom: '8px',
                    fontSize: '14px',
                    opacity: 0.9,
                    display: 'block'
                  }}>
                    Học vấn:
                  </Text>
                  <Text style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {doctor.education}
                  </Text>
                </div>

                {/* Số giấy phép */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Text strong style={{
                    color: 'white',
                    marginBottom: '8px',
                    fontSize: '14px',
                    opacity: 0.9,
                    display: 'block'
                  }}>
                    Số giấy phép:
                  </Text>
                  <Text style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {doctor.licenseNumber}
                  </Text>
                </div>

                {/* Đánh giá */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Text strong style={{
                    color: 'white',
                    marginBottom: '8px',
                    fontSize: '14px',
                    opacity: 0.9,
                    display: 'block'
                  }}>
                    Đánh giá:
                  </Text>
                  <Text style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {doctor.rating} ★
                  </Text>
                </div>

                {/* Số phản hồi */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Text strong style={{
                    color: 'white',
                    marginBottom: '8px',
                    fontSize: '14px',
                    opacity: 0.9,
                    display: 'block'
                  }}>
                    Phản hồi:
                  </Text>
                  <Text style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {doctor.reviewCount}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorProfile;
// Kết thúc file DoctorProfile.jsx