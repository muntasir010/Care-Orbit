/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { parseCookie } from "cookie";
import { cookies } from "next/headers";
import z from "zod";

const loginValidationZodSchema = z.object({
  email: z.string().email({
    error: "Valid email is required",
  }),
  password: z
    .string()
    .min(6, {
      error: "Password must be at least 6 characters long",
    })
    .max(18, {
      error: "Password must be at most 18 characters",
    }),
});

export const loginUser = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedFields = loginValidationZodSchema.safeParse(loginData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      };
    }

    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || "Login failed from backend",
      };
    }

    const setCookieHeaders = res.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookieStr: string) => {
        const parsedCookie = parseCookie(cookieStr) as any;

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject || !refreshTokenObject) {
      throw new Error("Tokens not found in response cookies");
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessTokenObject.accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60,
      path: accessTokenObject.Path || "/",
      sameSite: accessTokenObject["SameSite"] || "none",
    });

    cookieStore.set("refreshToken", refreshTokenObject.refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24 * 90,
      path: refreshTokenObject.Path || "/",
      sameSite: refreshTokenObject["SameSite"] || "none",
    });

    return {
      success: true,
      message: "Login successful",
    };

  } catch (error: any) {
    console.error("Login Server Action Error:", error);
    return { 
      success: false, 
      error: error?.message || "Internal Server Error" 
    };
  }
};