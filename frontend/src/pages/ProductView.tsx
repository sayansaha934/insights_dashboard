import { useEffect, useState } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import ProductList from "../components/ProductList";
import ProductProfile from "../components/ProductProfile";

export default function ProductView() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product list based on search input
  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}products`, {
        params: { search },
      });
      setProducts(res.data);
    } catch (error) {
      setError("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch detailed profile for a selected product
  const fetchProductProfile = async (productId: string) => {
    setLoadingProductDetails(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}products/${productId}/profile`);
      setProductDetails(res.data);
      setSelectedProductId(productId);
    } catch (error) {
      setError("Failed to fetch product details");
    } finally {
      setLoadingProductDetails(false);
    }
  };

  return (
    <div className="p-4 h-screen w-full">
      {productDetails && productDetails.product ? (
        <ProductProfile
          productDetails={productDetails}
          onBack={() => setProductDetails(null)}
        />
      ) : (
        <ProductList
          products={products}
          search={search}
          setSearch={setSearch}
          loading={loadingProducts}
          error={error}
          onSelect={fetchProductProfile}
        />
      )}
    </div>
  );
}
