import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import CustomerList from "../components/CustomerList";
import CustomerProfile from "../components/CustomerProfile";

export default function CustomerView() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);

  // Fetch customer list based on search input
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}customers`, { params: { search } })
      .then((res) => setCustomers(res.data));
  }, [search]);

  // Fetch detailed profile for a selected customer
  const fetchProfile = async (id: string) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}customers/${id}/profile`);
    setSelected(res.data);
  };

  return (
    <div className="p-4 h-screen w-full">
      {selected ? (
        <CustomerProfile profile={selected} onBack={() => setSelected(null)} />
      ) : (
        <CustomerList
          customers={customers}
          search={search}
          setSearch={setSearch}
          onSelect={fetchProfile}
        />
      )}
    </div>
  );
}
