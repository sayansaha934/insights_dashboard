import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

type Customer = {
  customer_id: string;
  customer_name: string;
  region: string;
  industry: string;
};

export default function CustomerList({
  customers,
  search,
  setSearch,
  onSelect,
}: {
  customers: Customer[];
  search: string;
  setSearch: (value: string) => void;
  onSelect: (id: string) => void;
}) {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div>
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
              onClick={() => navigate(`/customer/${c.customer_id}`)} // Navigate on click
            >
              <td className="border border-gray-300 px-4 py-2">{c.customer_name}</td>
              <td className="border border-gray-300 px-4 py-2">{c.industry}</td>
              <td className="border border-gray-300 px-4 py-2">{c.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
