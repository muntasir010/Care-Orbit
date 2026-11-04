import MedicineFilters from "@/components/modules/Medicine/MedicineFilters";
import MedicineList from "@/components/modules/Medicine/MedicineList";
import MedicineSearch from "@/components/modules/Medicine/MedicineSearch";
import {
  getAllMedicines,
  getMedicineCategories,
} from "@/services/medicine/medicine.service";

interface Props {
  searchParams: Promise<{
    searchTerm?: string;
    categoryId?: string;
  }>;
}

export default async function MedicinesPage({ searchParams }: Props) {
  const params = await searchParams;

  const query = new URLSearchParams();

  if (params.searchTerm) {
    query.set("searchTerm", params.searchTerm);
  }

  if (params.categoryId) {
    query.set("categoryId", params.categoryId);
  }

  const [medicines, categories] = await Promise.all([
    getAllMedicines(query.toString()),
    getMedicineCategories(),
  ]);

  return (
    <main className="space-y-8 px-6 md:px-12 lg:px-16 py-10">
      <div>
        <h1 className="text-3xl font-bold">
          Medicine Store
        </h1>
        <p className="mt-2 text-gray-500">
          Find the medicines you need.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_280px]">
        <MedicineSearch />
        <MedicineFilters categories={categories} />
      </div>

      <MedicineList medicines={medicines} />
    </main>
  );
}
