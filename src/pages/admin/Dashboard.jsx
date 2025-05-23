import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import '../../styles/Dashboard.css'; // Import your CSS file for styling
const pieData = [
  { name: 'Male', value: 700 },
  { name: 'Female', value: 428 },
];

const COLORS = ['#36CFC9', '#9254DE'];

const barData = [
  { name: 'Jan', appointments: 40 },
  { name: 'Feb', appointments: 65 },
  { name: 'Mar', appointments: 85 },
  { name: 'Apr', appointments: 50 },
  { name: 'May', appointments: 72 },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Row gutter={[24, 24]}>
        {/* Statistics */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Statistic title="Total Patients" value={1128} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Statistic title="Total Appointments" value={256} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Statistic title="Total Doctors" value={42} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card">
            <Statistic title="Revenue" value={56900} prefix="$" />
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={12}>
          <Card title="Gender Distribution">
            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </Card>
        </Col>

        {/* Bar Chart */}
        <Col xs={24} lg={12}>
          <Card title="Monthly Appointments">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#3b82f6" barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
