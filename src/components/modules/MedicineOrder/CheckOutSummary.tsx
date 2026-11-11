import type { Cart } from "@/types/medicine-order.interface";
import { getMedicineDeliveryFee } from "@/lib/medicine-delivery";

interface Props {
  cart: Cart;
  district: string;
}

export default function CheckoutSummary({
  cart,
  district,
}: Props) {
  const subtotal = cart.items.reduce((total, item) => {
    const price =
      item.medicine.price *
      (1 - item.medicine.discountPercent / 100);

    return total + price * item.quantity;
  }, 0);

  const deliveryFee = getMedicineDeliveryFee(district);

  const totalAmount = subtotal + deliveryFee;

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

      <div className="mt-3 flex justify-between gap-3">
        <div>
          <p className="text-gray-600">Delivery fee</p>

          {district && (
            <p className="text-xs text-gray-500">
              {district} district
            </p>
          )}
        </div>

        <span className="font-semibold">
          {district
            ? `৳${deliveryFee.toFixed(2)}`
            : "Select district"}
        </span>
      </div>

      <div className="my-5 border-t" />

      <div className="flex justify-between text-base">
        <span className="font-semibold">Total</span>

        <span className="font-bold">
          ৳{totalAmount.toFixed(2)}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {district
          ? `Delivery charge for ${district} is ৳${deliveryFee}. Final amount is confirmed by the server.`
          : "Select your district to calculate the delivery charge."}
      </p>
    </div>
  );
}
