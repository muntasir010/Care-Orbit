import Link from "next/link";
import type { MedicineOrder } from "@/types/medicine-order.interface";

interface Props {
  order: MedicineOrder;
  payment?: string;
}

export default function OrderConfirmation({ order, payment }: Props) {
  const isPaid = order.paymentStatus === "PAID";
  const cancelled = payment === "cancelled" && !isPaid;

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
        ✓
      </div>

      <h1 className="text-2xl font-bold">Order placed successfully!</h1>

      <p className="mt-2 text-gray-500">
        Thank you for ordering from Care Orbit.
      </p>

      <div className="my-7 rounded-lg bg-gray-50 p-5 text-left">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Order ID</span>
          <span className="break-all text-right font-medium">
            {order.orderNumber || order.id}
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-gray-500">Order Status</span>
          <span className="font-medium">{order.status}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium">{order.paymentMethod}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-gray-500">Payment Status</span>
          <span className="font-medium">{order.paymentStatus}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <span className="text-gray-500">Total Amount</span>
          <span className="font-bold">
            ৳{Number(order.totalAmount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* {!isPaid && order.paymentMethod === "ONLINE" && (
        <p className="mb-5 text-sm text-orange-600">
          Your payment is not confirmed yet. You can check your
          order status before considering the payment complete.
        </p>
      )} */}
      {order.paymentMethod === "ONLINE" && !isPaid && (
        <p className="mb-5 text-sm text-orange-600">
          {cancelled
            ? "Payment was cancelled. You can retry from My Orders."
            : "We are still confirming your payment. Please refresh in a few seconds."}
        </p>
      )}

      {order.paymentMethod === "COD" && (
        <p className="mb-5 text-sm text-gray-600">
          Please pay when your order is delivered.
        </p>
      )}

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/medicines/orders"
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white"
        >
          View My Orders
        </Link>

        <Link
          href="/medicines"
          className="rounded-lg border px-6 py-3 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
