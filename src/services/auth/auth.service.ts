import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateMyProfile(formData: FormData) {
  try {
    // Create a new FormData with the data property
    const uploadFormData = new FormData();

    // Get all form fields except the file
    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== "file" && value) {
        data[key] = value;
      }
    });

    // Add the data as JSON string
    uploadFormData.append("data", JSON.stringify(data));

    // Add the file if it exists
    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      uploadFormData.append("file", file);
    }

    const response = await serverFetch.patch(`/user/update-my-profile`, {
      body: uploadFormData,
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("user-info", { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}
