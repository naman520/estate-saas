import Link from "next/link";
import { ExternalLink, FileText, PenLine } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";
import { selectLandingTemplate } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LandingTemplatesPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCurrentCompany();

  const project = await prisma.project.findFirst({
    where: { id, companyId: company.id },
    include: { template: true },
  });

  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Project not found</h1>
      </div>
    );
  }

  const templates = await prisma.landingTemplate.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8 p-6">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Select Landing Page Template
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose a template for{" "}
            <span className="font-semibold">{project.name}</span>. Content is
            shared across all templates.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/dashboard/projects/${project.id}/landing/form`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100 transition"
          >
            <FileText className="h-4 w-4" />
            Form
          </Link>
          <Link
            href={`/dashboard/projects/${project.id}/landing/content`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100 transition"
          >
            <PenLine className="h-4 w-4" />
            Edit Content
          </Link>
          <Link
            href={`/p/${project.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            <ExternalLink className="h-4 w-4" />
            View Page
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => {
          const isSelected = project.templateId === template.id;
          const isPaid = template.tier === "PAID";
          const isLocked = isPaid && company.plan !== "PRO";

          return (
            <div
              key={template.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
                isSelected
                  ? "border-black ring-2 ring-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex h-40 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
                {template.previewImg ? (
                  <span>Preview Image</span>
                ) : (
                  <span>No Preview</span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{template.name}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isPaid
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {template.tier}
                </span>
              </div>

              <p className="mt-2 min-h-10 text-sm text-gray-600">
                {template.description}
              </p>

              <form
                action={async () => {
                  "use server";
                  await selectLandingTemplate(project.id, template.id);
                }}
                className="mt-5"
              >
                <button
                  type="submit"
                  className={`w-full rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isSelected || isLocked
                      ? "bg-gray-200 text-gray-700 cursor-default"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  disabled={isSelected || isLocked}
                >
                  {isSelected
                    ? "✓ Selected"
                    : isLocked
                      ? "🔒 Upgrade to PRO"
                      : "Use Template"}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}