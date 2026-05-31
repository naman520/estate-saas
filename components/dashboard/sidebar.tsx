import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarClock,
  ReceiptText,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: Building2,
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    label: "Follow-ups",
    href: "/dashboard/follow-ups",
    icon: CalendarClock,
  },
  {
    label: "Receipts",
    href: "/dashboard/receipts",
    icon: ReceiptText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-gray-200 bg-white p-4 lg:block">
      <div className="mb-8 rounded-2xl bg-gray-950 p-4 text-white">
        <h1 className="text-xl font-bold tracking-tight">EstateFlow</h1>
        <p className="mt-1 text-sm text-gray-300">Real estate CRM</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}