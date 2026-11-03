"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { Medicine } from "@/types/medicine.interface";
import { addMedicineToCart } from "@/services/medicine/medicine.action";

interface Props {
  medicine: Medicine;
}

export default function MedicineDetails({ medicine }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const discountedPrice =
    medicine.price *
    (1 - medicine.discountPercent / 100);

  const handleAddToCart = () => {
    startTransition(async () => {
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
    <div className="grid gap-10 md:grid-cols-2">
      <div className="relative flex min-h-[350px] items-center justify-center rounded-xl bg-gray-50">
        {medicine.image ? (
          <Image
            src={medicine.image}
            alt={medicine.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
          />
        ) : (
          <p className="text-gray-400">No image available</p>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-gray-500">
            {medicine.category?.name || medicine.dosageForm}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {medicine.name}
          </h1>

          <p className="mt-2 text-gray-500">
            Generic name: {medicine.genericName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-primary">
            ৳{discountedPrice.toFixed(2)}
          </span>

          {medicine.discountPercent > 0 && (
            <span className="text-gray-400 line-through">
              ৳{medicine.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
          <p><strong>Dosage form:</strong> {medicine.dosageForm}</p>
          <p><strong>Strength:</strong> {medicine.strength || "N/A"}</p>
          <p><strong>Pack size:</strong> {medicine.packSize || "N/A"}</p>
          <p><strong>Stock:</strong> {medicine.stock}</p>
        </div>

        {medicine.description && (
          <p className="leading-7 text-gray-600">
            {medicine.description}
          </p>
        )}

        {medicine.requiresPrescription && (
          <p className="rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
            A valid prescription is required for this medicine.
          </p>
        )}

        <div className="flex items-center gap-3">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity
          </label>

          <input
            id="quantity"
            type="number"
            min={1}
            max={medicine.stock}
            value={quantity}
            onChange={(event) => {
              const value = Number(event.target.value);
              setQuantity(
                Math.min(medicine.stock, Math.max(1, value || 1)),
              );
            }}
            className="w-20 rounded-lg border px-3 py-2"
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending || medicine.stock < 1}
          className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white disabled:opacity-50"
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
