import { z } from "zod"

/**
 * admin claim reward schema
 */

export const claimRewardSchema = z.object({
    userId: z.string({ required_error: "User ID is required" }),
    rewardId: z.string({ required_error: "Reward ID is required" }),
})
