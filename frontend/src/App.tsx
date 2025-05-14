import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import CustomerView from "./pages/CustomerView";
import ProductView from "./pages/ProductView";
import AIInsightView from "./pages/AIInsightView";
import ProductProfile from "./components/ProductProfile";
import CustomerProfile from "./components/CustomerProfile";
export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/customers" element={<CustomerView />} />
          <Route path="/products" element={<ProductView />} />
          <Route path="/insights" element={<AIInsightView />} />
          <Route path="/product/:id" element={<ProductProfile />} />
          <Route path="/customer/:id" element={<CustomerProfile />} />
        </Routes>
      </main>
    </div>
  );
}
