import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10",
        className
      )}
      {...props}
    />
  );
}