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
    const formData = new FormData();

    formData.append("shippingName", payload.shippingName);
    formData.append("shippingPhone", payload.shippingPhone);
    formData.append("shippingAddress", payload.shippingAddress);
    formData.append("paymentMethod", payload.paymentMethod);

    // Multipart form-data sends this as a string.
    formData.append("items", JSON.stringify(payload.items));

    if (payload.prescription) {
      formData.append("prescription", payload.prescription);
    }

    const response = await serverFetch.post("/medicine-order", {
      body: formData,
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
