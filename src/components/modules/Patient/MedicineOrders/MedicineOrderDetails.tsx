"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Pencil,
  X,
  Save,
} from "lucide-react";

import type { MedicineOrder } from "@/types/medicine-order.interface";

import {
  cancelMedicineOrder,
  updateMedicineOrderShipping,
} from "@/services/medicine-order/medicine-order.action";

interface Props {
  order: MedicineOrder;
}

interface ShippingForm {
  shippingName: string;
  shippingPhone: string;
  shippingDistrict: string;
  shippingAddress: string;
}

const formatCurrency = (amount: number | string) =>
  `৳${Number(amount).toFixed(2)}`;

export default function MedicineOrderDetails({ order }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<ShippingForm>({
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingDistrict: order.shippingDistrict,
    shippingAddress: order.shippingAddress,
  });

  const canEditShipping =
    order.status === "PENDING" && order.paymentStatus === "UNPAID";

  const canCancel = order.status === "PENDING";

  const handleChange = (field: keyof ShippingForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleShippingUpdate = () => {
    if (
      !form.shippingName.trim() ||
      !form.shippingPhone.trim() ||
      !form.shippingDistrict.trim() ||
      !form.shippingAddress.trim()
    ) {
      toast.error("Please fill in all shipping information");
      return;
    }

    startTransition(async () => {
      const result = await updateMedicineOrderShipping(order.id, form);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setIsEditing(false);
      router.refresh();
    });
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await cancelMedicineOrder(order.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  const cancelEditing = () => {
    setForm({
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingDistrict: order.shippingDistrict,
      shippingAddress: order.shippingAddress,
    });

    setIsEditing(false);
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/medicine-orders"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          <h1 className="text-2xl font-bold">Order Details</h1>

          <p className="mt-1 text-sm text-gray-500">{order.orderNumber}</p>
        </div>

        {canCancel && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleCancel}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Order Information */}
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
            <strong>{new Date(order.createdAt).toLocaleString()}</strong>
          </p>
        </div>
      </section>

      {/* Medicines */}
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Package size={20} className="text-primary" />
          <h2 className="font-semibold">Ordered Medicines</h2>
        </div>

        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 border-b pb-4 last:border-0"
            >
              <div>
                <p className="font-medium">{item.name}</p>

                <p className="text-sm text-gray-500">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </p>
              </div>

              <p className="font-semibold">{formatCurrency(item.lineTotal)}</p>
            </div>
          ))}

          {!order.items?.length && (
            <p className="text-sm text-gray-500">No medicine items found.</p>
          )}
        </div>
      </section>

      {/* Shipping Information */}
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-primary" />

            <h2 className="font-semibold">Shipping Information</h2>
          </div>

          {canEditShipping && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Pencil size={15} />
              Edit Information
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Recipient Name
              </label>

              <input
                value={form.shippingName}
                onChange={(e) => handleChange("shippingName", e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone Number
              </label>

              <input
                value={form.shippingPhone}
                onChange={(e) => handleChange("shippingPhone", e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">District</label>

              <input
                value={form.shippingDistrict}
                onChange={(e) =>
                  handleChange("shippingDistrict", e.target.value)
                }
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-primary"
                required
              />

              <p className="mt-1 text-xs text-gray-500">
                Delivery fee will be recalculated if the district changes.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Full Address
              </label>

              <textarea
                value={form.shippingAddress}
                onChange={(e) =>
                  handleChange("shippingAddress", e.target.value)
                }
                rows={3}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleShippingUpdate}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                <Save size={16} />
                {isPending ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={cancelEditing}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p>Name: {order.shippingName}</p>
            <p>Phone: {order.shippingPhone}</p>
            <p>District: {order.shippingDistrict}</p>
            <p>Address: {order.shippingAddress}</p>

            {canEditShipping && (
              <p className="pt-2 text-xs text-blue-600">
                You can edit your shipping information while this order is
                pending and unpaid.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Payment Summary */}
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          <h2 className="font-semibold">Payment Summary</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>{formatCurrency(order.discount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{formatCurrency(order.deliveryFee)}</span>
          </div>

          <div className="flex justify-between border-t pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
