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
