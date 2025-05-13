import React from "react";

export default function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <p className="text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
