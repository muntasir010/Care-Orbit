"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";

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

export const createMedicineOrder = async (formData: FormData) => {
  try {
    const response = await serverFetch.post("/medicine-order", {
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to create order",
      };
    }

    const order = result.data;

    if (!order?.id) {
      return {
        success: false,
        message: "Order created but order ID was not returned",
      };
    }

    // COD: order creation is complete.
    if (formData.get("paymentMethod") === "COD") {
      return {
        success: true,
        message: "Order placed successfully",
        orderId: order.id,
        paymentMethod: "COD",
      };
    }

    // ONLINE: initiate Stripe payment.
    const paymentResponse = await serverFetch.post(
      `/medicine-order/${order.id}/initiate-payment`,
    );

    const paymentResult = await paymentResponse.json();

    if (
      !paymentResponse.ok ||
      !paymentResult.success ||
      !paymentResult.data?.paymentUrl
    ) {
      return {
        success: false,
        message:
          paymentResult.message ||
          "Order created, but payment initialization failed",
        orderId: order.id,
      };
    }

    return {
      success: true,
      message: "Redirecting to payment...",
      orderId: order.id,
      paymentMethod: "ONLINE",
      paymentUrl: paymentResult.data.paymentUrl,
    };
  } catch (error) {
    console.error("Create medicine order error:", error);

    return {
      success: false,
      message: "Something went wrong while placing your order",
    };
  }
};

export const updateCartItem = async (
  itemId: string,
  quantity: number,
) => {
  try {
    const response = await serverFetch.patch(
      `/cart/items/${itemId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      },
    );

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
    const response = await serverFetch.delete(
      `/cart/items/${itemId}`,
    );

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

