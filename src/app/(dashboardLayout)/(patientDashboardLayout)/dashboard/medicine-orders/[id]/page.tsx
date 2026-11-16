import MedicineOrderDetails from "@/components/modules/Patient/MedicineOrders/MedicineOrderDetails";
import { getMedicineOrderById } from "@/services/medicine-order/medicine-order.service";
import { MedicineOrder } from "@/types/medicine-order.interface";
import { notFound } from "next/navigation";

interface MedicineOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MedicineOrderDetailPage({
  params,
}: MedicineOrderDetailPageProps) {
  const { id } = await params;

  const response = await getMedicineOrderById(id);

  if (!response) {
    notFound();
  }

  const medicineOrder: MedicineOrder = response;

  return (
    <div className="container mx-auto px-4 py-8">
      <MedicineOrderDetails order={medicineOrder} />
    </div>
  );
}