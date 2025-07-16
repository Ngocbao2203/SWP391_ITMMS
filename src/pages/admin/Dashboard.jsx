import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, message, Spin } from 'antd';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import '../../styles/Dashboard.css';
import apiService from '../../services/api';

const COLORS = ['#36CFC9', '#9254DE'];

const Dashboard = () => {
  // State lưu trữ số liệu tổng quan, dữ liệu biểu đồ, trạng thái loading
  const [stats, setStats] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hàm lấy dữ liệu dashboard từ backend
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        // 1. Gọi API lấy số liệu tổng quan cho dashboard
        //    Endpoint: GET /dashboard/stats
        //    Trả về: tổng số bệnh nhân, cuộc hẹn, bác sĩ, doanh thu, v.v.
        const statsRes = await apiService.get('/dashboard/stats');
        setStats(statsRes);

        // 2. Xử lý dữ liệu phân bố giới tính nếu backend trả về
        //    statsRes.genderDistribution = { male: số lượng, female: số lượng }
        if (statsRes.genderDistribution) {
          setPieData([
            { name: 'Male', value: statsRes.genderDistribution.male || 0 },
            { name: 'Female', value: statsRes.genderDistribution.female || 0 },
          ]);
        } else {
          setPieData([]);
        }

        // 3. Gọi API lấy dữ liệu biểu đồ số lượng cuộc hẹn theo tháng
        //    Endpoint: GET /dashboard/monthly-report
        //    Trả về: monthlyAppointments = [{ month: 'Jan', count: 40 }, ...]
        const monthReport = await apiService.get('/dashboard/monthly-report');
        if (monthReport && Array.isArray(monthReport.monthlyAppointments)) {
          setBarData(monthReport.monthlyAppointments.map(item => ({
            name: item.month,         // Tên tháng
            appointments: item.count  // Số lượng cuộc hẹn
          })));
        } else {
          setBarData([]);
        }
      } catch (err) {
        // Nếu có lỗi khi gọi API, hiển thị thông báo
        message.error('Lỗi khi tải dữ liệu dashboard!');
      } finally {
        setLoading(false);
      }
    };
    // Gọi hàm lấy dữ liệu khi component mount
    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-container">
      <Row gutter={[24, 24]}>
        {/* Các ô thống kê tổng quan */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" loading={loading}>
            {/* Tổng số bệnh nhân lấy từ stats.totalPatients */}
            <Statistic title="Total Patients" value={stats?.totalPatients || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" loading={loading}>
            {/* Tổng số cuộc hẹn lấy từ stats.totalAppointments */}
            <Statistic title="Total Appointments" value={stats?.totalAppointments || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" loading={loading}>
            {/* Tổng số bác sĩ lấy từ stats.totalDoctors */}
            <Statistic title="Total Doctors" value={stats?.totalDoctors || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" loading={loading}>
            {/* Doanh thu lấy từ stats.revenue */}
            <Statistic title="Revenue" value={stats?.revenue || 0} prefix="$" />
          </Card>
        </Col>

        {/* Biểu đồ Pie phân bố giới tính bệnh nhân */}
        <Col xs={24} lg={12}>
          <Card title="Gender Distribution" loading={loading}>
            {/* Nếu đang loading thì hiển thị spinner, xong sẽ hiển thị biểu đồ Pie */}
            {loading ? <Spin /> : (
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
            )}
          </Card>
        </Col>

        {/* Biểu đồ Bar số lượng cuộc hẹn theo tháng */}
        <Col xs={24} lg={12}>
          <Card title="Monthly Appointments" loading={loading}>
            {/* Nếu đang loading thì hiển thị spinner, xong sẽ hiển thị biểu đồ Bar */}
            {loading ? <Spin /> : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#3b82f6" barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
