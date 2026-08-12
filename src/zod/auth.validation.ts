/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";

export const registerZodValidationSchema = z
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
    path: ["confirmPassword"],
  });

export const loginValidationZodSchema = z.object({
    email: z.email({
        message: "Email is required",
    }),
    password: z.string("Password is required").min(6, {
        error: "Password is required and must be at least 6 characters long",
    }).max(100, {
        error: "Password must be at most 100 characters long",
    }),
});
