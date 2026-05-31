import Link from "next/link";
import { CalendarClock, Phone } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

type FollowUpCardProps = {
  lead: {
    id: string;
    name: string;
    phone: string;
    status: string;
    source: string | null;
    followUpAt: Date | null;
    project: {
      name: string;
    } | null;
  };
};

export function FollowUpCard({ lead }: FollowUpCardProps) {
  return (
    <Link
      href={`/dashboard/leads/${lead.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-950">{lead.name}</h3>
            <StatusBadge status={lead.status} />
          </div>

          <p className="mt-2 text-sm font-medium text-gray-700">
            {lead.project?.name || "No project"} • {lead.source || "WEBSITE"}
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-gray-700">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              {lead.phone}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-4 w-4" />
              {lead.followUpAt ? formatDate(lead.followUpAt) : "No date"}
            </span>
          </div>
        </div>

        <span className="text-sm font-bold text-gray-950 hover:underline">
          Open Lead
        </span>
      </div>
    </Link>
  );
}