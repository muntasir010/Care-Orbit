import { notFound } from "next/navigation";
import { getMedicineOrderDetails } from "@/services/medicine-order/medicine-order.service";
import AdminMedicineOrderDetails from "@/components/modules/Admin/Medicine-Orders/AdminMedicineOrderDetails";

export const dynamic = "force-dynamic";

interface AdminMedicineOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminMedicineOrderDetailPage({
  params,
}: AdminMedicineOrderDetailPageProps) {
  const { id } = await params;

  const order = await getMedicineOrderDetails(id);

  if (!order) {
    notFound();
  }

  return <AdminMedicineOrderDetails order={order} />;
}
