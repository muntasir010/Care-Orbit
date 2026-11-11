"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type {
  Cart,
  MedicinePaymentMethod,
} from "@/types/medicine-order.interface";

import {
  createMedicineOrder,
  initiateMedicineOrderPayment,
} from "@/services/medicine-order/medicine-order.action";
import CheckoutSummary from "./CheckoutSummary";
import { BANGLADESH_DISTRICTS } from "@/lib/medicine-delivery";

interface Props {
  cart: Cart;
}

export default function CheckoutForm({ cart }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<MedicinePaymentMethod>("ONLINE");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cart.items.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      !shippingName.trim() ||
      !shippingPhone.trim() ||
      !shippingAddress.trim()
    ) {
      toast.error("Please fill in all shipping information");
      return;
    }

    startTransition(async () => {
      const result = await createMedicineOrder({
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        shippingDistrict: district,
        paymentMethod,
        items: cart.items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
        })),
      });

      if (!result.success || !result.data?.id) {
        toast.error(result.message);
        return;
      }

      const orderId = result.data.id as string;

      if (paymentMethod === "ONLINE") {
        const paymentResult = await initiateMedicineOrderPayment(orderId);

        if (!paymentResult.success || !paymentResult.paymentUrl) {
          toast.error(
            paymentResult.message || "Could not start online payment",
          );

          // The order may already exist. Keep its ID so the
          // customer can return to it and retry payment.
          router.push(`/medicines/order-confirmation?orderId=${orderId}`);
          return;
        }

        window.location.replace(paymentResult.paymentUrl);
        return;
      }

      toast.success("Your order has been placed successfully");

      router.push(`/medicines/order-confirmation?orderId=${orderId}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-5 text-lg font-semibold">Shipping Information</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="shippingName"
                  className="mb-2 block text-sm font-medium"
                >
                  Recipient Name
                </label>

                <input
                  id="shippingName"
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingPhone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone Number
                </label>

                <input
                  id="shippingPhone"
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  pattern="^(?:\+?88)?01[3-9]\d{8}$"
                  title="Enter a valid Bangladeshi mobile number"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="shippingDistrict"
                  className="text-sm font-medium"
                >
                  Select District
                </label>

                <select
                  id="shippingDistrict"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose your district</option>

                  {BANGLADESH_DISTRICTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="shippingAddress"
                  className="mb-2 block text-sm font-medium"
                >
                  Delivery Address
                </label>

                <textarea
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House, road, area, city..."
                  rows={4}
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="mt-1"
                />

                <div>
                  <p className="font-medium">Online Payment</p>
                  <p className="text-sm text-gray-500">
                    Pay securely through Stripe Checkout.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1"
                />

                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Pay when your medicine is delivered.
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <CheckoutSummary cart={cart} district={district} />

          <button
            type="submit"
            disabled={isPending || !cart.items.length}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Processing..."
              : paymentMethod === "ONLINE"
                ? "Place Order & Pay"
                : "Place Order"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Your final order amount will be calculated securely by the server.
          </p>
        </aside>
      </div>
    </form>
  );
}
