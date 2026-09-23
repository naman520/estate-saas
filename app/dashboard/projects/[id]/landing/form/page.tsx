import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  LayoutTemplate,
  PenLine,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { parseFormConfig, MAX_FIELDS } from "@/lib/form-config";
import { FormBuilder } from "@/components/landing-form/form-builder";
import { saveFormConfig } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LandingFormPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCurrentCompany();

  const project = await prisma.project.findUnique({
    where: { id, companyId: company.id },
    include: { template: true },
  });

  if (!project) {
    notFound();
  }

  const config = parseFormConfig(project.formSettings);
  const publicUrl = `/p/${project.slug}`;

  return (
    <PageContainer>
      {/* Back nav */}
      <div>
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
      </div>

      <PageHeader
        title="Lead Form Builder"
        description={`Configure the enquiry form for: ${project.name}. Maximum ${MAX_FIELDS} fields on the free plan.`}
        action={
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/projects/${project.id}/landing/templates`}>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100 transition">
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </button>
            </Link>
            <Link href={`/dashboard/projects/${project.id}/landing/content`}>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100 transition">
                <PenLine className="h-4 w-4" />
                Content
              </button>
            </Link>
            <Link href={publicUrl} target="_blank">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition">
                <ExternalLink className="h-4 w-4" />
                View Page
              </button>
            </Link>
          </div>
        }
      />

      {/* Info banner */}
      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-950">
                Free Plan — up to {MAX_FIELDS} fields
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                Changes save instantly and are reflected on{" "}
                <Link
                  href={publicUrl}
                  target="_blank"
                  className="font-semibold text-gray-900 underline underline-offset-2"
                >
                  {publicUrl}
                </Link>
                . Switching templates keeps the same form configuration.
              </p>
            </div>
            <div className="ml-auto shrink-0 text-right">
              <p className="text-2xl font-bold text-gray-950">
                {config.fields.length}
              </p>
              <p className="text-xs text-gray-400">
                / {MAX_FIELDS} fields
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form builder */}
      <FormBuilder
        projectId={project.id}
        initialFields={config.fields}
        saveAction={saveFormConfig}
      />
    </PageContainer>
  );
}