import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#fbb928] text-white hover:bg-[#e0a800] focus:ring-[#fbb928]",
        secondary:
          "bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e0e0e0] focus:ring-[#c4c4c4]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
        outline:
          "border border-[#fbb928] text-[#fbb928] hover:bg-[#fbb928]/10 focus:ring-[#fbb928]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
