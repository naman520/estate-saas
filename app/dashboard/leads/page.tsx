import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { LeadsFilterForm } from "@/components/forms/leads-filter-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentCompany } from "@/lib/current-company";

type LeadsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    projectId?: string;
    source?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() || "";
  const status = params.status?.trim() || "";
  const projectId = params.projectId?.trim() || "";
  const source = params.source?.trim() || "";
  const company = await getCurrentCompany();

  const where: Prisma.LeadWhereInput = {
    companyId: company?.id,
  };

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (status) {
    where.status = status as Prisma.EnumLeadStatusFilter<"Lead">;
  }

  if (projectId) {
    where.projectId = projectId;
  }

  if (source) {
    where.source = {
      equals: source,
      mode: "insensitive",
    };
  }

  const [leads, projects, totalLeads] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.project.findMany({
      where: {
        companyId: company.id,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.lead.count({
      where,
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader
        title="Leads"
        description="Search, filter, and manage customer enquiries captured from project landing pages."
      />

      <LeadsFilterForm
        projects={projects}
        search={search}
        status={status}
        projectId={projectId}
        source={source}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-700">
          Showing {totalLeads} lead{totalLeads === 1 ? "" : "s"}
        </p>
      </div>

      <Card className="overflow-hidden">
        {leads.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <h2 className="text-lg font-bold text-gray-950">
              No matching leads
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-700">
              Try clearing filters or submit a test enquiry from a public
              project page.
            </p>

            <Link
              href="/dashboard/leads"
              className="mt-4 text-sm font-bold text-gray-950 underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-237.5 text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-5 py-3 font-bold">Customer</th>
                  <th className="px-5 py-3 font-bold">Phone</th>
                  <th className="px-5 py-3 font-bold">Project</th>
                  <th className="px-5 py-3 font-bold">Source</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Created</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-950">{lead.name}</p>
                      {lead.email && (
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          {lead.email}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {lead.phone}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {lead.project?.name || "No project"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800">
                        {lead.source || "WEBSITE"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={lead.status} />
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {formatDate(lead.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-sm font-bold text-gray-950 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
