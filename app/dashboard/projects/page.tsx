import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { getCurrentCompany } from "@/lib/current-company";

export default async function ProjectsPage() {
  const company = await getCurrentCompany();

  const projects = await prisma.project.findMany({
    where: {
      companyId: company.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Create and manage real estate projects with public landing pages."
        action={
          <Link href="/dashboard/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        }
      />

      <Card className="overflow-hidden">
        {projects.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <h2 className="text-lg font-bold text-gray-950">No projects yet</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-700">
              Create your first real estate project. A public landing page will
              be generated automatically.
            </p>

            <Link href="/dashboard/projects/new" className="mt-5">
              <Button>Create Project</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-5 py-3 font-bold">Project</th>
                  <th className="px-5 py-3 font-bold">Location</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Created</th>
                  <th className="px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-gray-950">
                          {project.name}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          /p/{project.slug}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {project.location}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-950 px-3 py-1 text-xs font-bold text-white">
                        {project.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {formatDate(project.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="text-sm font-bold text-gray-950 hover:underline"
                        >
                          Manage
                        </Link>

                        <Link
                          href={`/p/${project.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-gray-950 hover:underline"
                        >
                          Open
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
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
