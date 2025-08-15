import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow hover:scale-105",
        hero: "bg-gradient-primary text-white font-heading font-semibold shadow-glow hover:shadow-glow hover:scale-105 animate-glow-pulse",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-[0_0_30px_hsl(var(--accent-glow))] hover:scale-105",
        win: "bg-gradient-win text-win-foreground hover:shadow-win hover:scale-105",
        ghost: "hover:bg-hover hover:scale-105",
        outline: "border border-card-border bg-card hover:bg-hover hover:border-primary/50 text-card-foreground",
        answer: "bg-card hover:bg-hover border border-card-border text-card-foreground hover:border-primary/50 hover:scale-102 h-16 text-left justify-start p-6",
        "answer-selected": "bg-primary/20 border-primary text-primary-foreground",
        "answer-correct": "bg-win/20 border-win text-win-foreground",
        "answer-incorrect": "bg-red-500/20 border-red-500 text-red-400",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
