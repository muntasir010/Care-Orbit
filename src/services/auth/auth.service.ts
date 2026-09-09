"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { revalidateTag } from "next/cache";
import jwt from "jsonwebtoken";
import { resetPasswordSchema } from "@/zod/auth.validation";


// update user profile
export async function updateMyProfile(formData: FormData) {
  try {
    // Create a new FormData with the data property
    const uploadFormData = new FormData();
    console.log(uploadFormData)

    // Get all form fields except the file
    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== "file" && value) {
        data[key] = value;
      }
    });
    console.log(data, "data")

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
    console.log(result, "frontend result")

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
    const validatedPayload = zodValidator(
        validationPayload,
        resetPasswordSchema
    );

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
