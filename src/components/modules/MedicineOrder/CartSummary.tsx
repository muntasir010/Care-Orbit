import Link from "next/link";

interface Props {
  subtotal: number;
  totalItems: number;
}

export default function CartSummary({
  subtotal,
  totalItems,
}: Props) {
  return (
    <div className="h-fit rounded-xl border bg-white p-5">
      <h2 className="text-lg font-semibold">
        Order Summary
      </h2>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Total Items
          </span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Subtotal
          </span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">
              ৳{subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/medicines/checkout"
        className="mt-6 block w-full rounded-lg bg-primary px-4 py-3 text-center font-medium text-white transition hover:opacity-90"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/medicines"
        className="mt-3 block text-center text-sm text-gray-500 hover:text-primary"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
