import React from "react";
import StatCard from "./StatCard";

export default function ProductOverview({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Product Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Products" value={data.total_products} />
        <StatCard label="Avg Product Price" value={`₹${data.avg_product_price.toFixed(2)}`} />
      </div>
      <h3 className="text-xl font-semibold">Best Selling Product</h3>
      <p>
        Product ID: {data.best_selling_product[0].product_id}, Sales Count:{" "}
        {data.best_selling_product[0].sales_count}, Revenue: ₹
        {data.best_selling_product[0].revenue.toFixed(2)}
      </p>
      <h3 className="text-xl font-semibold">Most Problematic Product</h3>
      <p>
        Product ID: {data.most_problematic_product[0].product_id}, Issue Count:{" "}
        {data.most_problematic_product[0].issue_count}
      </p>
      {data.frequently_bought_together && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Frequently Bought Together</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Sales Price</th>
              </tr>
            </thead>
            <tbody>
              {data.frequently_bought_together.map((product: any) => (
                <tr key={product.product_id} className="hover:bg-blue-50">
                  <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                  <td className="border border-gray-300 px-4 py-2">₹{product.sales_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
