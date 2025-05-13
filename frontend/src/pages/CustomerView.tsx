import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { IoArrowBack } from 'react-icons/io5';

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#ef4444'];

type Customer = {
  customer_id: string;
  customer_name: string;
  region: string;
  industry: string;
  join_date: string;
};

type Profile = {
  customer: Customer;
  sales_summary: {
    total_purchases: number;
    total_spent: number;
    avg_order_value: number;
    ltv_score: number;
  };
  support_summary: {
    total_tickets: number;
    avg_sentiment: number;
    open_issues: number;
  };
  ai_insights: string[];
  charts: {
    sales_over_time: { date: string; amount: number }[];
    sentiment_over_time: { date: string; score: number }[];
    support_status_breakdown: { status: string; count: number }[];
  };
};

export default function CustomerView() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}customers`, { params: { search } })
      .then(res => setCustomers(res.data));
  }, [search]);

  const fetchProfile = async (id: string) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}customers/${id}/profile`);
    setSelected(res.data);
  };

  return (
    <div className="p-4 h-screen w-full">
      {selected ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center text-blue-500"
          >
            <IoArrowBack className="mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-bold">{selected.customer.customer_name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Industry:</strong> {selected.customer.industry}</p>
              <p><strong>Region:</strong> {selected.customer.region}</p>
              <p><strong>Join Date:</strong> {new Date(selected.customer.join_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>Total Spent:</strong> ₹{selected.sales_summary.total_spent.toFixed(2)}</p>
              <p><strong>Transactions:</strong> {selected.sales_summary.total_purchases}</p>
              <p><strong>Avg Order Value:</strong> ₹{selected.sales_summary.avg_order_value.toFixed(2)}</p>
              <p><strong>LTV Score:</strong> {selected.sales_summary.ltv_score}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Support Summary</h3>
            <p><strong>Total Tickets:</strong> {selected.support_summary.total_tickets}</p>
            <p><strong>Avg Sentiment:</strong> {selected.support_summary.avg_sentiment.toFixed(2)}</p>
            <p><strong>Open Issues:</strong> {selected.support_summary.open_issues}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Insights</h3>
            <ul className="list-disc pl-5">
              {selected.ai_insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold">Sales Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selected.charts.sales_over_time}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-xl font-bold">Sentiment Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selected.charts.sentiment_over_time}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-xl font-bold">Support Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={selected.charts.support_status_breakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {selected.charts.support_status_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Customer List</h1>
          <input
            type="text"
            className="border p-2 w-full rounded mb-4"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Industry</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Region</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.customer_id}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => fetchProfile(c.customer_id)}
                >
                  <td className="border border-gray-300 px-4 py-2">{c.customer_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{c.industry}</td>
                  <td className="border border-gray-300 px-4 py-2">{c.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
