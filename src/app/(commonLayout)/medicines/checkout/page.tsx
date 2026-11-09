import { redirect } from "next/navigation";
import { getMyCart } from "@/services/medicine-order/medicine-order.service";
import CheckoutForm from "@/components/modules/MedicineOrder/CheckoutForm";

export default async function CheckoutPage() {
  const cart = await getMyCart();

  if (!cart || !cart.items?.length) {
    redirect("/medicines");
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        <p className="mt-2 text-gray-500">
          Complete your shipping and payment information.
        </p>
      </div>

      <CheckoutForm cart={cart} />
    </main>
  );
}
