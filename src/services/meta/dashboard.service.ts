"use server"

import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "../auth/getUserInfo";
import { unstable_rethrow } from "next/navigation";

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
    unstable_rethrow(error);
    console.error("getDashboardMetaData error:", error);
    throw error;
  }
}
