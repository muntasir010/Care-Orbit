"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { CartItem as CartItemType } from "@/types/medicine-order.interface";

import {
  removeCartItem,
  updateCartItem,
} from "@/services/medicine-order/medicine-order.action";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isPending, startTransition] = useTransition();

  const medicine = item.medicine;

  const unitPrice =
    medicine.price * (1 - medicine.discountPercent / 100);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > medicine.stock) {
      return;
    }

    setQuantity(newQuantity);

    startTransition(async () => {
      const result = await updateCartItem(
        item.id,
        newQuantity,
      );

      if (result.success) {
        toast.success("Cart updated");
      } else {
        setQuantity(item.quantity);
        toast.error(result.message);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeCartItem(item.id);

      if (result.success) {
        toast.success("Medicine removed from cart");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-full shrink-0 rounded-lg bg-gray-50 sm:w-24">
        {medicine.image ? (
          <Image
            src={medicine.image}
            alt={medicine.name}
            fill
            sizes="96px"
            className="rounded-lg object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">{medicine.name}</h3>

        <p className="mt-1 text-sm text-gray-500">
          {medicine.genericName}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {medicine.strength || medicine.dosageForm}
        </p>

        <p className="mt-2 font-semibold text-primary">
          ৳{unitPrice.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isPending || quantity <= 1}
            onClick={() => handleQuantityChange(quantity - 1)}
            className="rounded-md border p-2 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-6 text-center font-medium">
            {quantity}
          </span>

          <button
            type="button"
            disabled={isPending || quantity >= medicine.stock}
            onClick={() => handleQuantityChange(quantity + 1)}
            className="rounded-md border p-2 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="font-semibold">
          ৳{(unitPrice * quantity).toFixed(2)}
        </p>

        <button
          type="button"
          disabled={isPending}
          onClick={handleRemove}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 size={15} />
          Remove
        </button>
      </div>
    </div>
  );
}
