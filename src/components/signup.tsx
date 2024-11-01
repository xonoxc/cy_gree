"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { auth } from "@/services/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface RegistrationCreds {
    username: string
    email: string
    first_name: string
    last_name: string
    password: string
}

export default function RegistrationForm() {
    const [creds, setCreds] = useState<RegistrationCreds>({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = async () => {
        setIsLoading(true)
        try {
            const role = await auth.register({ ...creds })

            if (role) {
                toast({
                    title: "Account created successfully!",
                    description: "youre being redirected",
                })
                router.replace(
                    `/${role === "Client" ? "usr" : "agent"}/dashboard`
                )
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: error.message || "something went wrong!!",
                description: "please try again later",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">
                    <span className="font-bold text-5xl text-green-400">
                        Create
                    </span>{" "}
                    account
                </CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* <div className="grid grid-cols-2 gap-6"> */}
                {/*     <Button variant="outline"> */}
                {/*         <Github className="mr-2 h-4 w-4" /> */}
                {/*         Github */}
                {/*     </Button> */}
                {/*     <Button variant="outline"> */}
                {/*         {/* <Google className="mr-2 h-4 w-4" /> */}
                {/*         Google */}
                {/*     </Button> */}
                {/* </div> */}
                {/* <div className="relative"> */}
                {/*     <div className="absolute inset-0 flex items-center"> */}
                {/*         <span className="w-full border-t" /> */}
                {/*     </div> */}
                {/*     <div className="relative flex justify-center text-xs uppercase"> */}
                {/*         <span className="bg-background px-2 text-muted-foreground"> */}
                {/*             Or continue with */}
                {/*         </span> */}
                {/*     </div> */}
                {/* </div> */}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={creds.email}
                        onChange={e => {
                            setCreds(prev => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }}
                        placeholder="m@example.com"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        value={creds.password}
                        onChange={e => {
                            setCreds(prev => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }}
                        type="password"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        value={creds.username}
                        onChange={e => {
                            setCreds(prev => ({
                                ...prev,
                                username: e.target.value,
                            }))
                        }}
                        type="text"
                        required
                    />
                </div>

                <div className="grid">
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">first name</Label>
                        <Input
                            id="first_name"
                            value={creds.first_name}
                            onChange={e => {
                                setCreds(prev => ({
                                    ...prev,
                                    first_name: e.target.value,
                                }))
                            }}
                            type="text"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input
                            id="last_name"
                            value={creds.last_name}
                            onChange={e => {
                                setCreds(prev => ({
                                    ...prev,
                                    last_name: e.target.value,
                                }))
                            }}
                            type="text"
                            required
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full font-bold"
                    onClick={onSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 animate-spin" />
                            Signing up...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </CardFooter>
            <div className="link flex items-center justify-center">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-sm text-green-300">
                    Sign In
                </Link>
            </div>
        </div>
    )
}
