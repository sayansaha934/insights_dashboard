import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { IoArrowBack } from "react-icons/io5";

const COLORS = ["#3b82f6", "#f97316", "#10b981", "#ef4444"];

export default function ProductProfile({
  productDetails,
  onBack,
}: {
  productDetails: any;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-blue-500">
        <IoArrowBack className="mr-2" />
        Back
      </button>
      <h2 className="text-3xl font-bold">{productDetails.product.product_name}</h2>

      {/* Product Details */}
      <div className="space-y-2">
        <p>
          <strong>Category:</strong> {productDetails.product.category}
        </p>
        <p>
          <strong>Cost Price:</strong> ₹{productDetails.product.cost_price}
        </p>
        <p>
          <strong>Sales Price:</strong> ₹{productDetails.product.sales_price}
        </p>
      </div>

      {/* Sales Performance */}
      <div className="mt-4">
        <h3 className="font-semibold text-xl">Sales Performance</h3>
        <p>Total Sales: {productDetails.sales_summary.total_sales}</p>
        <p>Total Revenue: ₹{productDetails.sales_summary.total_revenue.toFixed(2)}</p>
        <p>Average Sale Value: ₹{productDetails.sales_summary.avg_sale_value.toFixed(2)}</p>
      </div>

      {/* Support Issues */}
      <div className="mt-4">
        <h3 className="font-semibold text-xl">Support Issues</h3>
        <p>Total Issues: {productDetails.support_summary.total_issues}</p>
        <p>Avg. Sentiment Score: {productDetails.support_summary.avg_sentiment?.toFixed(2)}</p>
        <p>Open Issues: {productDetails.support_summary.open_issues}</p>
      </div>

      {/* Sales Over Time */}
      <div className="mt-4">
        <h3 className="font-semibold text-xl">Sales Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productDetails.charts.sales_over_time}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sentiment Over Time */}
      <div className="mt-4">
        <h3 className="font-semibold text-xl">Sentiment Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productDetails.charts.sentiment_over_time}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Support Status Breakdown */}
      <div className="mt-4">
        <h3 className="font-semibold text-xl">Support Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productDetails.charts.support_status_breakdown}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {productDetails.charts.support_status_breakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Customers */}
      <div className="mt-4">
        <h3 className="font-semibold text-xl">Top Customers</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Purchase Count</th>
            </tr>
          </thead>
          <tbody>
            {productDetails.top_customers.map((customer: any) => (
              <tr key={customer.customer_id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{customer.customer_name}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.purchase_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Frequently Bought Together */}
      <div className="mt-4">
        <h3 className="font-semibold text-xl">Frequently Bought Together</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Sales Price</th>
            </tr>
          </thead>
          <tbody>
            {productDetails.frequently_bought_together.map((product: any) => (
              <tr key={product.product_id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                <td className="border border-gray-300 px-4 py-2">₹{product.sales_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
