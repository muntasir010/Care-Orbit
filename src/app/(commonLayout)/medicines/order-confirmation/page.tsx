import { notFound } from "next/navigation";
import {
  getMedicineOrderById,
  syncMedicineOrderPayment,
} from "@/services/medicine-order/medicine-order.service";
import OrderConfirmation from "@/components/modules/MedicineOrder/OrderConfirmation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  searchParams: Promise<{
    orderId?: string;
    payment?: string;
  }>;
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { orderId, payment } = await searchParams;
  if (!orderId) notFound();

  const order =
    payment === "success"
      ? ((await syncMedicineOrderPayment(orderId)) ??
        (await getMedicineOrderById(orderId)))
      : await getMedicineOrderById(orderId);

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <OrderConfirmation order={order} payment={payment} />
    </main>
  );
}
