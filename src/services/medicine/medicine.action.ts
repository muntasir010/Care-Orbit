"use server";

import { serverFetch } from "@/lib/server-fetch";

interface AddToCartPayload {
  medicineId: string;
  quantity: number;
}

export const addMedicineToCart = async (
  payload: AddToCartPayload,
) => {
  try {
    const response = await serverFetch.post("/cart/items", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error("Add to cart error:", error);

    return {
      success: false,
      message: "Failed to add medicine to cart",
    };
  }
};
