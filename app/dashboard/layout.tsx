import { UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <MobileSidebar />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-950">
                    EstateFlow Dashboard
                  </p>
                  <p className="hidden text-xs font-medium text-gray-600 sm:block">
                    Projects, leads, follow-ups and receipts
                  </p>
                </div>
              </div>

              <UserButton />
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}