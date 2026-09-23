import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  LayoutTemplate,
  Save,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveLandingContent } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LandingContentPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCurrentCompany();

  const project = await prisma.project.findUnique({
    where: { id, companyId: company.id },
    include: { template: true },
  });

  if (!project) {
    notFound();
  }

  const saveContentWithId = saveLandingContent.bind(null, project.id);
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
        title="Edit Landing Page Content"
        description={`Editing content for: ${project.name}. Changes are immediately reflected on the public landing page.`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/projects/${project.id}/landing/templates`}
            >
              <Button variant="outline" size="sm">
                <LayoutTemplate className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </Link>
            <Link
              href={`/dashboard/projects/${project.id}/landing/form`}
            >
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Form
              </Button>
            </Link>
            <Link href={publicUrl} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Page
              </Button>
            </Link>
          </div>
        }
      />

      {/* Active template badge */}
      {project.template && (
        <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
          <LayoutTemplate className="h-4 w-4 text-gray-400" />
          Active template:
          <span className="font-semibold text-gray-900">
            {project.template.name}
          </span>
        </div>
      )}

      <form action={saveContentWithId} className="space-y-6">
        {/* Section 1 — Hero */}
        <Card>
          <CardContent>
            <SectionHeader
              title="Hero Section"
              description="The headline content shown at the top of the landing page."
            />
            <div className="mt-6 grid gap-5">
              <Field label="Project Name" required>
                <Input
                  name="name"
                  defaultValue={project.name}
                  placeholder="e.g. WestWyn Estates"
                  required
                />
              </Field>

              <Field label="Location" required>
                <Input
                  name="location"
                  defaultValue={project.location}
                  placeholder="e.g. Whitefield, Bangalore"
                  required
                />
              </Field>

              <Field label="Price Range">
                <Input
                  name="priceRange"
                  defaultValue={project.priceRange ?? ""}
                  placeholder="e.g. ₹45L – ₹1.2Cr"
                />
              </Field>

              <Field
                label="Project Description"
                hint="Brief overview shown below the headline."
              >
                <Textarea
                  name="description"
                  defaultValue={project.description ?? ""}
                  placeholder="A thoughtfully designed residential community..."
                  rows={4}
                />
              </Field>

              <Field
                label="CTA Button Text"
                hint="Label on the primary call-to-action button in the hero."
              >
                <Input
                  name="ctaButtonText"
                  defaultValue={project.ctaButtonText ?? ""}
                  placeholder="e.g. Call Now"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 — Amenities & Location */}
        <Card>
          <CardContent>
            <SectionHeader
              title="Amenities & Location Highlights"
              description="Enter one item per line. Each line becomes a separate item in the template."
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field
                label="Amenities"
                hint="One amenity per line."
              >
                <Textarea
                  name="amenities"
                  defaultValue={project.amenities ?? ""}
                  placeholder={"Swimming Pool\nClub House\n24x7 Security\nWide Roads"}
                  rows={8}
                  className="font-mono text-xs"
                />
              </Field>

              <Field
                label="Location Highlights"
                hint="One highlight per line."
              >
                <Textarea
                  name="locationHighlights"
                  defaultValue={project.locationHighlights ?? ""}
                  placeholder={"5 min to Airport\n10 min to Metro\nNear Schools & Hospitals"}
                  rows={8}
                  className="font-mono text-xs"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Section 3 — Media & Links */}
        <Card>
          <CardContent>
            <SectionHeader
              title="Media & Links"
              description="Enter direct URLs. File uploads will be available in a future update."
            />
            <div className="mt-6 grid gap-5">
              <Field
                label="Hero Image URL"
                hint="Full URL to the main project image (JPEG/PNG/WebP)."
              >
                <Input
                  name="heroImage"
                  defaultValue={project.heroImage ?? ""}
                  placeholder="https://example.com/images/project.jpg"
                  type="url"
                />
              </Field>

              <Field
                label="Google Maps Link"
                hint="Link to the project location on Google Maps."
              >
                <Input
                  name="mapLink"
                  defaultValue={project.mapLink ?? ""}
                  placeholder="https://maps.google.com/..."
                  type="url"
                />
              </Field>

              <Field
                label="Brochure URL"
                hint="Direct link to the downloadable project brochure (PDF)."
              >
                <Input
                  name="brochureUrl"
                  defaultValue={project.brochureUrl ?? ""}
                  placeholder="https://example.com/brochure.pdf"
                  type="url"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Section 4 — Final CTA */}
        <Card>
          <CardContent>
            <SectionHeader
              title="Final CTA Section"
              description="The call-to-action block shown near the bottom of the landing page."
            />
            <div className="mt-6 grid gap-5">
              <Field label="CTA Heading">
                <Input
                  name="ctaHeading"
                  defaultValue={project.ctaHeading ?? ""}
                  placeholder="e.g. Interested in this project?"
                />
              </Field>

              <Field label="CTA Subtext">
                <Textarea
                  name="ctaSubtext"
                  defaultValue={project.ctaSubtext ?? ""}
                  placeholder="Submit your details or contact the sales team to schedule a site visit."
                  rows={3}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Save bar */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">
            Changes are saved to the database and reflected immediately on{" "}
            <Link
              href={publicUrl}
              target="_blank"
              className="font-semibold text-gray-900 underline underline-offset-2"
            >
              {publicUrl}
            </Link>
          </p>
          <Button type="submit" size="md">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <h2 className="text-base font-bold text-gray-950">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}