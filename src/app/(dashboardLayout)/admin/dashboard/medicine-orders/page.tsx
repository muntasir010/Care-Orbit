import Link from "next/link";
import type { MedicineOrder } from "@/types/medicine-order.interface";
import { getAdminMedicineOrders } from "@/services/medicine-order/medicine-order.service";

export const dynamic = "force-dynamic";

export default async function AdminMedicineOrdersPage() {
  const response = await getAdminMedicineOrders("limit=50&page=1");

  const orders: MedicineOrder[] = response?.data ?? [];

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Medicine Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage patient medicine orders and payments.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Patient</th>
              <th className="p-4">District</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4 font-medium">
                  {order.orderNumber}
                </td>

                <td className="p-4">
                  <p>{order.patient?.name ?? order.shippingName}</p>
                  <p className="text-xs text-gray-500">
                    {order.patient?.email}
                  </p>
                </td>

                <td className="p-4">
                  {order.shippingDistrict}
                </td>

                <td className="p-4 font-semibold">
                  ৳{Number(order.totalAmount).toFixed(2)}
                </td>

                <td className="p-4">
                  <p>{order.paymentMethod}</p>
                  <p className="text-xs text-gray-500">
                    {order.paymentStatus}
                  </p>
                </td>

                <td className="p-4">
                  {order.status}
                </td>

                <td className="p-4">
                  <Link
                    href={`/admin/medicine-orders/${order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-10 text-center text-gray-500"
                >
                  No medicine orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
