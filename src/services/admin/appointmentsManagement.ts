/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from './../../lib/server-fetch';

export async function getAppointments(queryString?: string) {
    try {
        const searchParams = new URLSearchParams(queryString);
        const page = searchParams.get("page") || "1";
        const status = searchParams.get("status") || "all";
        const response = await serverFetch.get(`/appointment${queryString ? `?${queryString}` : ""}`, {
            next: {
                tags: [
                    "appointments-list",
                    `appointments-page-${page}`,
                    `appointments-status-${status}`,
                ],
                revalidate: 120, // real-time appointment updates for critical data
            },
        });
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