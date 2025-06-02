import * as React from "react"
import { cn } from "../../lib/utils" 

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#1a1a1a] shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#fbb928] focus:border-[#fbb928] transition disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
