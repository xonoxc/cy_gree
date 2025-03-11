"use client"
import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertCircle, AlertTriangle, Users } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for users
const users = [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" },
    { id: "user3", name: "Mike Johnson" },
    { id: "user4", name: "Sarah Williams" },
    { id: "user5", name: "David Brown" },
]

const formSchema = z.object({
    userId: z.string({
        required_error: "Please select a sender user.",
    }),
    toUserId: z.string().optional(), // Allow "none" as a valid value
    message: z.string().min(5, {
        message: "Message must be at least 5 characters.",
    }),
    importanceLevel: z.enum(["Low", "Medium", "High"], {
        required_error: "Please select an importance level.",
    }),
    sendToAll: z.boolean().default(false),
})

export function NotificationForm({ notification }: { notification?: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: notification?.userId || "",
            toUserId: notification?.toUserId || "none", // Default to "none" instead of ""
            message: notification?.message || "",
            importanceLevel: notification?.importanceLevel || "Low",
            sendToAll: false,
        },
    })

    const sendToAll = form.watch("sendToAll")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            // Here you would normally send the data to your API
            console.log(values)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: notification
                    ? "Notification updated"
                    : "Notification sent",
                description: notification
                    ? "The notification has been updated successfully."
                    : "The notification has been sent successfully.",
            })

            router.push("/dashboard/notifications")
        } catch (error) {
            toast({
                title: "Something went wrong.",
                description:
                    "Your notification was not sent. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Importance level badge variant and icon
    const getImportanceDetails = (level: string) => {
        switch (level) {
            case "Low":
                return {
                    variant: "outline",
                    icon: <Bell className="h-4 w-4 mr-1" />,
                }
            case "Medium":
                return {
                    variant: "warning",
                    icon: <AlertCircle className="h-4 w-4 mr-1" />,
                }
            case "High":
                return {
                    variant: "destructive",
                    icon: <AlertTriangle className="h-4 w-4 mr-1" />,
                }
            default:
                return { variant: "secondary", icon: null }
        }
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From User (Sender)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a sender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The user who is sending this
                                        notification.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sendToAll"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Send to all users</FormLabel>
                                        <FormDescription>
                                            If checked, this notification will
                                            be sent to all users in the system.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {!sendToAll && (
                            <FormField
                                control={form.control}
                                name="toUserId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            To User (Recipient)
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a recipient" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    No specific recipient
                                                </SelectItem>
                                                {users.map(user => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The user who will receive this
                                            notification. Leave empty for system
                                            notifications.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Your plastic collection has been approved."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The notification message that will be
                                        displayed to the user(s).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="importanceLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Importance Level</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select importance level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {["Low", "Medium", "High"].map(
                                                level => {
                                                    const importanceDetails =
                                                        getImportanceDetails(
                                                            level
                                                        )
                                                    return (
                                                        <SelectItem
                                                            key={level}
                                                            value={level}
                                                        >
                                                            <div className="flex items-center">
                                                                <Badge
                                                                    variant={
                                                                        importanceDetails.variant as any
                                                                    }
                                                                    className="flex items-center mr-2"
                                                                >
                                                                    {
                                                                        importanceDetails.icon
                                                                    }
                                                                    {level}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The importance level of this
                                        notification.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-medium mb-2">
                                Notification Preview
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                            From:{" "}
                                            {users.find(
                                                u =>
                                                    u.id ===
                                                    form.watch("userId")
                                            )?.name || "Sender"}
                                        </span>
                                        {sendToAll ? (
                                            <Badge
                                                variant="secondary"
                                                className="flex items-center"
                                            >
                                                <Users className="h-3 w-3 mr-1" />
                                                All Users
                                            </Badge>
                                        ) : (
                                            form.watch("toUserId") &&
                                            form.watch("toUserId") !==
                                                "none" && (
                                                <span className="text-sm text-muted-foreground">
                                                    To:{" "}
                                                    {
                                                        users.find(
                                                            u =>
                                                                u.id ===
                                                                form.watch(
                                                                    "toUserId"
                                                                )
                                                        )?.name
                                                    }
                                                </span>
                                            )
                                        )}
                                    </div>
                                    {form.watch("importanceLevel") && (
                                        <Badge
                                            variant={
                                                getImportanceDetails(
                                                    form.watch(
                                                        "importanceLevel"
                                                    )
                                                ).variant as any
                                            }
                                            className="flex items-center"
                                        >
                                            {
                                                getImportanceDetails(
                                                    form.watch(
                                                        "importanceLevel"
                                                    )
                                                ).icon
                                            }
                                            {form.watch("importanceLevel")}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm">
                                    {form.watch("message") ||
                                        "Notification message will appear here."}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                    Just now
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push("/dashboard/notifications")
                            }
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Sending...
                                </span>
                            ) : notification ? (
                                "Update Notification"
                            ) : (
                                "Send Notification"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
