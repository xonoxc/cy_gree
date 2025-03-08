import type { Metadata } from "next"
import { LoginForm } from "@/components/login"

export const metadata: Metadata = {
    title: "SignIn | cyGree",
}

export default function SignIn() {
    return (
        <div className="min-h-screen py-44 bg-gradient-to-b from-[#161617] to-black">
            <LoginForm />
        </div>
    )
}
