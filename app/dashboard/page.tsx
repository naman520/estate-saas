import Link from "next/link";
import { Building2, CalendarClock, CheckCircle2, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const company = await getCurrentCompany();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [totalProjects, totalLeads, newLeads, bookedLeads, todaysFollowUps] =
    await Promise.all([
      prisma.project.count({
        where: {
          companyId: company.id,
        },
      }),

      prisma.lead.count({
        where: {
          companyId: company.id,
        },
      }),

      prisma.lead.count({
        where: {
          companyId: company.id,
          status: "NEW",
        },
      }),

      prisma.lead.count({
        where: {
          companyId: company.id,
          status: "BOOKED",
        },
      }),

      prisma.lead.count({
        where: {
          companyId: company.id,
          followUpAt: {
            gte: todayStart,
            lte: todayEnd,
          },
          status: {
            notIn: ["BOOKED", "LOST"],
          },
        },
      }),
    ]);

  const recentLeads = await prisma.lead.findMany({
    where: {
      companyId: company.id,
    },
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: Building2,
    },
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
    },
    {
      label: "New Leads",
      value: newLeads,
      icon: CalendarClock,
    },
    {
      label: "Bookings",
      value: bookedLeads,
      icon: CheckCircle2,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="A quick overview of your real estate projects, enquiries, bookings and follow-ups."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-gray-700">
                    {stat.label}
                  </p>

                  <div className="rounded-xl bg-gray-100 p-2 text-gray-950">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold text-gray-950">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-gray-950">
                Recent Leads
              </h2>
              <p className="mt-1 text-sm text-gray-700">
                Latest enquiries from your public project pages.
              </p>
            </div>

            <Link
              href="/dashboard/leads"
              className="text-sm font-bold text-gray-950 hover:underline"
            >
              View all
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="px-5 py-10 text-sm font-medium text-gray-700">
              No leads yet. Leads will appear here after someone submits an
              enquiry form.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="block px-5 py-4 transition hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-950">
                        {lead.name}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-gray-700">
                        {lead.project?.name || "No project"} •{" "}
                        {lead.source || "WEBSITE"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-950 px-3 py-1 text-xs font-bold text-white">
                      {lead.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-base font-bold text-gray-950">
              Today&apos;s Follow-ups
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Leads scheduled for follow-up today.
            </p>

            <div className="mt-6 rounded-2xl bg-gray-950 p-5 text-white">
              <p className="text-sm font-semibold text-gray-300">
                Follow-ups Today
              </p>
              <p className="mt-2 text-4xl font-bold">{todaysFollowUps}</p>
            </div>

            <Link
              href="/dashboard/follow-ups"
              className="mt-5 inline-flex text-sm font-bold text-gray-950 hover:underline"
            >
              Open follow-ups
            </Link>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}