"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { IAppointmentFormData } from "@/types/appointment.interface";
import { revalidateTag } from "next/cache";

export async function createAppointment(data: IAppointmentFormData) {
    try {
        const response = await serverFetch.post("/appointment", {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        if (result.success) {
            revalidateTag('my-appointments', { expire: 0 });
            revalidateTag('appointments-list', { expire: 0 });
            revalidateTag('patient-dashboard-meta', { expire: 0 });
            revalidateTag('admin-dashboard-meta', { expire: 0 });
            revalidateTag('doctor-dashboard-meta', { expire: 0 });
        }

        return result;
    } catch (error: any) {
        console.error("Error creating appointment:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to book appointment",
        };
    }
}

export async function createAppointmentWithPayLater(data: IAppointmentFormData) {
    try {
        const response = await serverFetch.post("/appointment/pay-later", {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        if (result.success) {
            revalidateTag('my-appointments', { expire: 0 });
            revalidateTag('appointments-list', { expire: 0 });
            revalidateTag('patient-dashboard-meta', { expire: 0 });
            revalidateTag('admin-dashboard-meta', { expire: 0 });
            revalidateTag('doctor-dashboard-meta', { expire: 0 });
        }
        return result;
    } catch (error: any) {
        console.error("Error creating appointment with pay later:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to book appointment",
        };
    }
}
