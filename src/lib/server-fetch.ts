// import { getNewAccessToken } from "@/services/auth/auth.service";

// import { getCookie } from "@/services/auth/tokenHandler";

// const BACKEND_API_URL =
//   process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

// /**
//  * Endpoints that do NOT require automatic access-token refresh.
//  *
//  * These endpoints are part of authentication/public flow.
//  */
// const NO_REFRESH_ENDPOINTS = [
//   "/auth/login",
//   "/auth/register",
//   "/auth/forgot-password",
//   "/auth/reset-password",
//   "/auth/refresh-token",
// ];

// const serverFetchHelper = async (
//   endpoint: string,
//   options: RequestInit = {},
// ): Promise<Response> => {
//   const { headers, ...restOptions } = options;

//   /**
//    * 1. Refresh access token only for protected requests
//    */

//   const shouldRefreshToken = !NO_REFRESH_ENDPOINTS.includes(endpoint);

//   if (shouldRefreshToken) {
//     await getNewAccessToken();
//   }

//   /**
//    * 2. Get latest access token
//    * IMPORTANT:
//    * getNewAccessToken() may have created a new access token.
//    * So get the cookie AFTER refresh.
//    */

//   const accessToken = await getCookie("accessToken");

//   /**
//    * 3. Send request
//    */

//   const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
//     headers: {
//       Cookie: accessToken ? `accessToken=${accessToken}` : "",
//       ...headers,
//     },
//     ...restOptions,
//   });

//   return response;
// };

// export const serverFetch = {
//   get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
//     serverFetchHelper(endpoint, {
//       ...options,
//       method: "GET",
//     }),

//   post: async (
//     endpoint: string,
//     options: RequestInit = {},
//   ): Promise<Response> =>
//     serverFetchHelper(endpoint, {
//       ...options,
//       method: "POST",
//     }),

//   put: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
//     serverFetchHelper(endpoint, {
//       ...options,
//       method: "PUT",
//     }),

//   patch: async (
//     endpoint: string,
//     options: RequestInit = {},
//   ): Promise<Response> =>
//     serverFetchHelper(endpoint, {
//       ...options,
//       method: "PATCH",
//     }),

//   delete: async (
//     endpoint: string,
//     options: RequestInit = {},
//   ): Promise<Response> =>
//     serverFetchHelper(endpoint, {
//       ...options,
//       method: "DELETE",
//     }),
// };



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
