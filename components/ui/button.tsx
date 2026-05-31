import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const variants = {
    default: "bg-gray-950 text-white hover:bg-gray-800",
    outline:
      "border border-gray-300 bg-white text-gray-950 hover:bg-gray-100",
    ghost: "bg-transparent text-gray-950 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}