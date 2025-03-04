import { z } from "zod"

/*
 *  validation of fields as uuid
 */
export const idValidationSchema = z.string().uuid()

export const multipleIdValidationSchema = z.array(idValidationSchema)

/*
 *
 *   username validation
 */
const usernameValidationSchema = z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
    })
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(10, { message: "Username must be at most 10 characters long." })

/*
 *
 *   username validation
 */
const registerUserCredValidationSchema = z.object({
    username: usernameValidationSchema,
    email: z.string().email({ message: "Invalid email address." }),
    firstName: z.string().min(3, {
        message: "First name must be at minimum 3 characters long.",
    }),
    lastName: z.string().min(3, {
        message: "First name must be at minimum 3 characters long.",
    }),
    password: z.string(),
})

/*
 *
 * credentials for validation of login request
 */
const loginUserSchemaValidation = z.object({
    username: usernameValidationSchema,
    password: z
        .string()
        .min(5, { message: "Password must be at least 5 characters long." }),
})

/*
 *  credentails for updating user details
 */

const userUpdateValidationSchema = z.object({
    username: usernameValidationSchema.optional(),
    email: z.string().email({ message: "Invalid email address." }).optional(),
    firstName: z
        .string()
        .min(3, {
            message: "First name must be at minimum 3 characters long.",
        })
        .optional(),
    lastName: z
        .string()
        .min(3, {
            message: "First name must be at minimum 3 characters long.",
        })
        .optional(),
    isActive: z.boolean().optional(),
    password: z.string().optional(),
})

export {
    registerUserCredValidationSchema,
    loginUserSchemaValidation,
    userUpdateValidationSchema,
}
