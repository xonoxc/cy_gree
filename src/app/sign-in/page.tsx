import type { Metadata } from "next"
import { LoginForm } from "@/components/login"
import BackBtn from "@/components/Backbtn"

export const metadata: Metadata = {
    title: "SignIn | cyGree",
}

export default function SignIn() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#161617] to-black">
            <div className="p-6 hidden sm:block">
                <BackBtn link={"/"} />
            </div>
            <div className="py-44">
                <LoginForm />
            </div>
        </div>
    )
}
