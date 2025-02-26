import { z } from "zod"

const usernameValidationSchema = z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
    })
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(10, { message: "Username must be at most 10 characters long." })

const registerUserCredValidationSchema = z.object({
    username: usernameValidationSchema,
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(50, { message: "Name must be at most 50 characters long." }),
    email: z.string().email({ message: "Invalid email address." }),
    firstName: z
        .string()
        .min(3, {
            message: "First name must be at minimum 3 characters long.",
        }),
    lastName: z
        .string()
        .min(3, {
            message: "First name must be at minimum 3 characters long.",
        }),
    password: z.string(),
})

const loginUserSchemaValidation = z.object({
    username: usernameValidationSchema,
    password: z
        .string()
        .min(5, { message: "Password must be at least 5 characters long." }),
})

export { registerUserCredValidationSchema, loginUserSchemaValidation }
