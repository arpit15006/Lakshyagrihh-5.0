import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {

    let variantStyles = "bg-primary text-primary-foreground hover:bg-primary/90";
    if (variant === "outline") {
      variantStyles = "border border-border bg-background hover:bg-muted hover:text-foreground";
    } else if (variant === "ghost") {
      variantStyles = "hover:bg-gray-100 hover:text-gray-900";
    }

    let sizeStyles = "h-9 px-4 py-2";
    if (size === "sm") sizeStyles = "h-8 px-3 text-xs";
    if (size === "lg") sizeStyles = "h-10 px-8";
    if (size === "icon") sizeStyles = "h-9 w-9";

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${variantStyles} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
