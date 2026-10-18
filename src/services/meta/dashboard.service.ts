"use server"

import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "../auth/getUserInfo";


// export async function getDashboardMetaData() {
//     try {
//         const userInfo = await getUserInfo();
//         const cacheTag = `${userInfo.role.toLowerCase()}-dashboard-meta`;

//         const response = await serverFetch.get("/meta", {
//             next: {
//                 tags: [cacheTag, "dashboard-meta", "meta-data"],
//                 // Faster revalidation for dashboard (30 seconds)
//                 // Dashboard stats should update frequently for real-time feel
//                 revalidate: 30,
//             }
//         });
//         const result = await response.json();
//         return result;
//     } catch (error: any) {
//         console.log(error);
//         return {
//             success: false,
//             message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
//         };
//     }
// }

export async function getDashboardMetaData() {
  try {
    const userInfo = await getUserInfo();

    const role = userInfo?.role?.toLowerCase();

    if (!role) {
      throw new Error("Unable to determine the authenticated user's role.");
    }

    const response = await serverFetch.get("/meta", {
      next: {
        tags: [
          `${role}-dashboard-meta`,
          "dashboard-meta",
          "meta-data",
        ],
        revalidate: 30,
      },
    });

    const result = await response.json();

    if (!response.ok || !result?.success || result.data == null) {
      console.error("Dashboard API failed:", {
        status: response.status,
        result,
      });

      throw new Error(
        result?.message || "Failed to fetch dashboard metadata."
      );
    }

    return result;
  } catch (error) {
    console.error("getDashboardMetaData error:", error);
    throw error;
  }
}
