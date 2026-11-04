"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { MedicineCategory } from "@/types/medicine.interface";

interface Props {
  categories: MedicineCategory[];
}

export default function MedicineFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

    router.push(`/medicines?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium">
        Filter by category
      </label>

      <select
        value={searchParams.get("categoryId") || ""}
        onChange={(event) =>
          handleCategoryChange(event.target.value)
        }
        className="w-full rounded-lg border px-3 py-3"
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
