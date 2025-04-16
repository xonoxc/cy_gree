import { z } from "zod"
import { states } from "@/constants/states/states"

/**
 * User profile creation form schema
 */

export const AdminUserProfileCreateSchema = z.object({
    profilePic: z.string().optional(),
    role: z.enum(["Client", "Agent"]),
    address: z.string().optional(),
    city: z.string().min(2, {
        message: "City must be at least 2 characters.",
    }),
    state: z
        .string({ message: "state name must be a valid string" })
        .refine(value => states.includes(value), {
            message: "Invalid state value",
        })
        .optional(),
    country: z.string().default("India"),
    phoneNumber: z
        .string()
        .regex(/^\d{10}$/, {
            message: "Phone number must be 10 digits.",
        })
        .optional(),
    totalPlasticRecycled: z.coerce.number().min(0),
    earnedPoints: z.coerce.number().min(0),
})
