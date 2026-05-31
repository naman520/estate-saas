"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Building2,
  CalendarClock,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client before using createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebar = open ? (
    <div className="fixed inset-0 z-9999 lg:hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu overlay"
        className="absolute inset-0 w-full h-full bg-gray-950/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside className="absolute left-0 top-0 h-full w-[88vw] max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 px-4 py-4 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-2xl bg-gray-950 px-4 py-3 text-white">
              <h2 className="text-base font-bold leading-none">EstateFlow</h2>
              <p className="mt-1 text-xs font-medium text-gray-300">
                Real estate CRM
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-100"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Nav label */}
        <div className="px-4 pt-5 shrink-0">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Dashboard Navigation
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-950 shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-4 shrink-0">
          <p className="text-xs font-medium leading-5 text-gray-600">
            Use this menu to switch between projects, leads, follow-ups,
            receipts and settings.
          </p>
        </footer>
      </aside>
    </div>
  ) : null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 w-10 p-0 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Portal renders the overlay directly into document.body */}
      {mounted && createPortal(sidebar, document.body)}
    </>
  );
}