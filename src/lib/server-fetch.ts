import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "@/services/auth/tokenHandler";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  "http://localhost:5000/api/v1";

/**
 * Endpoints that do not require automatic token refresh
 * or an access-token cookie lookup.
 */
const NO_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh-token",
];

const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const { headers, ...restOptions } = options;

  const isPublicEndpoint =
    NO_REFRESH_ENDPOINTS.includes(endpoint);

  // 1. Refresh token only for protected requests.
  if (!isPublicEndpoint) {
    await getNewAccessToken();
  }

  // 2. Read the latest access token only for protected requests.
  // The refresh may have written a new cookie.
  const accessToken = isPublicEndpoint
    ? null
    : await getCookie("accessToken");

  // 3. Preserve caller-provided headers, including the refresh
  // endpoint's explicit Cookie header.
  const requestHeaders: Record<string, string> = {
    ...(accessToken
      ? { Cookie: `accessToken=${accessToken}` }
      : {}),
    ...(headers as Record<string, string> | undefined),
  };

  // 4. Send the backend request.
  return fetch(`${BACKEND_API_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });
};

export const serverFetch = {
  get: (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, {
      ...options,
      method: "GET",
    }),

  post: (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, {
      ...options,
      method: "POST",
    }),

  put: (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, {
      ...options,
      method: "PUT",
    }),

  patch: (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, {
      ...options,
      method: "PATCH",
    }),

  delete: (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> =>
    serverFetchHelper(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
