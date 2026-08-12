"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerZodValidationSchema } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";
import { zodValidator } from "@/lib/zodValidator";
import { serverFetch } from "@/lib/server-fetch";

export const registerPatient = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (zodValidator(payload, registerZodValidationSchema).success === false) {
      return zodValidator(payload, registerZodValidationSchema);
    }

    const validatedPayload: any = zodValidator(
      payload,
      registerZodValidationSchema,
    ).data;

    const registerData = {
      password: validatedPayload.password,
      patient: {
        name: validatedPayload.name,
        email: validatedPayload.email,
        address: validatedPayload.address,
      },
    };

    const newFormData = new FormData();

    newFormData.append("data", JSON.stringify(registerData));

    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    const res = await serverFetch.post("/user/create-patient", {
      body: newFormData,
    });

    const result = await res.json();

    if (!result.success) {
      return result;
    }

    // Registration succeeded — attempt login which will redirect
    const loginResult = await loginUser(_currentState, formData);

    // If loginUser returns (no redirect), return its result
    // If loginUser redirects, the redirect exception is thrown and caught below
    return loginResult;
  } catch (error: any) {
    console.log(error);
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them (from loginUser)
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration Failed! Please try again.",
    };
  }
};
