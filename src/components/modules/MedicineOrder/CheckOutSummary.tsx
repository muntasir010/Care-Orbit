import type { Cart } from "@/types/medicine-order.interface";

interface Props {
  cart: Cart;
}

export default function CheckoutSummary({ cart }: Props) {
  const subtotal = cart.items.reduce((total, item) => {
    const price =
      item.medicine.price *
      (1 - item.medicine.discountPercent / 100);

    return total + price * item.quantity;
  }, 0);

  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="mb-5 text-lg font-semibold">
        Order Summary
      </h2>

      <div className="space-y-4">
        {cart.items.map((item) => {
          const price =
            item.medicine.price *
            (1 - item.medicine.discountPercent / 100);

          return (
            <div
              key={item.id}
              className="flex justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium">
                  {item.medicine.name}
                </p>
                <p className="text-gray-500">
                  ৳{price.toFixed(2)} × {item.quantity}
                </p>
              </div>

              <p className="font-medium">
                ৳{(price * item.quantity).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="my-5 border-t" />

      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold">
          ৳{subtotal.toFixed(2)}
        </span>
      </div>

      <div className="mt-3 flex justify-between">
        <span className="text-gray-600">Delivery fee</span>
        <span className="text-sm text-gray-500">
          Calculated at order
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Final delivery fee and total will be calculated by the server.
      </p>
    </div>
  );
}
