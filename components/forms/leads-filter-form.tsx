import Link from "next/link";
import { Search } from "lucide-react";
import { LEAD_STATUS_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProjectOption = {
  id: string;
  name: string;
};

type LeadsFilterFormProps = {
  projects: ProjectOption[];
  search?: string;
  status?: string;
  projectId?: string;
  source?: string;
};

const SOURCE_OPTIONS = [
  {
    label: "Website",
    value: "WEBSITE",
  },
  {
    label: "Facebook",
    value: "facebook",
  },
  {
    label: "Instagram",
    value: "instagram",
  },
  {
    label: "Google",
    value: "google",
  },
  {
    label: "WhatsApp",
    value: "whatsapp",
  },
];

export function LeadsFilterForm({
  projects,
  search = "",
  status = "",
  projectId = "",
  source = "",
}: LeadsFilterFormProps) {
  return (
    <form className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_1fr_1fr_1fr_auto]">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Search
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search name, phone, email..."
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Status
          </label>

          <select
            name="status"
            defaultValue={status}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          >
            <option value="">All Status</option>
            {LEAD_STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Project
          </label>

          <select
            name="projectId"
            defaultValue={projectId}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Source
          </label>

          <select
            name="source"
            defaultValue={source}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          >
            <option value="">All Sources</option>
            {SOURCE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full lg:w-auto">
            Apply
          </Button>

          <Link href="/dashboard/leads">
            <Button type="button" variant="outline" className="w-full lg:w-auto">
              Clear
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}