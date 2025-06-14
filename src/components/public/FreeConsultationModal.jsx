import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, DatePicker, Radio, Select, Result } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import '../../styles/FreeConsultationModal.css';

const { Option } = Select;
const { TextArea } = Input;

const FreeConsultationModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [consultationType, setConsultationType] = useState('online');
  
  // Thời gian làm việc để chọn
  const availableTimeSlots = [
    '08:00 - 09:00', 
    '09:00 - 10:00', 
    '10:00 - 11:00', 
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      // Giả lập gửi dữ liệu đến server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form values:', {
        ...values,
        appointmentDate: values.appointmentDate?.format('YYYY-MM-DD'),
        timeSlot: values.timeSlot,
        consultationType: consultationType
      });
      
      setSuccess(true);
      form.resetFields();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi đăng ký tư vấn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    form.resetFields();
    setSuccess(false);
    onCancel();
  };

  const disabledDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ và ngày hiện tại
    return current && current < new Date().setHours(0, 0, 0, 0);
  };
  
  // Hiển thị màn hình thành công
  if (success) {
    return (
      <Modal
        visible={visible}
        footer={null}
        onCancel={handleClose}
        width={500}
        className="consultation-success-modal"
        centered
      >
        <Result
          icon={<CheckCircleFilled className="success-icon" />}
          status="success"
          title="Đăng ký tư vấn thành công!"
          subTitle="Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch tư vấn."
          extra={[
            <Button type="primary" key="close" onClick={handleClose}>
              Đóng
            </Button>
          ]}
        />
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      title={<div className="consultation-modal-title">Đăng ký tư vấn miễn phí</div>}
      onCancel={handleClose}
      footer={null}
      className="free-consultation-modal"
      width={600}
      centered
    >
      <div className="consultation-description">
        Hãy để lại thông tin của bạn, chúng tôi sẽ liên hệ trong thời gian sớm nhất để tư vấn chi tiết về vấn đề hiếm muộn.
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        requiredMark={false}
        className="consultation-form"
      >
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Họ và tên" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="Số điện thoại" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ!' },
            { required: true, message: 'Vui lòng nhập email!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Email" 
            size="large" 
          />
        </Form.Item>
        
        <div className="form-row">
          <Form.Item
            name="appointmentDate"
            label="Ngày mong muốn tư vấn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            className="date-picker-item"
          >
            <DatePicker 
              placeholder="Chọn ngày" 
              size="large" 
              disabledDate={disabledDate}
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined style={{ color: '#3f87f5' }} />}
              className="date-picker"
            />
          </Form.Item>
          
          <Form.Item
            name="timeSlot"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
            className="time-picker-item"
          >
            <Select
              placeholder="Chọn giờ"
              size="large"
              suffixIcon={<ClockCircleOutlined style={{ color: '#3f87f5' }} />}
              className="time-picker"
            >
              {availableTimeSlots.map(slot => (
                <Option key={slot} value={slot}>{slot}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        
        <Form.Item
          name="consultationType"
          label="Hình thức tư vấn"
          initialValue="online"
        >
          <Radio.Group 
            onChange={e => setConsultationType(e.target.value)} 
            value={consultationType}
            className="consultation-type"
          >
            <Radio value="online">Tư vấn trực tuyến</Radio>
            <Radio value="offline">Tư vấn tại phòng khám</Radio>
          </Radio.Group>
        </Form.Item>
        
        <Form.Item
          name="note"
          label="Ghi chú (tình trạng hiện tại, vấn đề cần tư vấn,...)"
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập thông tin chi tiết về vấn đề bạn đang gặp phải"
            className="note-textarea"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            size="large"
            className="submit-btn"
          >
            Đăng ký ngay
          </Button>
        </Form.Item>
      </Form>
      
      <div className="privacy-notice">
        <small>Thông tin của bạn sẽ được bảo mật theo chính sách riêng tư của chúng tôi</small>
      </div>
    </Modal>
  );
};

export default FreeConsultationModal;
