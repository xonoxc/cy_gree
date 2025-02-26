import type { Metadata } from "next"
import { LoginForm } from "@/components/login"

export const metadata: Metadata = {
    title: "SignIn | cyGree",
}

export default function SignIn() {
    return (
        <div className="py-44">
            <LoginForm />
        </div>
    )
}
