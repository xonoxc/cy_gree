import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell } from "lucide-react"

export function TopNav() {
    return (
        <header className="sticky top-0 z-40 border-b bg-background">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-64 md:w-96"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
