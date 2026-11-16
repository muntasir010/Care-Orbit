"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MedicineOrder } from "@/types/medicine-order.interface";
import { cancelMedicineOrder } from "@/services/medicine-order/medicine-order.action";
import { format } from "date-fns";

interface Props {
  orders: MedicineOrder[];
}

export default function MyMedicineOrders({ orders }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    setCancellingId(orderId);

    startTransition(async () => {
      const result = await cancelMedicineOrder(orderId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }

      setCancellingId(null);
    });
  };

  if (!orders.length) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">No medicine orders yet</h2>
        <p className="mt-2 text-sm text-gray-500">
          Your medicine orders will appear here.
        </p>

        <Link
          href="/medicines"
          className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 text-white"
        >
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <h3 className="font-semibold">{order.orderNumber}</h3>
              <p className="mt-1 text-xs text-gray-500">
                {format(new Date(order.createdAt), "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="h-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                {order.status}
              </span>

              <span
                className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${
                  order.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="my-4 border-t" />

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-gray-500">Items</p>
              <p className="font-medium">
                {order.items?.length ?? 0} medicines
              </p>
            </div>

            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>

            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-semibold">
                ৳{Number(order.totalAmount).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/dashboard/medicine-orders/${order.id}`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              View Details
            </Link>

            {order.status === "PENDING" && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleCancel(order.id)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
              >
                {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
