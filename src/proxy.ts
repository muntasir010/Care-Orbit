import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isValidRedirectForRole,
  UserRole,
} from "./lib/auth-utils";

import {getCookie} from "./services/auth/tokenHandler";

import { getUserInfo } from "./services/auth/getUserInfo";
import { verifyResetPasswordToken } from "./lib/jwtHandlers";
import { getNewAccessToken } from "./services/auth/auth.service";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  const hasTokenRefreshedParam =
    request.nextUrl.searchParams.has("tokenRefreshed");

  /**
   * 1. Get access token
   */

  let accessToken = (await getCookie("accessToken")) || null;

  let userRole: UserRole | null = null;

  /**
   * 2. Verify access token
   */

  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      );

      if (typeof verifiedToken !== "string") {
        userRole = (verifiedToken as JwtPayload).role as UserRole;
      }
    } catch {
      /**
       * Access token expired/invalid.
       *
       * Don't delete refresh token.
       * We may refresh it below.
       */
    }
  }

  /**
   * 3. RESET PASSWORD
   * IMPORTANT:
   * Reset password email flow must NOT trigger
   * access-token refresh.
   */

  if (pathname === "/reset-password") {
    const email = request.nextUrl.searchParams.get("email");
    const token = request.nextUrl.searchParams.get("token");

    /**
     * Case 1: Logged-in user needs password change
     */

    if (accessToken) {
      try {
        const userInfo = await getUserInfo();

        if (userInfo?.needPasswordChange) {
          return NextResponse.next();
        }

        /**
         * Already authenticated and doesn't need
         * password change.
         */
        if (userRole) {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole),
              request.url,
            ),
          );
        }
      } catch {
        // Continue to email reset token validation
      }
    }

    /**
     * Case 2: Email reset password
     */

    if (email && token) {
      try {
        const verifiedToken =
          await verifyResetPasswordToken(token);

        if (!verifiedToken.success) {
          return NextResponse.redirect(
            new URL(
              "/forgot-password?error=expired-link",
              request.url,
            ),
          );
        }

        if (
          !verifiedToken.payload ||
          verifiedToken.payload.email !== email
        ) {
          return NextResponse.redirect(
            new URL(
              "/forgot-password?error=invalid-link",
              request.url,
            ),
          );
        }

        return NextResponse.next();
      } catch {
        return NextResponse.redirect(
          new URL(
            "/forgot-password?error=expired-link",
            request.url,
          ),
        );
      }
    }

    /**
     * Case 3: No authentication and no reset token
     */

    const loginUrl = new URL(
      "/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "redirect",
      "/reset-password",
    );

    return NextResponse.redirect(loginUrl);
  }

  /**
   * 4. AUTH ROUTES
   * /login
   * /register
   * /forgot-password
   */

  if (isAuth && accessToken) {
    /**
     * Try to get role from token first.
     *
     * If role isn't available in JWT, get it from user info.
     */

    if (!userRole) {
      try {
        const userInfo = await getUserInfo();

        if (userInfo?.role) {
          userRole = userInfo.role as UserRole;
        }
      } catch {
        // Ignore here
      }
    }

    /**
     * If user is already logged in and visits /login
     */

    if (pathname === "/login" && userRole) {
      const redirectPath =
        request.nextUrl.searchParams.get("redirect");

      /**
       * If redirect exists and is valid for user's role,
       * use it.
       *
       * Example:
       * /login?redirect=/admin/dashboard
       */

      if (
        redirectPath &&
        isValidRedirectForRole(
          redirectPath,
          userRole,
        )
      ) {
        return NextResponse.redirect(
          new URL(
            redirectPath,
            request.url,
          ),
        );
      }

      /**
       * Otherwise go to default dashboard.
       */

      return NextResponse.redirect(
        new URL(
          getDefaultDashboardRoute(userRole),
          request.url,
        ),
      );
    }

    /**
     * Other auth routes:
     * /register
     * /forgot-password
     */

    if (userRole) {
      return NextResponse.redirect(
        new URL(
          getDefaultDashboardRoute(userRole),
          request.url,
        ),
      );
    }
  }

  /**
   * 5. TOKEN REFRESH
   * Never refresh for:
   * - auth routes
   * - reset-password
   * - already refreshed request
   */

  if (
    !hasTokenRefreshedParam &&
    !isAuth &&
    pathname !== "/reset-password"
  ) {
    const tokenRefreshResult =
      await getNewAccessToken();

    if (tokenRefreshResult?.tokenRefreshed) {
      const url = request.nextUrl.clone();

      url.searchParams.set(
        "tokenRefreshed",
        "true",
      );

      return NextResponse.redirect(url);
    }
  }

  /**
   * 6. Re-read access token
   * Refresh may have created a new access token.
   */

  accessToken =
    (await getCookie("accessToken")) || null;

  userRole = null;

  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      );

      if (typeof verifiedToken !== "string") {
        userRole = (verifiedToken as JwtPayload)
          .role as UserRole;
      }
    } catch {
      // Token still invalid
    }
  }

  /**
   * 7. If tokenRefreshed=true
   * Remove the query parameter WITHOUT creating another
   * redirect loop.
   */

  if (hasTokenRefreshedParam) {
    const url = request.nextUrl.clone();

    url.searchParams.delete("tokenRefreshed");

    /**
     * IMPORTANT:
     * Use NextResponse.next() with rewritten URL instead
     * of redirecting again.
     */

    return NextResponse.redirect(url);
  }

  /**
   * 8. Public routes
   */

  if (routerOwner === null) {
    return NextResponse.next();
  }

  /**
   * 9. Protected route without authentication
   */

  if (!accessToken || !userRole) {
    const loginUrl = new URL(
      "/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  /**
   * 10. Need password change
   */

  try {
    const userInfo = await getUserInfo();

    if (userInfo?.needPasswordChange) {
      if (pathname !== "/reset-password") {
        const resetPasswordUrl = new URL(
          "/reset-password",
          request.url,
        );

        resetPasswordUrl.searchParams.set(
          "redirect",
          pathname,
        );

        return NextResponse.redirect(
          resetPasswordUrl,
        );
      }

      return NextResponse.next();
    }

    /**
     * User doesn't need password change but trying
     * to access reset-password.
     */

    if (
      !userInfo?.needPasswordChange &&
      pathname === "/reset-password"
    ) {
      return NextResponse.redirect(
        new URL(
          getDefaultDashboardRoute(userRole),
          request.url,
        ),
      );
    }
  } catch {
    // Continue
  }

  /**
   * 11. Common protected routes
   */

  if (routerOwner === "COMMON") {
    return NextResponse.next();
  }

  /**
   * 12. Role-based routes
   */

  if (
    routerOwner === "ADMIN" ||
    routerOwner === "DOCTOR" ||
    routerOwner === "PATIENT"
  ) {
    if (userRole !== routerOwner) {
      return NextResponse.redirect(
        new URL(
          getDefaultDashboardRoute(userRole),
          request.url,
        ),
      );
    }
  }

  /**
   * 13. Everything is OK
   */

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};