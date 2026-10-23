import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const button = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:opacity-50",
  {
    variants: {
      tone: {
        primary: "btn-primary bg-accent text-accent-ink hover:bg-[oklch(0.38_0.07_167)]",
        plain: "bg-ink text-paper hover:bg-soft",
      },
      size: {
        md: "h-12 px-6 text-[15px]",
        round: "size-11 rounded-full",
      },
    },
    defaultVariants: { tone: "primary", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, tone, size, children, ...rest }: Props) {
  return (
    <button className={cn(button({ tone, size }), className)} {...rest}>
      {children}
      {tone !== "plain" && size !== "round" && (
        <span className="btn-stripes" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
        </span>
      )}
    </button>
  );
}
