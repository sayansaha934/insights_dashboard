import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function AnomalousCustomers({
  data,
  loading,
  error,
}: {
  data: any[];
  loading: boolean;
  error: string | null;
}) {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Customers with High Negative Sentiment Tickets</h2>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : data.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Negative Ticket Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer) => (
              <tr
                key={customer.customer_id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => navigate(`/customer/${customer.customer_id}`)} // Navigate to customer profile
              >
                <td className="border border-gray-300 px-4 py-2">{customer.customer_name}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.negative_ticket_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4">No anomalous customers found.</div>
      )}
    </div>
  );
}
