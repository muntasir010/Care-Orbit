"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { CreateMedicineOrderPayload } from "@/types/medicine-order.interface";

const CART_PATH = "/medicines/cart";

const handleResponse = async (response: Response) => {
  const result = await response.json();

  if (!response.ok || !result.success) {
    return {
      success: false,
      message: result.message || "Something went wrong",
      data: null,
    };
  }

  revalidatePath(CART_PATH);

  return {
    success: true,
    message: result.message,
    data: result.data,
  };
};

export const createMedicineOrder = async (
  payload: CreateMedicineOrderPayload,
) => {
  try {
    const response = await serverFetch.post("/medicine-order", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Order creation failed",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error("Create medicine order error:", error);

    return {
      success: false,
      message: "Something went wrong while creating your order",
      data: null,
    };
  }
};

// Keep your existing initiateMedicineOrderPayment function below.
export const initiateMedicineOrderPayment = async (orderId: string) => {
  try {
    const response = await serverFetch.post(
      `/medicine-order/${orderId}/initiate-payment`,
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Payment initiation failed",
        paymentUrl: null,
      };
    }

    return {
      success: true,
      message: result.message,
      paymentUrl: result.data?.paymentUrl,
    };
  } catch (error) {
    console.error("Payment initiation error:", error);

    return {
      success: false,
      message: "Unable to initiate payment",
      paymentUrl: null,
    };
  }
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  try {
    const response = await serverFetch.patch(`/cart/items/${itemId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Update cart item error:", error);

    return {
      success: false,
      message: "Failed to update cart item",
      data: null,
    };
  }
};

export const removeCartItem = async (itemId: string) => {
  try {
    const response = await serverFetch.delete(`/cart/items/${itemId}`);

    return await handleResponse(response);
  } catch (error) {
    console.error("Remove cart item error:", error);

    return {
      success: false,
      message: "Failed to remove cart item",
      data: null,
    };
  }
};

export const clearMyCart = async () => {
  try {
    const response = await serverFetch.delete("/cart");

    return await handleResponse(response);
  } catch (error) {
    console.error("Clear cart error:", error);

    return {
      success: false,
      message: "Failed to clear cart",
      data: null,
    };
  }
};

export const cancelMedicineOrder = async (orderId: string) => {
  try {
    const response = await serverFetch.patch(
      `/medicine-order/${orderId}/cancel`,
      {
        method: "PATCH",
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to cancel order",
      };
    }

    revalidatePath("/dashboard/medicine-orders");
    revalidatePath(`/dashboard/medicine-orders/${orderId}`);
    revalidatePath("/admin/medicine-orders");

    return {
      success: true,
      message: result.message || "Order cancelled successfully",
    };
  } catch (error) {
    console.error("cancelMedicineOrder error:", error);

    return {
      success: false,
      message: "Something went wrong while cancelling the order",
    };
  }
};

export const updateMedicineOrderStatus = async (
  orderId: string,
  status: string,
) => {
  try {
    const response = await serverFetch.patch(
      `/medicine-order/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to update order status",
      };
    }

    revalidatePath("/admin/medicine-orders");
    revalidatePath(`/admin/medicine-orders/${orderId}`);
    revalidatePath("/dashboard/medicine-orders");
    revalidatePath(`/dashboard/medicine-orders/${orderId}`);

    return {
      success: true,
      message: result.message || "Order status updated successfully",
    };
  } catch (error) {
    console.error("updateMedicineOrderStatus error:", error);

    return {
      success: false,
      message: "Something went wrong while updating the order",
    };
  }
};
