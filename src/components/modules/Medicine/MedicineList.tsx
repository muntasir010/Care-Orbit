import type { Medicine } from "@/types/medicine.interface";
import MedicineCard from "./MedicineCard";

interface Props {
  medicines: Medicine[];
}

export default function MedicineList({ medicines }: Props) {
  if (!medicines.length) {
    return (
      <div className="rounded-xl border py-16 text-center">
        <h3 className="text-lg font-semibold">
          No medicines found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Try another search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {medicines.map((medicine) => (
        <MedicineCard key={medicine.id} medicine={medicine} />
      ))}
    </div>
  );
}
