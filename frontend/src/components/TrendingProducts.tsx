import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function TrendingProducts({
  data,
  loading,
  error,
}: {
  data: any | null;
  loading: boolean;
  error: string | null;
}) {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Products with Rapidly Increasing/Decreasing Sales Trends</h2>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rising Trends */}
          <div>
            <h3 className="text-xl font-semibold text-green-600">Rising Trends</h3>
            {data.rising_trends.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Change (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rising_trends.map((product) => (
                    <tr
                      key={product.product_id}
                      className="hover:bg-green-50 cursor-pointer"
                      onClick={() => navigate(`/product/${product.product_id}`)} // Navigate to product profile
                    >
                      <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{(product.change * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">No rising trends found.</div>
            )}
          </div>

          {/* Falling Trends */}
          <div>
            <h3 className="text-xl font-semibold text-red-600">Falling Trends</h3>
            {data.falling_trends.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Change (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.falling_trends.map((product) => (
                    <tr
                      key={product.product_id}
                      className="hover:bg-red-50 cursor-pointer"
                      onClick={() => navigate(`/product/${product.product_id}`)} // Navigate to product profile
                    >
                      <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{(product.change * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">No falling trends found.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">No trending products data available.</div>
      )}
    </div>
  );
}
