import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  CONTACTED: "bg-purple-50 text-purple-700 border-purple-200",
  SITE_VISIT_PLANNED: "bg-amber-50 text-amber-700 border-amber-200",
  SITE_VISIT_DONE: "bg-indigo-50 text-indigo-700 border-indigo-200",
  NEGOTIATION: "bg-orange-50 text-orange-700 border-orange-200",
  BOOKED: "bg-green-50 text-green-700 border-green-200",
  LOST: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-bold",
        statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200",
        className
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}