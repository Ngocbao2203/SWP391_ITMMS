import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Steps, Typography, Radio, Row, Col } from 'antd';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/RegisterService.css'; // Import your CSS styles

const { Step } = Steps;
const { Title, Paragraph } = Typography;

const RegisterService = () => {
  const { serviceId } = useParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    gender: '',
    serviceChoice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đăng ký dịch vụ ${serviceId} thành công!`);
  };

  return (
    <MainLayout>
      <div className="register-service">
        <Typography.Title level={1}>Đăng ký dịch vụ: {serviceId}</Typography.Title>
        <Steps current={step - 1} size="small" style={{ marginBottom: 20 }}>
          <Step title="Thông tin cá nhân" />
          <Step title="Lựa chọn dịch vụ" />
          <Step title="Lịch hẹn" />
          <Step title="Hoàn tất" />
        </Steps>

        {step === 1 && (
          <Form onFinish={handleNextStep}>
            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input value={formData.name} name="name" onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
              <Input type="email" value={formData.email} name="email" onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
              <Input value={formData.phone} name="phone" onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
              <Radio.Group value={formData.gender} onChange={handleChange} name="gender">
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Tiếp theo
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form onFinish={handleNextStep}>
            <Form.Item label="Chọn dịch vụ" name="serviceChoice" rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}>
              <Radio.Group value={formData.serviceChoice} onChange={handleChange} name="serviceChoice">
                <Radio value="ivf">Thụ tinh trong ống nghiệm (IVF)</Radio>
                <Radio value="iui">Thụ tinh trong tử cung (IUI)</Radio>
                <Radio value="icsi">Tiêm tinh trùng vào bào tương noãn (ICSI)</Radio>
              </Radio.Group>
            </Form.Item>

            <Button onClick={handlePrevStep} style={{ marginRight: 8 }}>
              Quay lại
            </Button>
            <Button type="primary" htmlType="submit">
              Tiếp theo
            </Button>
          </Form>
        )}

        {step === 3 && (
          <Form onFinish={handleSubmit}>
            <Form.Item label="Chọn ngày điều trị" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
              <DatePicker value={formData.date} onChange={(date) => setFormData({ ...formData, date })} />
            </Form.Item>

            <Button onClick={handlePrevStep} style={{ marginRight: 8 }}>
              Quay lại
            </Button>
            <Button type="primary" htmlType="submit">
              Hoàn tất đăng ký
            </Button>
          </Form>
        )}

        {step === 4 && (
          <div>
            <Typography.Title level={3}>Cảm ơn bạn đã đăng ký dịch vụ!</Typography.Title>
            <Paragraph>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận thông tin và lịch trình điều trị.</Paragraph>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RegisterService;
