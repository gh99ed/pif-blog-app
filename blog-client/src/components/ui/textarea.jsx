import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-[#fbb928]/40 bg-white px-4 py-2 text-base text-gray-800 placeholder:text-gray-400 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbb928] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
