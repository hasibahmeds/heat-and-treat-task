import { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { requestWithFallback } from '../../assets/api';


const Dashboard = ({ url }) => {


const [chartData, setChartData] = useState([]);

const fetchCharts = async () => {
  try {
    const res = await requestWithFallback('get', '/api/analytics/daily');
    if (res.data.success) setChartData(res.data.data);
  } catch (err) {
    // ignore or log
  }
};

useEffect(() => {
  fetchCharts();
}, []);


  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await requestWithFallback('get', '/api/dashboard/stats');
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      // ignore or log
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <div className="add">Loading...</div>;

  return (
    <div className="dashboard add">
      <h3>Dashboard</h3>

      <div className="dashboard-grid">
        <div className="card">Total Items Sold <span>{stats.totalItemsSold}</span></div>
        <div className="card">Total Revenue <span>{stats.totalRevenue} TK</span></div>
        <div className="card delivered">Delivered <span>{stats.deliveredCount}</span></div>
        <div className="card cancelled">Cancelled <span>{stats.cancelledCount}</span></div>
        <div className="card pending">Pending <span>{stats.pendingCount}</span></div>
      </div>
              {/* -------- DAILY REVENUE CHART -------- */}
<div className="dashboard-chart">
  <h4>Daily Revenue</h4>
  <ResponsiveContainer width="100%" height={260}>
    <LineChart data={chartData}>
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Line dataKey="totalRevenue" />
    </LineChart>
  </ResponsiveContainer>
</div>

{/* -------- DAILY ORDERS CHART -------- */}
{/* <div className="dashboard-chart">
  <h4>Daily Orders</h4>
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={chartData}>
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="totalOrders" />
    </BarChart>
  </ResponsiveContainer>
</div> */}


<div className="dashboard-chart">
  <h4>Daily Orders</h4>
  <ResponsiveContainer width="100%" height={260}>
    <LineChart data={chartData}>
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Line dataKey="totalOrders" />
    </LineChart>
  </ResponsiveContainer>
</div>


    </div>
  );
};

export default Dashboard;
