import { z } from "zod"
/**
 * reward forrm validation schema
 */

export const rwardFormValidationSchema = z.object({
    userId: z.string().min(1, "Please select a user"),
    rewardId: z.string().min(1, "Please select a reward"),
})
