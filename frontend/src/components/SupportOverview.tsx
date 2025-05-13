import React from "react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import StatCard from "./StatCard";

const COLORS = ["#3b82f6", "#10b981", "#f97316", "#ef4444"];

export default function SupportOverview({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Support Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Tickets" value={data.total_tickets} />
        <StatCard label="Avg Sentiment" value={data.avg_sentiment.toFixed(2)} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data.support_status_breakdown}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.support_status_breakdown.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.sentiment_trend}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
