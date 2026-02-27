import * as React from "react"
import { format, parse } from "date-fns"
import * as Popover from "@radix-ui/react-popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./calendar"
import { cn } from "../../lib/utils"

interface DatePickerProps {
    value: string // ISO date string "YYYY-MM-DD"
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    required?: boolean
}

export function DatePicker({
    value,
    onValueChange,
    placeholder = "Pick a date",
    className,
    required,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    const dateValue = React.useMemo(() => {
        if (!value) return undefined
        try {
            return parse(value, "yyyy-MM-dd", new Date())
        } catch {
            return undefined
        }
    }, [value])

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    data-required={required || undefined}
                    className={cn(
                        "flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors hover:border-border focus:outline-none focus:ring-2 focus:ring-ring",
                        !dateValue && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">
                        {dateValue ? format(dateValue, "dd MMM yyyy") : placeholder}
                    </span>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className="z-50 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                    sideOffset={4}
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={date => {
                            if (date) {
                                onValueChange(format(date, "yyyy-MM-dd"))
                            }
                            setOpen(false)
                        }}
                        captionLayout="dropdown"
                        defaultMonth={dateValue}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
