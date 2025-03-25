import { z } from "zod"

/**
 * bade creation form
 */

export const badgeAdminFormSchema = z.object({
    userId: z.string({
        required_error: "Please select a user.",
    }),
    name: z.enum(
        ["Recycler", "Eco_Warrior", "Green_Ambassador", "Sustainability_Hero"],
        {
            required_error: "Please select a badge type.",
        }
    ),
})
