import { z } from "zod"

export const adminNotificationSchema = z.object({
    userId: z.string({
        required_error: "Please select a sender user.",
    }),
    toUserId: z.string().optional(),
    message: z.string().min(5, {
        message: "Message must be at least 5 characters.",
    }),
    importanceLevel: z.enum(["Low", "Medium", "High"], {
        required_error: "Please select an importance level.",
    }),
    sendToAll: z.boolean().default(false),
})
