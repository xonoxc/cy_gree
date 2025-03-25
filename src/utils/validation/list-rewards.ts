import { z } from "zod"

/**
 * List Reward Form Schema
 */

export const listRewardFormSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters." })
        .max(100, { message: "Title must not exceed 100 characters." }),
    pointsRequired: z.coerce
        .number()
        .min(1, { message: "Points required must be at least 1." }),
    rewardType: z.enum(["Gift_Coupon", "Cash", "Offer"], {
        required_error: "Please select a reward type.",
    }),
})

/**
 * Update reward validation schema
 */

export const rwardUpdateValidationSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters." })
        .max(100, { message: "Title must not exceed 100 characters." })
        .optional(),
    pointsRequired: z.coerce
        .number()
        .min(1, { message: "Points required must be at least 1." })
        .optional(),
    rewardType: z.enum(["Gift_Coupon", "Cash", "Offer"]).optional(),
})
