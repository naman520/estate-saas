import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  LinkIcon,
  MapPin,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectEditForm } from "@/components/forms/project-edit-form";
import { updateProject } from "./actions";
import { getCurrentCompany } from "@/lib/current-company";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;

  const company = await getCurrentCompany();

  const project = await prisma.project.findUnique({
    where: {
      id,
      companyId: company.id,
    },
    include: {
      company: true,
      leads: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, project.id);

  const totalLeads = project.leads.length;
  const bookedLeads = project.leads.filter(
    (lead) => lead.status === "BOOKED",
  ).length;
  const newLeads = project.leads.filter((lead) => lead.status === "NEW").length;

  const publicUrl = `/p/${project.slug}`;

  return (
    <PageContainer>
      <div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>

      <PageHeader
        title={project.name}
        description="Manage project details, public landing page information and project status."
        action={
          <Link href={publicUrl} target="_blank">
            <Button>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Public Page
            </Button>
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm font-bold text-gray-700">Total Leads</p>
            <p className="mt-3 text-3xl font-bold text-gray-950">
              {totalLeads}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm font-bold text-gray-700">New Leads</p>
            <p className="mt-3 text-3xl font-bold text-blue-700">{newLeads}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm font-bold text-gray-700">Bookings</p>
            <p className="mt-3 text-3xl font-bold text-green-700">
              {bookedLeads}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ProjectEditForm project={project} updateAction={updateProjectWithId} />

        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-lg font-bold text-gray-950">Public Page</h2>
              <p className="mt-1 text-sm font-medium text-gray-700">
                This is the generated landing page URL for this project.
              </p>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  Default URL
                </p>
                <p className="mt-1 break-all text-sm font-bold text-gray-950">
                  {publicUrl}
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  Custom Domain
                </p>
                <p className="mt-1 break-all text-sm font-bold text-gray-950">
                  {project.customDomain || "Not configured"}
                </p>
              </div>

              <Link href={publicUrl} target="_blank" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview Page
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-bold text-gray-950">Project Info</h2>

              <div className="mt-4 space-y-4">
                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={project.location}
                />

                <InfoItem
                  icon={<LinkIcon className="h-4 w-4" />}
                  label="Slug"
                  value={project.slug}
                />

                <InfoItem
                  icon={<ImageIcon className="h-4 w-4" />}
                  label="Hero Image"
                  value={project.heroImage ? "Added" : "Not added"}
                />

                <InfoItem
                  icon={<LinkIcon className="h-4 w-4" />}
                  label="Created"
                  value={formatDate(project.createdAt)}
                />

                <InfoItem
                  icon={<LinkIcon className="h-4 w-4" />}
                  label="Form Position"
                  value={project.formPosition.replaceAll("_", " ")}
                />
              </div>
            </CardContent>
          </Card>

          {project.heroImage && (
            <Card className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.heroImage}
                alt={project.name}
                className="h-56 w-full object-cover"
              />
            </Card>
          )}
        </div>
      </section>
    </PageContainer>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <div className="mt-0.5 text-gray-700">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
          {label}
        </p>
        <p className="mt-1 wrap-break-word text-sm font-bold text-gray-950">
          {value}
        </p>
      </div>
    </div>
  );
}
