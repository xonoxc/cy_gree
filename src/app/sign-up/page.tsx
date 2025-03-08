import type { Metadata } from "next"
import RegistrationForm from "@/components/signup"

export const metadata: Metadata = {
    title: "SignUp | cyGree",
}

export default function SignUp() {
    return (
        <div className="h-screen py-44 bg-gradient-to-b from-[#161617] to-black">
            <RegistrationForm />
        </div>
    )
}
