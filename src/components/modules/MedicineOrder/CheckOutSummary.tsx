import type { Cart } from "@/types/medicine-order.interface";

interface Props {
  cart: Cart;
  shippingCity: string;
}

const getDeliveryFee = (city: string): number | null => {
  const normalizedCity = city.trim().toLowerCase();

  if (!normalizedCity) {
    return null;
  }

  if (["feni", "dhaka"].includes(normalizedCity)) {
    return 80;
  }

  return 120;
};

export default function CheckoutSummary({
  cart,
  shippingCity,
}: Props) {
  const subtotal = cart.items.reduce((total, item) => {
    const price =
      item.medicine.price *
      (1 - item.medicine.discountPercent / 100);

    return total + price * item.quantity;
  }, 0);

  const deliveryFee = getDeliveryFee(shippingCity);

  const totalAmount =
    deliveryFee !== null ? subtotal + deliveryFee : null;

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

        {deliveryFee !== null ? (
          <span className="font-semibold">
            ৳{deliveryFee.toFixed(2)}
          </span>
        ) : (
          <span className="text-sm text-gray-500">
            Select your city
          </span>
        )}
      </div>

      {deliveryFee !== null && (
        <div className="mt-3 flex justify-between text-sm">
          <span className="text-gray-600">
            Delivery location
          </span>

          <span className="font-medium capitalize">
            {shippingCity}
          </span>
        </div>
      )}

      <div className="my-5 border-t" />

      <div className="flex justify-between text-base">
        <span className="font-semibold">Total</span>

        <span className="font-bold text-primary">
          {totalAmount !== null
            ? `৳${totalAmount.toFixed(2)}`
            : "Select city"}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Delivery charge: ৳80 in Feni and Dhaka, ৳120 in
        all other cities. Final amount is calculated and
        verified by the server.
      </p>
    </div>
  );
}