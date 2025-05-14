import React from "react";
import StatCard from "./StatCard";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ProductOverview({ data }: { data: any }) {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Product Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Products" value={data.total_products} />
        <StatCard
          label="Avg Product Price"
          value={`$${data.avg_product_price.toFixed(2)}`}
        />
      </div>

      {/* Best Selling Product */}
      <div className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold mb-2">Best Selling Product</h3>
        <p className="text-base font-semibold text-gray-700">
          <span className="mr-1">Product Name:</span>
          <button
            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            onClick={() =>
              navigate(`/product/${data.best_selling_product[0].product_id}`)
            }
          >
            {data.best_selling_product[0].product_name}
          </button>
        </p>

        <p>
          <strong>Sales Count:</strong>{" "}
          {data.best_selling_product[0].sales_count}
        </p>
        <p>
          <strong>Revenue:</strong> $
          {data.best_selling_product[0].revenue.toFixed(2)}
        </p>
      </div>

      {/* Most Problematic Product */}
      <div className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold mb-2">Most Problematic Product</h3>
        <p>
          <strong>Product Name:</strong>{" "}
          <button
            className="text-blue-500 hover:text-blue-700 underline font-medium"
            onClick={() =>
              navigate(
                `/product/${data.most_problematic_product[0].product_id}`
              )
            } // Navigate to product profile
          >
            {data.most_problematic_product[0].product_name}
          </button>
        </p>
        <p>
          <strong>Issue Count:</strong>{" "}
          {data.most_problematic_product[0].issue_count}
        </p>
      </div>

      {/* Frequently Bought Together */}
      {data.frequently_bought_together && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Frequently Bought Together</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Product Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Sales Price
                </th>
              </tr>
            </thead>
            <tbody>
              {data.frequently_bought_together.map((product: any) => (
                <tr key={product.product_id} className="hover:bg-blue-50">
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 underline font-medium"
                      onClick={() => navigate(`/product/${product.product_id}`)} // Navigate to product profile
                    >
                      {product.product_name}
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${product.sales_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
