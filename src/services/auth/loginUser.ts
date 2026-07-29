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
    console.log("action to server function", redirectTo);
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
        error: result?.message || "Login failed from backend",
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
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60, // seconds
      path: "/",
      sameSite: "lax",
    });

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 90, // seconds
      path: "/",
      sameSite: "lax",
    });

    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      console.error('JWT_ACCESS_SECRET not defined during login verification. Clearing cookies and returning error.');
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return { success: false, error: 'Server misconfiguration: missing JWT secret' };
    }

    let verifiedToken: JwtPayload | string;
    try {
      verifiedToken = jwt.verify(accessTokenObject.accessToken, jwtSecret) as JwtPayload | string;
    } catch (err) {
      console.error('Token verification failed during login:', err);
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return { success: false, error: 'Invalid or expired token' };
    }

    if (typeof verifiedToken === 'string') {
      return { success: false, error: 'Invalid token' };
    }

    const userRole: UserRole = verifiedToken.role;

    if (!result.success) {
      throw new Error('Login Failed!');
    }

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
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log(error);
    return { error: "Login failed" };
  }
};
