import React, { useState } from 'react';
import {
  Card,
  Table,
  Statistic,
  Row,
  Col,
  Rate,
  Tag,
  DatePicker,
  Space,
} from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import '../../styles/Reports.css'; // Import your CSS file for styling
const { RangePicker } = DatePicker;

const topServices = [
  {
    key: '1',
    name: 'General Checkup',
    avgRating: 4.7,
    feedbackCount: 128,
  },
  {
    key: '2',
    name: 'Dental Cleaning',
    avgRating: 4.5,
    feedbackCount: 92,
  },
  {
    key: '3',
    name: 'Eye Examination',
    avgRating: 4.3,
    feedbackCount: 75,
  },
];

// Giả lập dữ liệu rating theo thời gian
const ratingTrendData = [
  { date: '2025-01', rating: 4.2 },
  { date: '2025-02', rating: 4.3 },
  { date: '2025-03', rating: 4.1 },
  { date: '2025-04', rating: 4.5 },
  { date: '2025-05', rating: 4.4 },
];

const topColumns = [
  {
    title: 'Service Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Average Rating',
    dataIndex: 'avgRating',
    key: 'avgRating',
    render: (rating) => (
      <>
        <Rate disabled allowHalf defaultValue={rating} />
        <span style={{ marginLeft: 8 }}>{rating.toFixed(1)}</span>
      </>
    ),
  },
  {
    title: 'Feedback Count',
    dataIndex: 'feedbackCount',
    key: 'feedbackCount',
    render: (count) => <Tag color="blue">{count} feedbacks</Tag>,
  },
];

const Reports = () => {
  const [dateRange, setDateRange] = useState([]);

  const handleDateChange = (range) => {
    setDateRange(range);
    // 👉 Bạn có thể dùng range[0]/range[1] để filter dữ liệu
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Reports</h2>

      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Feedback" value={295} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Average Rating" value={4.4} suffix="/ 5" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Top Service" value="General Checkup" />
          </Card>
        </Col>
      </Row>

      <Card
        title="Rating Over Time"
        className="mt-6"
        extra={
          <Space>
            <span>Filter by Date:</span>
            <RangePicker
              onChange={handleDateChange}
              defaultValue={[
                dayjs('2025-01-01'),
                dayjs('2025-05-30'),
              ]}
              picker="month"
            />
          </Space>
        }
      >
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ratingTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[3.5, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top Rated Services" className="mt-6">
        <Table columns={topColumns} dataSource={topServices} pagination={false} />
      </Card>
    </div>
  );
};

export default Reports;
