"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

/**
 * validation schema for the User form
 */
export const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters.",
        })
        .or(z.literal("")),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    isActive: z.boolean().default(true),
})

export type AdminUserCreateForm = z.infer<typeof formSchema>

/**
 * User form Component
 *
 * @param userId : all the user properties with optional values
 */
export function UserForm({ userId }: { userId?: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            name: "",
            isActive: false,
        },
    })

    const onSubmit = async (creds: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            if (!userId) {
                const firstName = creds.name.split(" ")[0]
                const lastName = creds.name.split(" ")[1] || ""
                const createdUserResp = await fetch("/api/auth/register", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        username: creds.username,
                        email: creds.email,
                        password: creds.password,
                        firstName,
                        lastName,
                    }),
                })

                if (createdUserResp.status === 201) {
                    toast({
                        title: "User created Successfully!",
                    })
                    router.replace("/admin/dashboard/users")
                }
            } else {
                const firstName = creds.name.split(" ")[0]
                const lastName = creds.name.split(" ")[1] || ""
                const updateUserResp = await fetch(`/api/user/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PATCH",
                    body: JSON.stringify({
                        username: creds.username,
                        email: creds.email,
                        password: creds.password,
                        firstName,
                        lastName,
                    }),
                })

                if (updateUserResp.status === 200) {
                    toast({
                        title: "User updated Successfully!",
                    })
                    router.replace("/admin/dashboard/users")
                }
            }
        } catch (e) {
            console.error("error creating user: ", e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            setIsLoading(true)
            fetch(`/api/user/${userId}`)
                .then(res => res.json())
                .then(data => {
                    form.setValue("username", data.username)
                    form.setValue("email", data.email)
                    form.setValue("name", data.name)
                    form.setValue("isActive", data.isActive)
                })
                .catch(err => {
                    console.error(err)
                })
                .finally(() => setIsLoading(false))
        }
    }, [userId, form])

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="johndoe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is the user's unique username.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The user's email address.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The user's full name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!userId && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="••••••••"
                                                        {...field}
                                                        className="pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                prev => !prev
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Must be at least 8 characters.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Active Status</FormLabel>
                                        <FormDescription>
                                            This user will be able to log in if
                                            active.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push("/admin/dashboard/users")
                            }
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Saving...
                                </span>
                            ) : userId ? (
                                "Update User"
                            ) : (
                                "Create User"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
