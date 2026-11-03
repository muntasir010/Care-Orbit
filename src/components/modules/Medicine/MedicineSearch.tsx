"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MedicineSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("searchTerm") || "",
  );

  const handleSearch = (value: string) => {
    setSearch(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("searchTerm", value.trim());
    } else {
      params.delete("searchTerm");
    }

    router.push(`/medicines?${params.toString()}`);
  };

  return (
    <input
      type="search"
      value={search}
      onChange={(event) => handleSearch(event.target.value)}
      placeholder="Search medicine by name or generic name..."
      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
    />
  );
}
