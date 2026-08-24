import z from "zod";

export const updatePatientZodSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").optional(),
    contactNumber: z.string().min(10, "Contact Number must be at least 10 characters long").optional(),
    address: z.string().optional(),
});