import { notFound } from "next/navigation";
import { getMedicineOrderById } from "@/services/medicine-order/medicine-order.service";
import OrderConfirmation from "@/components/modules/MedicineOrder/OrderConfirmation";

interface Props {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: Props) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  const order = await getMedicineOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <OrderConfirmation order={order} />
    </main>
  );
}
