import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 border-zinc-800",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-800 text-zinc-50 shadow hover:bg-zinc-700",
        secondary:
          "border-transparent bg-zinc-700 text-zinc-50 hover:bg-zinc-600",
        destructive:
          "border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80",
        outline: "text-zinc-50 border-zinc-700",
        purple:
          "border-transparent bg-amber-500/20 text-amber-400 border-amber-500/30",
        info:
          "border-transparent bg-sky-500/20 text-sky-400 border-sky-500/30",
        success:
          "border-transparent bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
