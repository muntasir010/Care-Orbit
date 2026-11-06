import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { getMyCart } from "@/services/medicine-order/medicine-order.service";

import CartList from "@/components/modules/MedicineOrder/CartList";
import CartSummary from "@/components/modules/MedicineOrder/CartSummary";

export default async function CartPage() {
  const cart = await getMyCart();

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const totalItems = cart?.totalItems ?? 0;

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Shopping Cart</h1>

        <p className="mt-2 text-gray-500">
          Review your medicines before checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border py-20 text-center">
          <ShoppingCart size={56} className="text-gray-300" />

          <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>

          <p className="mt-2 text-sm text-gray-500">
            You haven&apos;t added any medicines yet.
          </p>

          <Link
            href="/medicines"
            className="mt-6 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:opacity-90"
          >
            Browse Medicines
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_350px]">
          <CartList cart={cart!} />

          <CartSummary subtotal={subtotal} totalItems={totalItems} />
        </div>
      )}
    </main>
  );
}
