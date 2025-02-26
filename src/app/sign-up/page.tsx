import type { Metadata } from "next"
import RegistrationForm from "@/components/signup"

export const metadata: Metadata = {
    title: "SignUp | cyGree",
}

export default function SignUp() {
    return (
        <div className="py-44 ">
            <RegistrationForm />
        </div>
    )
}
