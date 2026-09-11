"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";

export async function getDoctorOwnSchedules(queryString?: string) {
    try {
        // const response = await serverFetch.get(`/doctor-schedule/my-schedule${queryString ? `?${queryString}` : ""}`);
        const response = await serverFetch.get(`/doctor-schedule${queryString ? `?${queryString}` : ""}`, {
            next: {
                tags: ["my-schedules", "doctor-schedules-list"],
                revalidate: 180, // 3 minutes
            }
        });
        const result = await response.json();
        return {
            success: result.success,
            data: Array.isArray(result.data) ? result.data : [],
            meta: result.meta,
        };
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            data: [],
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}