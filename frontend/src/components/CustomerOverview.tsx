import React from "react";
import StatCard from "./StatCard";

export default function CustomerOverview({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Customer Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Customers" value={data.total_customers} />
        <StatCard label="New Customers This Month" value={data.new_customers_this_month} />
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
          {data.top_customers.map((customer: any) => (
            <tr key={customer.customer_id} className="hover:bg-blue-50">
              <td className="border border-gray-300 px-4 py-2">{customer.customer_name}</td>
              <td className="border border-gray-300 px-4 py-2">${customer.total_spent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
