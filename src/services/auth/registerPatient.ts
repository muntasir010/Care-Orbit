"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginUser } from './loginUser';

import z from "zod";

const registerZodValidationSchema = z
  .object({
    name: z.string().min(1, {
      error: "Name is required",
    }),
    address: z.string().optional(),
    email: z.email({ message: "Valid email is required" }),
    password: z
      .string()
      .min(6, {
        error: "Password must be at most 100 characters long",
      })
      .max(18, {
        error: "Password must be at most 18 characters long",
      }),
    confirmPassword: z.string().min(6, {
      error:
        "Confirm password is required and must be at least 6 characters long",
    }),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    error: "Password do not match",
    path: ["confirmPassword"]
  });

export const registerPatient = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const validationData = {
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validatedFields =
      registerZodValidationSchema.safeParse(validationData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        }),
      };
    }

    const registerData = {
      password: formData.get("password"),
      patient: {
        name: formData.get("name"),
        email: formData.get("email"),
        address: formData.get("address"),
      },
    };

    const newFormData = new FormData();

    newFormData.append("data", JSON.stringify(registerData));

    const res = await fetch(
      "http://localhost:5000/api/v1/user/create-patient",
      {
        method: "POST",
        body: newFormData,
      },
    )
    
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
    return { error: "Registration failed" };
  }
};
