import { serverFetch } from "@/lib/server-fetch";
import type { Cart, MedicineOrder } from "@/types/medicine-order.interface";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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

export const getMedicineOrderById = async (
  id: string,
): Promise<MedicineOrder | null> => {
  try {
    const response = await serverFetch.get(`/medicine-order/${id}`);
    const result: ApiResponse<MedicineOrder> = await response.json();

    if (!response.ok || !result.success) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
};