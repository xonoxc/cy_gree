import type { Metadata } from "next"
import RegistrationForm from "@/components/signup"
import BackBtn from "@/components/Backbtn"

export const metadata: Metadata = {
    title: "SignUp | cyGree",
}

export default function SignUp() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#161617] to-black">
            <div className="p-6 hidden sm:block">
                <BackBtn />
            </div>
            <div className="py-36">
                <RegistrationForm />
            </div>
        </div>
    )
}
