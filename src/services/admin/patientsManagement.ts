"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";

export async function getPatients(queryString?: string) {
    try {
        const searchParams = new URLSearchParams(queryString);
        const page = searchParams.get("page") || "1";
        const searchTerm = searchParams.get("searchTerm") || "all";
        const response = await serverFetch.get(`/patient${queryString ? `?${queryString}` : ""}`, {
            next: {
                tags: [
                    "patients-list",
                    `patients-page-${page}`,
                    `patients-search-${searchTerm}`,
                ],
                revalidate: 180, // faster patient list updates
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

export async function getPatientById(id: string) {
    try {
        const response = await serverFetch.get(`/patient/${id}`, {
            next: {
                tags: [`patient-${id}`, "patients-list"],
                revalidate: 180, // more responsive patient profile updates
            }
        })
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