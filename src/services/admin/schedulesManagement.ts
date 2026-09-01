/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createScheduleZodSchema } from "@/zod/schedule.validation";
import { revalidateTag } from "next/cache";

export async function createSchedule(_prevState: any, formData: FormData) {
    // Build validation payload
    const validationPayload = {
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
    };

    const validation = zodValidator(validationPayload, createScheduleZodSchema);

    if (!validation.success && validation.errors) {
        return {
            success: false,
            message: "Validation failed",
            formData: validationPayload,
            errors: validation.errors,
        }
    }


    if (!validation.data) {
        return {
            success: false,
            message: "Validation failed",
            formData: validationPayload,
        }
    }

    try {
        const response = await serverFetch.post("/schedule", {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validation.data),
        });

        const result = await response.json();
        if (result.success) {
            revalidateTag('schedules-list', { expire: 0 });
            revalidateTag('schedules-page-1', { expire: 0 });
        }
        return result;
    } catch (error: any) {
        console.error("Create schedule error:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to create schedule',
            formData: validationPayload
        };
    }
}