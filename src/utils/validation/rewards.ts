import { z } from "zod"
/**
 * reward forrm validation schema
 */

export const rwardFormValidationSchema = z.object({
    userId: z
        .string()
        .min(1, "Please select a user")
        .uuid({ message: "Invalid user id" }),
    rewardId: z
        .string()
        .min(1, "Please select a reward")
        .uuid({ message: "Invalid Reward id" }),
})
