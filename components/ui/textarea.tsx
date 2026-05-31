import * as React from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10",
        className
      )}
      {...props}
    />
  );
}