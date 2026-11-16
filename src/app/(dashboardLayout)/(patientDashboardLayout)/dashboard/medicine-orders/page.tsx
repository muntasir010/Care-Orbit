import MyMedicineOrders from "@/components/modules/Patient/MedicineOrders/MyMedicineOrders";
import { getMyMedicineOrders } from "@/services/medicine-order/medicine-order.service";

export const dynamic = "force-dynamic";

export default async function MyMedicineOrdersPage() {
  const response = await getMyMedicineOrders("page=1&limit=20");

  const orders = response?.data ?? [];

  return (
    <main className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">My Medicine Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and track all your medicine orders.
        </p>
      </div>

      <MyMedicineOrders orders={orders} />
    </main>
  );
}