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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"

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
            const authenticationResponse = await fetch("/api/auth/register", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    username: creds.username,
                    email: creds.email,
                    password: creds.password,
                    firstName: creds.first_name,
                    lastName: creds.last_name,
                }),
            })

            if (authenticationResponse.status === 201) {
                toast({
                    title: "Account created successfully!",
                    description: "youre being redirected",
                })

                const result = await signIn("credentials", {
                    username: creds.username,
                    password: creds.password,
                    redirect: false,
                })
                if (result?.error) {
                    toast({
                        title: result.error,
                        variant: "destructive",
                    })
                } else {
                    toast({
                        title: "Login Successful",
                    })
                    router.refresh()
                }
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: e.message || "something went wrong!!",
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
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        className="p-3 rounded-xl"
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
                        className="rounded-xl"
                        id="password"
                        placeholder="password"
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
                        className="rounded-xl"
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
                            className="rounded-xl"
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
                            className="rounded-xl"
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
                    className="w-full font-bold p-4 rounded-xl"
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
