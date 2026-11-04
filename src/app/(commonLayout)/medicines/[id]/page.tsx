import { notFound } from "next/navigation";
import { getMedicineById } from "@/services/medicine/medicine.service";
import MedicineDetails from "@/components/modules/Medicine/MedicineDetails";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MedicineDetailsPage({
  params,
}: Props) {

  const { id } = await params;

  const medicine = await getMedicineById(id);

  if (!medicine) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl py-10">
      <MedicineDetails medicine={medicine} />
    </main>
  );
}