import React, { useEffect, useState } from "react";
import axios from "axios";
import SalesOverview from "../components/SalesOverview";
import CustomerOverview from "../components/CustomerOverview";
import ProductOverview from "../components/ProductOverview";
import SupportOverview from "../components/SupportOverview";

export default function Overview() {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}overview`);
      setOverviewData(res.data);
    } catch (err) {
      setError("Failed to fetch overview data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!overviewData) {
    return null;
  }

  return (
    <div className="p-4 space-y-8">
      <SalesOverview data={overviewData.sales_overview} />
      <CustomerOverview data={overviewData.customer_overview} />
      <ProductOverview data={overviewData.product_overview} />
      <SupportOverview data={overviewData.support_overview} />
    </div>
  );
}
