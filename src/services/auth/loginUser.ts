"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";
import { parseCookie } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandler";
import { loginValidationZodSchema } from "@/zod/auth.validation";
import { zodValidator } from "@/lib/zodValidator";
import { serverFetch } from "@/lib/server-fetch";

export const loginUser = async (
  _currentState: any,
  formData: FormData,
): Promise<any> => {
  try {
    /**
     * 1. Get redirect path
     */

    const redirectTo = formData.get("redirect");

    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    /**
     * 2. Login payload
     */

    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    /**
     * 3. Validate login payload
     */

    const validation = zodValidator(
      payload,
      loginValidationZodSchema,
    );

    if (!validation.success) {
      return validation;
    }

    const validatedPayload = validation.data;

    /**
     * 4. Login API
     * /auth/login is excluded from automatic refresh
     * inside serverFetch.
     */

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    /**
     * 5. Check API response
     */

    if (!result.success) {
      throw new Error(
        result.message || "Login failed",
      );
    }

    /**
     * 6. Read Set-Cookie headers
     */

    const setCookieHeaders =
      res.headers.getSetCookie();

    if (
      !setCookieHeaders ||
      setCookieHeaders.length === 0
    ) {
      throw new Error(
        "No Set-Cookie header found",
      );
    }

    setCookieHeaders.forEach((cookie: string) => {
      const parsedCookie = parseCookie(cookie);

      if (parsedCookie["accessToken"]) {
        accessTokenObject = parsedCookie;
      }

      if (parsedCookie["refreshToken"]) {
        refreshTokenObject = parsedCookie;
      }
    });

    /**
     * 7. Validate tokens
     */

    if (!accessTokenObject) {
      throw new Error(
        "Access token not found in cookies",
      );
    }

    if (!refreshTokenObject) {
      throw new Error(
        "Refresh token not found in cookies",
      );
    }

    /**
     * 8. Save access token
     */

    const isProduction =
      process.env.NODE_ENV === "production";

    await setCookie(
      "accessToken",
      accessTokenObject.accessToken,
      {
        secure: isProduction,
        httpOnly: true,

        maxAge:
          parseInt(
            accessTokenObject["Max-Age"],
          ) || 60 * 60,

        path: "/",

        sameSite: isProduction
          ? "none"
          : "lax",
      },
    );

    /**
     * 9. Save refresh token
     */

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
     * 10. Verify access token
     */

    const verifiedToken: JwtPayload | string =
      jwt.verify(
        accessTokenObject.accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      );

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const userRole =
      verifiedToken.role as UserRole;

    /**
     * 11. Handle needPasswordChange
     */

    if (result.data?.needPasswordChange) {
      const requestedPath =
        redirectTo?.toString();

      if (
        requestedPath &&
        isValidRedirectForRole(
          requestedPath,
          userRole,
        )
      ) {
        redirect(
          `/reset-password?redirect=${encodeURIComponent(
            requestedPath,
          )}`,
        );
      }

      redirect("/reset-password");
    }

    /**
     * 12. Normal successful login
     */

    if (redirectTo) {
      const requestedPath =
        redirectTo.toString();

      if (
        isValidRedirectForRole(
          requestedPath,
          userRole,
        )
      ) {
        /**
         * IMPORTANT:
         * No ?loggedIn=true
         */
        redirect(requestedPath);
      }
    }

    /**
     * 13. Default dashboard
     */

    redirect(
      getDefaultDashboardRoute(userRole),
    );
  } catch (error: any) {
    /**
     * Next.js redirect throws a special error.
     * We must re-throw it.
     */

    if (
      error?.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error(
      "LOGIN ERROR:",
      error,
    );

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error?.message
          : "Login Failed. You might have entered incorrect email or password.",
    };
  }
};