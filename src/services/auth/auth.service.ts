"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { revalidateTag } from "next/cache";
import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";
import {  resetPasswordSchema } from "@/zod/auth.validation";
import { deleteCookie, getCookie, setCookie } from "./tokenHandler";
import { verifyAccessToken } from "@/lib/jwtHandlers";

// update user profile
export async function updateMyProfile(formData: FormData) {
  try {
    // Create a new FormData with the data property
    const uploadFormData = new FormData();
    console.log(uploadFormData);

    // Get all form fields except the file
    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== "file" && value) {
        data[key] = value;
      }
    });
    console.log(data, "data");

    // Add the data as JSON string
    uploadFormData.append("data", JSON.stringify(data));

    // Add the file if it exists
    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      uploadFormData.append("file", file);
    }

    const response = await serverFetch.patch(`/user/update-my-profile`, {
      body: uploadFormData,
    });

    const result = await response.json();
    console.log(result, "frontend result");

    if (result.success) {
      revalidateTag("user-info", { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}

// Reset Password
export async function resetPassword(_prevState: any, formData: FormData) {
  const isEmailReset = formData.get("isEmailReset") === "true";
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  // Build validation payload
  const validationPayload = {
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate
  const validatedPayload = zodValidator(validationPayload, resetPasswordSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  try {
    if (token) {
      jwt.verify(token, process.env.RESET_PASS_TOKEN as string);
    }

    let response;

    if (isEmailReset) {
      // Case 1: Password reset from email link (with token)
      if (!email || !token) {
        return {
          success: false,
          message: "Invalid reset link",
        };
      }

      response = await serverFetch.post("/auth/reset-password", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          password: validationPayload.newPassword,
        }),
      });
    } else {
      // Case 2: Newly created user (authenticated, needPasswordChange)
      response = await serverFetch.post("/auth/reset-password", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: validationPayload.newPassword,
        }),
      });
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Password reset failed");
    }

    if (result.success) {
      revalidateTag("user-info", { expire: 0 });
    }

    return {
      success: true,
      message: "Password reset successfully! Redirecting to login...",
      redirectToLogin: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
      formData: validationPayload,
    };
  }
}

export async function getNewAccessToken() {
  try {
    const accessToken =
      await getCookie("accessToken");

    const refreshToken =
      await getCookie("refreshToken");

    /**
     * Case 1:
     * No tokens
     */

    if (!accessToken && !refreshToken) {
      return {
        tokenRefreshed: false,
        success: false,
        reason: "NO_TOKENS",
      };
    }

    /**
     * Case 2:
     * Access token exists and is valid
     */

    if (accessToken) {
      const verifiedToken =
        await verifyAccessToken(accessToken);

      if (verifiedToken.success) {
        return {
          tokenRefreshed: false,
          success: true,
          reason: "ACCESS_TOKEN_VALID",
        };
      }
    }

    /**
     * Case 3:
     * Access token invalid/expired,
     * but refresh token missing
     */

    if (!refreshToken) {
      return {
        tokenRefreshed: false,
        success: false,
        reason: "NO_REFRESH_TOKEN",
      };
    }

    /**
     * Case 4:
     * Refresh access token
     */

    const response =
      await serverFetch.post(
        "/auth/refresh-token",
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      );

    const result =
      await response.json();

    if (!result.success) {
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");

      return {
        tokenRefreshed: false,
        success: false,
        reason: "REFRESH_FAILED",
        message:
          result.message ||
          "Token refresh failed",
      };
    }

    /**
     * Read new cookies
     */

    const setCookieHeaders =
      response.headers.getSetCookie();

    if (
      !setCookieHeaders ||
      setCookieHeaders.length === 0
    ) {
      throw new Error(
        "No Set-Cookie header found",
      );
    }

    let accessTokenObject: any = null;
    let refreshTokenObject: any = null;

    setCookieHeaders.forEach(
      (cookie: string) => {
        const parsedCookie =
          parseCookie(cookie);

        if (parsedCookie.accessToken) {
          accessTokenObject =
            parsedCookie;
        }

        if (parsedCookie.refreshToken) {
          refreshTokenObject =
            parsedCookie;
        }
      },
    );

    if (!accessTokenObject?.accessToken) {
      throw new Error(
        "New access token not found",
      );
    }

    if (!refreshTokenObject?.refreshToken) {
      throw new Error(
        "New refresh token not found",
      );
    }

    /**
     * Save new cookies
     */

    const isProduction = process.env.NODE_ENV === "production";

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    await setCookie("accessToken",
      accessTokenObject.accessToken,
      {
        secure: isProduction,
        httpOnly: true,

        maxAge: parseInt(
            accessTokenObject["Max-Age"],
          ) || 60 * 60,

        path: "/",

        sameSite: isProduction
          ? "none"
          : "lax",
      },
    );

    await setCookie(
      "refreshToken",
      refreshTokenObject.refreshToken,
      {
        secure: isProduction,
        httpOnly: true,

        maxAge:
          parseInt(
            refreshTokenObject["Max-Age"],
          ) ||
          60 * 60 * 24 * 90,

        path: "/",

        sameSite: isProduction
          ? "none"
          : "lax",
      },
    );

    /**
     * Success
     */

    return {
      tokenRefreshed: true,
      success: true,
      message: "Token refreshed successfully",
    };
  } catch (error: any) {
    console.error(
      "GET NEW ACCESS TOKEN ERROR:",
      error,
    );

    return {
      tokenRefreshed: false,
      success: false,
      message:
        error?.message ||
        "Something went wrong",
    };
  }
} 