import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "./StatCard";

export default function SalesOverview({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Sales Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Sales" value={data.total_sales} />
        <StatCard label="Total Revenue" value={`$${data.total_revenue.toFixed(2)}`} />
        <StatCard label="Avg Sale Value" value={`$${data.avg_sale_value.toFixed(2)}`} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.sales_trend}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
