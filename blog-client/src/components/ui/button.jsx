import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#fbb928] text-white hover:bg-[#e0a800] focus-visible:ring-[#fbb928]",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline: "border border-[#fbb928] text-[#fbb928] bg-transparent hover:bg-[#fbb928]/10 focus-visible:ring-[#fbb928]",
        secondary: "bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#eaeaea] focus-visible:ring-[#cfcfcf]",
        ghost: "text-[#1a1a1a] hover:bg-[#f0f0f0] focus-visible:ring-[#d4d4d4]",
        link: "text-[#fbb928] underline-offset-4 hover:underline focus-visible:ring-0",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
