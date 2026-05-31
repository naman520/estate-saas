import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { FollowUpCard } from "@/components/dashboard/follow-up-card";

function getTodayRange() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return {
    todayStart,
    todayEnd,
  };
}

export default async function FollowUpsPage() {
  const company = await getCurrentCompany();
  const { todayStart, todayEnd } = getTodayRange();

  const [overdueFollowUps, todaysFollowUps, upcomingFollowUps] =
    await Promise.all([
      prisma.lead.findMany({
        where: {
          companyId: company.id,
          followUpAt: {
            lt: todayStart,
          },
          status: {
            notIn: ["BOOKED", "LOST"],
          },
        },
        include: {
          project: true,
        },
        orderBy: {
          followUpAt: "asc",
        },
      }),

      prisma.lead.findMany({
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
        include: {
          project: true,
        },
        orderBy: {
          followUpAt: "asc",
        },
      }),

      prisma.lead.findMany({
        where: {
          companyId: company.id,
          followUpAt: {
            gt: todayEnd,
          },
          status: {
            notIn: ["BOOKED", "LOST"],
          },
        },
        include: {
          project: true,
        },
        orderBy: {
          followUpAt: "asc",
        },
        take: 10,
      }),
    ]);

  const totalFollowUps =
    overdueFollowUps.length + todaysFollowUps.length + upcomingFollowUps.length;

  return (
    <PageContainer>
      <PageHeader
        title="Follow-ups"
        description="Track overdue, today's, and upcoming customer follow-ups."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm font-bold text-gray-700">Overdue</p>
            <p className="mt-3 text-3xl font-bold text-red-600">
              {overdueFollowUps.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm font-bold text-gray-700">Today</p>
            <p className="mt-3 text-3xl font-bold text-gray-950">
              {todaysFollowUps.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm font-bold text-gray-700">Upcoming</p>
            <p className="mt-3 text-3xl font-bold text-blue-700">
              {upcomingFollowUps.length}
            </p>
          </CardContent>
        </Card>
      </section>

      {totalFollowUps === 0 ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold text-gray-950">
              No follow-ups scheduled
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-700">
              Follow-ups will appear here after you set a follow-up date from a
              lead detail page.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                Overdue Follow-ups
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-700">
                These leads need attention first.
              </p>
            </div>

            {overdueFollowUps.length === 0 ? (
              <EmptySection message="No overdue follow-ups." />
            ) : (
              <div className="space-y-3">
                {overdueFollowUps.map((lead) => (
                  <FollowUpCard key={lead.id} lead={lead} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                Today&apos;s Follow-ups
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-700">
                Leads scheduled for today.
              </p>
            </div>

            {todaysFollowUps.length === 0 ? (
              <EmptySection message="No follow-ups for today." />
            ) : (
              <div className="space-y-3">
                {todaysFollowUps.map((lead) => (
                  <FollowUpCard key={lead.id} lead={lead} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                Upcoming Follow-ups
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-700">
                Next scheduled conversations.
              </p>
            </div>

            {upcomingFollowUps.length === 0 ? (
              <EmptySection message="No upcoming follow-ups." />
            ) : (
              <div className="space-y-3">
                {upcomingFollowUps.map((lead) => (
                  <FollowUpCard key={lead.id} lead={lead} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </PageContainer>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-sm font-semibold text-gray-700">
      {message}
    </div>
  );
}
