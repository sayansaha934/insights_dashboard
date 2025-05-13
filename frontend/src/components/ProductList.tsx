import React from "react";

export default function ProductList({
  products,
  search,
  setSearch,
  loading,
  error,
  onSelect,
}: {
  products: any[];
  search: string;
  setSearch: (value: string) => void;
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Product List</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />
      {loading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Sales Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr
                key={p.product_id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => onSelect(p.product_id)}
              >
                <td className="border border-gray-300 px-4 py-2">{p.product_name}</td>
                <td className="border border-gray-300 px-4 py-2">{p.category}</td>
                <td className="border border-gray-300 px-4 py-2">₹{p.sales_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
