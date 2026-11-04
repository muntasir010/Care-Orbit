import { serverFetch } from "@/lib/server-fetch";
import type { Cart } from "@/types/medicine-order.interface";

export const getMyCart = async (): Promise<Cart | null> => {
  try {
    const response = await serverFetch.get("/cart");

    const result = await response.json();

    console.log("My Cart API Response:", result);

    if (!response.ok || !result.success) {
      return null;
    }

    return result.data ?? null;
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return null;
  }
};
