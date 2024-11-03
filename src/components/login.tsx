"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth } from "@/services/auth"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface LoginCreds {
    username: string
    password: string
}

export function LoginForm() {
    const [creds, setCreds] = useState<LoginCreds>({
        username: "",
        password: "",
    })
    const [isLoading, setLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmission = async () => {
        setLoading(true)
        try {
            const role = await auth.login(creds.username, creds.password)
            if (role) {
                toast({
                    title: "Login Success!",
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
                description: "please check your credentials",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-[90%] md:max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">
                    <span className="font-bold text-5xl text-green-400">
                        Sign
                    </span>{" "}
                    In
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your email or username below to login to your account
                </p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                        id="email"
                        type="text"
                        value={creds.username}
                        onChange={e => {
                            setCreds({ ...creds, username: e.target.value })
                        }}
                        placeholder="someone_usr"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={creds.password}
                        onChange={e => {
                            setCreds({ ...creds, password: e.target.value })
                        }}
                        required
                    />
                </div>
                <Button
                    type="submit"
                    onClick={handleSubmission}
                    disabled={isLoading}
                    className="w-full font-bold"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </div>
            {/* <div className="space-y-2"> */}
            {/*     <p className="text-center text-gray-500 dark:text-gray-400"> */}
            {/*         Or continue with */}
            {/*     </p> */}
            {/*     <div className="grid grid-cols-3 gap-2"> */}
            {/*         <Button variant="outline" className="w-full"> */}
            {/*             <ChromeIcon className="h-5 w-5 mr-2" /> */}
            {/*             Google */}
            {/*         </Button> */}
            {/*         <Button variant="outline" className="w-full"> */}
            {/*             <AppleIcon className="h-5 w-5 mr-2" /> */}
            {/*             Apple */}
            {/*         </Button> */}
            {/*         <Button variant="outline" className="w-full"> */}
            {/*             <FacebookIcon className="h-5 w-5 mr-2" /> */}
            {/*             Facebook */}
            {/*         </Button> */}
            {/*     </div> */}
            {/* </div> */}
            {/**/}
            <div className="link flex items-center justify-center">
                <span>
                    Don't have an account?
                    <Link href="/sign-up" className="text-green-300 text-sm">
                        Sign up
                    </Link>
                </span>
            </div>
        </div>
    )
}
