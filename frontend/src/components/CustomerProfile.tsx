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

export default function CustomerProfile({
  profile,
  onBack,
}: {
  profile: Profile;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-blue-500">
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
          {profile.ai_insights.map((insight, index) => (
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
                {profile.charts.support_status_breakdown.map((entry, index) => (
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
