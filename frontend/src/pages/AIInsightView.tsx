import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AIInsightView() {
  const [anomalousCustomers, setAnomalousCustomers] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnomalousCustomers();
    fetchTrendingProducts();
  }, []);

  const fetchAnomalousCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}insights/anomalous_customers`);
      setAnomalousCustomers(res.data);
    } catch (err) {
      setError("Failed to fetch anomalous customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}insights/trending_products`);
      setTrendingProducts(res.data);
    } catch (err) {
      setError("Failed to fetch trending products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">AI Insights</h1>

      {/* Customers with High Negative Sentiment Tickets */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Customers with High Negative Sentiment Tickets</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : anomalousCustomers.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Negative Ticket Count</th>
              </tr>
            </thead>
            <tbody>
              {anomalousCustomers.map((customer) => (
                <tr key={customer.customer_id} className="hover:bg-blue-50">
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

      {/* Products with Rapidly Increasing/Decreasing Sales Trends */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Products with Rapidly Increasing/Decreasing Sales Trends</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : trendingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rising Trends */}
            <div>
              <h3 className="text-xl font-semibold text-green-600">Rising Trends</h3>
              {trendingProducts.rising_trends.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Change (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingProducts.rising_trends.map((product) => (
                      <tr key={product.product_id} className="hover:bg-green-50">
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
              {trendingProducts.falling_trends.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Change (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingProducts.falling_trends.map((product) => (
                      <tr key={product.product_id} className="hover:bg-red-50">
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
    </div>
  );
}
