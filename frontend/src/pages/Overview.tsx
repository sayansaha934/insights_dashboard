import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f97316", "#ef4444"];

export default function Overview() {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}overview`);
      setOverviewData(res.data);
    } catch (err) {
      setError("Failed to fetch overview data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!overviewData) {
    return null;
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Dashboard Overview</h1>

      {/* Sales Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Sales Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold">{overviewData.sales_overview.total_sales}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">₹{overviewData.sales_overview.total_revenue.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Avg Sale Value</p>
            <p className="text-2xl font-bold">₹{overviewData.sales_overview.avg_sale_value.toFixed(2)}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={overviewData.sales_overview.sales_trend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Customer Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">{overviewData.customer_overview.total_customers}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">New Customers This Month</p>
            <p className="text-2xl font-bold">{overviewData.customer_overview.new_customers_this_month}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold">Top Customers</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {overviewData.customer_overview.top_customers.map((customer: any) => (
              <tr key={customer.customer_id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{customer.customer_name}</td>
                <td className="border border-gray-300 px-4 py-2">₹{customer.total_spent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Product Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{overviewData.product_overview.total_products}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Avg Product Price</p>
            <p className="text-2xl font-bold">₹{overviewData.product_overview.avg_product_price.toFixed(2)}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold">Best Selling Product</h3>
        <p>
          Product ID: {overviewData.product_overview.best_selling_product[0].product_id}, Sales Count:{" "}
          {overviewData.product_overview.best_selling_product[0].sales_count}, Revenue: ₹
          {overviewData.product_overview.best_selling_product[0].revenue.toFixed(2)}
        </p>
        <h3 className="text-xl font-semibold">Most Problematic Product</h3>
        <p>
          Product ID: {overviewData.product_overview.most_problematic_product[0].product_id}, Issue Count:{" "}
          {overviewData.product_overview.most_problematic_product[0].issue_count}
        </p>
        {overviewData.product_overview.frequently_bought_together && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Bought Together</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Sales Price</th>
                </tr>
              </thead>
              <tbody>
                {overviewData.product_overview.frequently_bought_together.map((product: any) => (
                  <tr key={product.product_id} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{product.sales_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Support Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Support Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Total Tickets</p>
            <p className="text-2xl font-bold">{overviewData.support_overview.total_tickets}</p>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <p className="text-gray-500">Avg Sentiment</p>
            <p className="text-2xl font-bold">{overviewData.support_overview.avg_sentiment.toFixed(2)}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={overviewData.support_overview.support_status_breakdown}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {overviewData.support_overview.support_status_breakdown.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={overviewData.support_overview.sentiment_trend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
