import { Button } from "../ui/button"

export const CollectionBtnSkeleton = () => (
    <Button
        variant="outline"
        className="dark:bg-black dark:text-black font-bold mb-5 flex items-center animate-pulse"
        disabled
    >
        <div className="mr-2 h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
    </Button>
)
