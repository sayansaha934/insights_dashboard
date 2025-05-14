import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

const COLORS = ["#3b82f6", "#f97316", "#10b981", "#ef4444"];

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchCustomerProfile() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}customers/${id}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching customer profile:", error);
      }
    }

    fetchCustomerProfile();
  }, [id]);

  if (!profile) {
    return (
      <div className="text-center mt-10">
        <p>Loading customer profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-500">
        <IoArrowBack className="mr-2" />
        Back
      </button>
      <h2 className="text-2xl font-bold">{profile.customer.customer_name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Industry:</strong> {profile.customer.industry}
          </p>
          <p>
            <strong>Region:</strong> {profile.customer.region}
          </p>
          <p>
            <strong>Join Date:</strong>{" "}
            {new Date(profile.customer.join_date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p>
            <strong>Total Spent:</strong> ${profile.sales_summary.total_spent.toFixed(2)}
          </p>
          <p>
            <strong>Transactions:</strong> {profile.sales_summary.total_purchases}
          </p>
          <p>
            <strong>Avg Order Value:</strong> $
            {profile.sales_summary.avg_order_value.toFixed(2)}
          </p>
          <p>
            <strong>LTV Score:</strong> {profile.sales_summary.ltv_score}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold">Support Summary</h3>
        <p>
          <strong>Total Tickets:</strong> {profile.support_summary.total_tickets}
        </p>
        <p>
          <strong>Avg Sentiment:</strong>{" "}
          {profile.support_summary.avg_sentiment.toFixed(2)}
        </p>
        <p>
          <strong>Open Issues:</strong> {profile.support_summary.open_issues}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-bold">AI Insights</h3>
        <ul className="list-disc pl-5">
          {profile.ai_insights.map((insight: string, index: number) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold">Sales Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profile.charts.sales_over_time}>
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
            <LineChart data={profile.charts.sentiment_over_time}>
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
                data={profile.charts.support_status_breakdown}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {profile.charts.support_status_breakdown.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
