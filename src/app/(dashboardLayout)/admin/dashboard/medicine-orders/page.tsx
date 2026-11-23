import type { MedicineOrder } from "@/types/medicine-order.interface";
import { getAdminMedicineOrders } from "@/services/medicine-order/medicine-order.service";
import AdminMedicineOrdersTable from "@/components/modules/Admin/Medicine-Orders/AdminMedicineOrderTable";

export const dynamic = "force-dynamic";

export default async function AdminMedicineOrdersPage() {
  const response = await getAdminMedicineOrders("limit=50&page=1");
  const orders: MedicineOrder[] = response?.data ?? [];

  return <AdminMedicineOrdersTable orders={orders} />;
}
