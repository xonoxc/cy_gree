import { z } from "zod"
import { idValidationSchema } from "../user"

/*
 *  create collection Schema
 *
 */
export const collectionCreateValidationSchema = z.object({
    amount_collected: z.number({ message: "Invalid collection amount" }),
    pic: z.string({ message: "pic must be a string" }),
})

/**
 * Admin collection create schema
 */

export const adminCollcetionCreateSchema = z.object({
    userId: idValidationSchema,
    imagePath: z.string().min(1, {
        message: "Please provide an image URL.",
    }),
    amount: z.coerce.number().min(0.1, {
        message: "Amount must be at least 0.1 kg.",
    }),
    status: z.enum(["Pending", "Claimed", "Collected"], {
        required_error: "Please select a status.",
    }),
    claimedBy: z.string().optional(),
})
