import Link from "next/link";
import type { MedicineOrder } from "@/types/medicine-order.interface";

interface Props {
  order: MedicineOrder;
}

export default function MedicineOrderDetails({ order }: Props) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            {order.orderNumber}
          </p>
        </div>

        <Link
          href="/dashboard/medicine-orders"
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Back to Orders
        </Link>
      </div>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 font-semibold">Order Information</h2>

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <p>
            Order Status: <strong>{order.status}</strong>
          </p>
          <p>
            Payment Status: <strong>{order.paymentStatus}</strong>
          </p>
          <p>
            Payment Method: <strong>{order.paymentMethod}</strong>
          </p>
          <p>
            Order Date:{" "}
            <strong>
              {new Date(order.createdAt).toLocaleString()}
            </strong>
          </p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 font-semibold">Ordered Medicines</h2>

        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 border-b pb-4 last:border-0"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ৳{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                </p>
              </div>

              <p className="font-semibold">
                ৳{Number(item.lineTotal).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 font-semibold">Shipping Information</h2>

        <div className="space-y-2 text-sm">
          <p>Name: {order.shippingName}</p>
          <p>Phone: {order.shippingPhone}</p>
          <p>District: {order.shippingDistrict}</p>
          <p>Address: {order.shippingAddress}</p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 font-semibold">Payment Summary</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{Number(order.subtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>৳{Number(order.discount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>৳{Number(order.deliveryFee).toFixed(2)}</span>
          </div>

          <div className="border-t pt-3 flex justify-between text-base font-bold">
            <span>Total</span>
            <span>৳{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
