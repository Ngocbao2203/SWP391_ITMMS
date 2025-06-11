import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Spin, Alert, Result, Button } from "antd";
import { HomeFilled } from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import SimpleServiceRegistrationForm from "../../components/public/SimpleServiceRegistrationForm";
import { getServiceById } from "../../services/serviceRegistration";

const SimpleServiceRegistrationPage = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServiceData = async () => {
      setLoading(true);
      
      try {
        if (serviceId) {
          const serviceData = await getServiceById(serviceId);
          setService(serviceData);
        } else {
          // Không có serviceId, cho phép người dùng chọn dịch vụ trong form
          setLoading(false);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin dịch vụ:", error);
        setError("Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadServiceData();
  }, [serviceId]);

  const handleRegistrationSuccess = () => {
    // Thông báo đăng ký thành công - form sẽ tự xử lý việc hiển thị kết quả
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <Spin size="large" tip="Đang tải thông tin..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Result
          status="error"
          title="Có lỗi xảy ra"
          subTitle={error}
          extra={[
            <Button type="primary" key="home" icon={<HomeFilled />} onClick={() => navigate("/")}>
              Quay về trang chủ
            </Button>,
            <Button key="service" onClick={() => navigate("/services")}>
              Xem các dịch vụ
            </Button>,
          ]}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SimpleServiceRegistrationForm
        service={service}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </MainLayout>
  );
};

export default SimpleServiceRegistrationPage;
