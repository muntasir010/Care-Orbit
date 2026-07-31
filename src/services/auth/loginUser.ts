/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { parseCookie } from "cookie";
import { JwtPayload } from "jsonwebtoken";
import z from "zod";
import jwt from "jsonwebtoken";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandler";
// import { cookies } from "next/headers";

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
    const redirectTo = formData.get("redirect") || null;
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

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Login failed!",
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

    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
    });

    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    // const cookieStore = await cookies();

    if (!jwtSecret) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return {
        success: false,
        message: "Server misconfiguration: missing JWT secret",
      };
    }

    let verifiedToken: JwtPayload | string;
    try {
      verifiedToken = jwt.verify(accessTokenObject.accessToken, jwtSecret) as JwtPayload | string;
    } catch (err) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return { success: false, message: "Invalid or expired token" };
    }

    if (typeof verifiedToken === "string") {
      return { success: false, message: "Invalid token" };
    }

    const userRole: UserRole = verifiedToken.role;

    if (redirectTo) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        redirect(requestedPath);
      } else {
        redirect(getDefaultDashboardRoute(userRole));
      }
    } else {
      redirect(getDefaultDashboardRoute(userRole));
    }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { 
      success: false, 
      message: process.env.NODE_ENV === "development" ? error.message : "Login Failed! Incorrect password or email." 
    };
  }
};