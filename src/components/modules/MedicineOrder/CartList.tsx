"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import type { Cart } from "@/types/medicine-order.interface";
import CartItem from "./CartItem";

import { clearMyCart } from "@/services/medicine-order/medicine-order.action";

interface Props {
  cart: Cart;
}

export default function CartList({ cart }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClearCart = () => {
    startTransition(async () => {
      const result = await clearMyCart();

      if (result.success) {
        toast.success("Cart cleared successfully");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Shopping Cart ({cart.totalItems})
        </h2>

        {cart.items.length > 0 && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleClearCart}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isPending ? "Clearing..." : "Clear Cart"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
