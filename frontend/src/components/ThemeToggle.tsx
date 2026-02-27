import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { Button } from "./ui/button"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-9 h-9 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            title="Toggle Theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-300" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-300" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
