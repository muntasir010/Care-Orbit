"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { Medicine } from "@/types/medicine.interface";
import { addMedicineToCart } from "@/services/medicine/medicine.action";

interface Props {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: Props) {
  const [quantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const discountedPrice =
    medicine.price *
    (1 - medicine.discountPercent / 100);

  const handleAddToCart = () => {
    startTransition(async () => {
      console.log("Medicine Card ID:", medicine.id);
      const result = await addMedicineToCart({
        medicineId: medicine.id,
        quantity,
      });

      if (result.success) {
        toast.success(result.message || "Added to cart");
      } else {
        toast.error(result.message || "Could not add to cart");
      }
    });
  };
  
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/medicines/${medicine.id.trim()}`}>
        <div className="relative flex h-48 items-center justify-center bg-gray-50">
          {medicine.image ? (
            <Image
              src={medicine.image}
              alt={medicine.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain p-5"
            />
          ) : (
            <span className="text-sm text-gray-400">
              No image available
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs text-gray-500">
            {medicine.category?.name || medicine.dosageForm}
          </p>

          <Link href={`/medicines/${medicine.id.trim()}`}>
            <h3 className="mt-1 line-clamp-1 font-semibold hover:text-primary">
              {medicine.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-500">
            {medicine.genericName}
          </p>

          {medicine.strength && (
            <p className="text-xs text-gray-500">
              Strength: {medicine.strength}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">
            ৳{discountedPrice.toFixed(2)}
          </span>

          {medicine.discountPercent > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ৳{medicine.price.toFixed(2)}
              </span>
              <span className="text-xs text-green-600">
                {medicine.discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        <p className="text-xs text-gray-500">
          {medicine.stock > 0
            ? `${medicine.stock} available`
            : "Out of stock"}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending || medicine.stock < 1}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Adding..."
            : medicine.stock < 1
              ? "Out of Stock"
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
