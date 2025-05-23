import React, { useEffect, useState } from "react";
import axios from "axios";
import AnomalousCustomers from "../components/AnomalousCustomers";
import TrendingProducts from "../components/TrendingProducts";

export default function AIInsightView() {
  const [anomalousCustomers, setAnomalousCustomers] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchAnomalousCustomers();
    fetchTrendingProducts();
  }, []);

  // Fetch anomalous customers
  const fetchAnomalousCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}insights/anomalies`);
      setAnomalousCustomers(res.data);
    } catch (err) {
      setError("Failed to fetch anomalous customers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch trending products
  const fetchTrendingProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}insights/trends`);
      setTrendingProducts(res.data);
    } catch (err) {
      setError("Failed to fetch trending products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <AnomalousCustomers
        data={anomalousCustomers}
        loading={loading}
        error={error}
      />
      <TrendingProducts
        data={trendingProducts}
        loading={loading}
        error={error}
      />
    </div>
  );
}
