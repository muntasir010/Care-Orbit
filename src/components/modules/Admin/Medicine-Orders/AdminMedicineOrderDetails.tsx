"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  UserRound,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
} from "lucide-react";

import type {
  MedicineOrder,
  OrderStatus,
} from "@/types/medicine-order.interface";

import {
  markMedicineOrderCODAsPaid,
  updateMedicineOrderStatus,
} from "@/services/medicine-order/medicine-order.action";

interface Props {
  order: MedicineOrder;
}

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const formatCurrency = (amount: number | string) =>
  `৳${Number(amount).toFixed(2)}`;

export default function AdminMedicineOrderDetails({ order }: Props) {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status as OrderStatus,
  );

  const [isPending, startTransition] = useTransition();

  const availableStatuses =
    statusTransitions[order.status as OrderStatus] ?? [];

  const isCOD = order.paymentMethod === "COD";
  const isPaid = order.paymentStatus === "PAID";

  const handleStatusUpdate = () => {
    if (selectedStatus === order.status) {
      toast.info("Please select a different status");
      return;
    }

    startTransition(async () => {
      const result = await updateMedicineOrderStatus(order.id, selectedStatus);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  const handleCODPayment = () => {
    if (!isCOD || order.status !== "DELIVERED" || isPaid) {
      return;
    }

    startTransition(async () => {
      const result = await markMedicineOrderCODAsPaid(order.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard/medicine-orders"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Medicine Orders
          </Link>

          <h1 className="text-2xl font-bold">Order Details</h1>

          <p className="mt-1 text-sm text-gray-500">
            Order #{order.orderNumber}
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            statusStyles[order.status as OrderStatus]
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Ordered Medicines */}
          <section className="rounded-xl border bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <Package className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">Ordered Medicines</h2>
            </div>

            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {item.medicine?.name ?? item.name}
                    </p>

                    {item.medicine?.strength && (
                      <p className="text-sm text-gray-500">
                        {item.medicine.strength}
                      </p>
                    )}

                    {item.medicine?.dosageForm && (
                      <p className="text-xs text-gray-500">
                        {item.medicine.dosageForm}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity} ×{" "}
                      {formatCurrency(item.unitPrice)}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {formatCurrency(item.lineTotal)}
                  </p>
                </div>
              ))}

              {!order.items?.length && (
                <p className="text-sm text-gray-500">
                  No medicine items found.
                </p>
              )}
            </div>
          </section>

          {/* Shipping Information */}
          <section className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">Shipping Information</h2>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {order.shippingName}
              </p>

              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.shippingPhone}
              </p>

              <p>
                <span className="font-medium">District:</span>{" "}
                {order.shippingDistrict}
              </p>

              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.shippingAddress}
              </p>

              {order.note && (
                <p>
                  <span className="font-medium">Note:</span> {order.note}
                </p>
              )}
            </div>
          </section>

          {/* Patient Information */}
          <section className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">Patient Information</h2>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.patient?.name ?? order.shippingName}
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.patient?.email ?? "Not available"}
              </p>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span>{formatCurrency(order.discount)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">Payment Information</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span
                  className={`font-semibold ${
                    isPaid ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {isCOD && order.status === "DELIVERED" && !isPaid && (
              <button
                type="button"
                onClick={handleCODPayment}
                disabled={isPending}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={17} />
                {isPending ? "Processing..." : "Mark COD as Paid"}
              </button>
            )}

            {isCOD && isPaid && (
              <p className="mt-4 text-sm font-medium text-green-600">
                COD payment has been confirmed.
              </p>
            )}
          </section>

          {/* Status Management */}
          <section className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Truck className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">Manage Order</h2>
            </div>

            {availableStatuses.length > 0 ? (
              <>
                <label
                  htmlFor="order-status"
                  className="mb-2 block text-sm font-medium"
                >
                  Update Order Status
                </label>

                <select
                  id="order-status"
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value as OrderStatus)
                  }
                  className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value={order.status}>Current: {order.status}</option>

                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={isPending || selectedStatus === order.status}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Updating..." : "Update Status"}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                This order has reached its final status. No further status
                changes are available.
              </p>
            )}

            <p className="mt-4 text-xs text-gray-500">
              Available status changes follow the backend order transition
              rules.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
