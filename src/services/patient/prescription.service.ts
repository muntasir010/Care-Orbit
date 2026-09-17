"use server"

import { serverFetch } from "@/lib/server-fetch";
import { IPrescriptionFormData } from "@/types/prescription.interface";
import { revalidateTag } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createPrescription(data: IPrescriptionFormData) {
    try {
        const response = await serverFetch.post("/prescription", {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        if (result.success) {
            revalidateTag('my-prescriptions', { expire: 0 });
            revalidateTag('my-appointments', { expire: 0 });
        }
        return result;
    } catch (error: any) {
        console.error("Error creating prescription:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to create prescription",
        };
    }
}
