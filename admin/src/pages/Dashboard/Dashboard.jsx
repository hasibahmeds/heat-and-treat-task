// src/pages/Dashboard/Dashboard.jsx  (admin)

import { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { requestWithFallback } from "../../assets/api";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharts = async () => {
    try {
      const res = await requestWithFallback("get", "/api/analytics/daily");
      if (res.data?.success && Array.isArray(res.data.data)) {
        // Sort just in case backend didn't
        const sorted = [...res.data.data].sort((a, b) => a.date.localeCompare(b.date));
        setChartData(sorted);
      }
    } catch (err) {
      console.error("Failed to load daily chart", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await requestWithFallback("get", "/api/dashboard/stats");
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError("Failed to load summary stats");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCharts(), fetchStats()]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="add">Loading dashboard data...</div>;
  if (error) return <div className="add error">{error}</div>;

  return (
    <div className="dashboard add">
      <h3>Dashboard Overview</h3>

      <div className="dashboard-grid">
        <div className="card">
          <span>Total Items Sold</span>
          <strong>{stats?.totalItemsSold ?? 0}</strong>
        </div>
        <div className="card">
          <span>Total Revenue</span>
          <strong>{(stats?.totalRevenue ?? 0).toLocaleString()} TK</strong>
        </div>
        <div className="card delivered">
          <span>Delivered</span>
          <strong>{stats?.deliveredCount ?? 0}</strong>
        </div>
        <div className="card cancelled">
          <span>Cancelled</span>
          <strong>{stats?.cancelledCount ?? 0}</strong>
        </div>
        <div className="card pending">
          <span>Pending</span>
          <strong>{stats?.pendingCount ?? 0}</strong>
        </div>
      </div>

      <div className="dashboard-chart">
        <h4>Daily Revenue Trend</h4>
        {chartData.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: "40px 0" }}>
            No revenue data available yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-35} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value.toLocaleString()} TK`, "Revenue"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="dashboard-chart">
        <h4>Daily Order Count</h4>
        {chartData.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: "40px 0" }}>
            No order data available yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-35} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [`${value} orders`, "Count"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="totalOrders"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;