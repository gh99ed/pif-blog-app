import * as React from "react"
import { cn } from "../../lib/utils"

// Base Card with smooth modern shadow and rounded border
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-[#e5e7eb] bg-white text-[#1a1a1a] shadow-md transition-shadow hover:shadow-lg",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// Header with generous spacing and modern flow
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Title styled with heavier weight and size
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Description with muted gray for cleaner readability
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#6b7280]", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// Content with nice breathing room
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-6 py-4", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

// Footer for action elements (buttons, etc.)
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end px-6 py-4 border-t border-gray-100", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
