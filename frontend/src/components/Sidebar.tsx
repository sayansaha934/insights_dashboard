import { NavLink } from "react-router-dom";

const links = [
  { name: "Overview", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Customers", path: "/customers" },
  { name: "AI Insights", path: "/insights" },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-gray-800 shadow-md p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>
      <nav className="flex flex-col gap-3">
        {links.map(({ name, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg font-medium ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
