import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#fbb928]/10", className)}
      {...props}
    />
  );
}

export { Skeleton }
