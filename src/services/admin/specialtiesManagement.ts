/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createSpecialtyZodSchema } from "@/zod/specialties.validation";

export async function createSpecialty(_prevState: any, formData: FormData) {
  try {
    const payload = {
      title: formData.get("title") as string,
    };
    if (zodValidator(payload, createSpecialtyZodSchema).success === false) {
      return zodValidator(payload, createSpecialtyZodSchema);
    }

    const validatedPayload = zodValidator(
      payload,
      createSpecialtyZodSchema,
    ).data;

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(validatedPayload));

    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    const response = await serverFetch.post("/specialties", {
      body: newFormData,
    });

    const result = await response.json();

    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}

export async function getSpecialities() {
    try {
        const response = await serverFetch.get("/specialties")
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}
