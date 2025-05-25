import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, message, List, Tag } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [form] = Form.useForm();

  const handleSend = (values) => {
    const newNoti = {
      ...values,
      time: new Date().toLocaleString(),
    };
    setNotifications([newNoti, ...notifications]);
    message.success('Đã gửi thông báo thành công!');
    form.resetFields();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Gửi thông báo</h2>

      <Card title="Tạo thông báo mới" style={{ marginBottom: 24 }}>
        <Form layout="vertical" form={form} onFinish={handleSend}>
          <Form.Item
            name="recipientType"
            label="Đối tượng nhận"
            rules={[{ required: true, message: 'Vui lòng chọn đối tượng nhận' }]}
          >
            <Select placeholder="Chọn đối tượng">
              <Option value="doctor">Bác sĩ</Option>
              <Option value="patient">Bệnh nhân</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Gửi thông báo
          </Button>
        </Form>
      </Card>

      <Card title="Thông báo đã gửi">
        <List
          itemLayout="vertical"
          dataSource={notifications}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={
                  <span>
                    <Tag color={item.recipientType === 'doctor' ? 'purple' : 'blue'}>
                      {item.recipientType === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}
                    </Tag>{' '}
                    <strong>{item.title}</strong>
                  </span>
                }
                description={item.time}
              />
              <p>{item.content}</p>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notifications;
