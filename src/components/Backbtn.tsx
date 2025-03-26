"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const BackBtn: React.FC<{ link?: string }> = ({ link }) => {
    const router = useRouter()

    return (
        <button
            onClick={() => (link ? router.push(link) : router.back())}
            className="flex items-center text-sm text-gray-400 hover:text-white"
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
        </button>
    )
}

export default BackBtn
