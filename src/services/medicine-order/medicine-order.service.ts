import { serverFetch } from "@/lib/server-fetch";
import type { Cart, MedicineOrder } from "@/types/medicine-order.interface";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
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

export const syncMedicineOrderPayment = async (id: string): Promise<MedicineOrder | null> => {
  try {
    const response = await serverFetch.post(`/medicine-order/${id}/sync-payment`);
    const result: ApiResponse<MedicineOrder> = await response.json();
    return response.ok && result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const getMyMedicineOrders = async (
  queryString = "",
) => {
  try {
    const response = await serverFetch.get(
      `/medicine-order/my${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const result: ApiResponse<MedicineOrder[]> =
      await response.json();

    return result;
  } catch (error) {
    console.error("getMyMedicineOrders error:", error);
    return null;
  }
};

export const getAdminMedicineOrders = async (
  queryString = "",
) => {
  try {
    const response = await serverFetch.get(
      `/medicine-order${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const result: ApiResponse<MedicineOrder[]> =
      await response.json();

    return result;
  } catch (error) {
    console.error("getAdminMedicineOrders error:", error);
    return null;
  }
};

export const getMedicineOrderDetails = async (
  orderId: string,
) => {
  try {
    const response = await serverFetch.get(
      `/medicine-order/${orderId}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const result: ApiResponse<MedicineOrder> =
      await response.json();

    return result.data;
  } catch (error) {
    console.error("getMedicineOrderDetails error:", error);
    return null;
  }
};