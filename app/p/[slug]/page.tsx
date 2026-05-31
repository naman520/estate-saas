import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LeadForm } from "@/components/forms/lead-form";
import Image from "next/image";

type PublicProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function textToList(value: string | null) {
  if (!value) return [];

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function jsonToStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  );
}

export default async function PublicProjectPage({
  params,
}: PublicProjectPageProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    include: {
      company: true,
    },
  });

  if (!project) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${project.name}. Please share more details.`,
  );

  const companyPhone = project.company.phone || "9876543210";
  const companyWhatsapp =
    project.company.whatsappNumber || project.company.phone || "9876543210";

  const whatsappUrl = `https://wa.me/91${companyWhatsapp}?text=${whatsappMessage}`;
  const callUrl = `tel:+91${companyPhone}`;
  const galleryImages = jsonToStringArray(project.galleryImages);
  const amenities = textToList(project.amenities);
  const locationHighlights = textToList(project.locationHighlights);

  const ctaHeading = project.ctaHeading || "Interested in this project?";
  const ctaSubtext =
    project.ctaSubtext ||
    "Submit your details or contact the sales team to schedule a site visit.";
  const ctaButtonText = project.ctaButtonText || "Call Now";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-950"
          >
            <ArrowLeft className="h-4 w-4" />
            EstateFlow
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={callUrl}
              className="hidden rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-950 hover:bg-gray-100 sm:inline-flex"
            >
              Call Now
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="bg-white">
        <div
          className={
            project.formPosition === "HERO_RIGHT"
              ? "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_420px] lg:px-8 lg:py-16"
              : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
          }
        >
          <div>
            <div className="mb-5 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800">
              {project.status.replaceAll("_", " ")}
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              {project.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-base font-semibold text-gray-700">
              <MapPin className="h-5 w-5" />
              <p>{project.location}</p>
            </div>

            {project.priceRange && (
              <p className="mt-6 text-2xl font-bold text-gray-950">
                {project.priceRange}
              </p>
            )}

            {project.description && (
              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-700">
                {project.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={callUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-950 hover:bg-gray-100"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>

              {project.showBrochure && project.brochureUrl && (
                <a
                  href={project.brochureUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-950 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" />
                  Download Brochure
                </a>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            {project.formPosition === "HERO_RIGHT" && (
              <div className="lg:sticky lg:top-6 lg:self-start">
                <LeadForm
                  projectId={project.id}
                  companyId={project.companyId}
                  projectSlug={project.slug}
                  projectName={project.name}
                />
              </div>
            )}

            {project.formPosition === "AFTER_HERO" && (
              <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl">
                  <LeadForm
                    projectId={project.id}
                    companyId={project.companyId}
                    projectSlug={project.slug}
                    projectName={project.name}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-950">
              Project Gallery
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-700">
              View images from the project.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`${project.name} gallery image ${index + 1}`}
                  className="h-64 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {project.showHeroImage && project.heroImage && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.heroImage}
              alt={project.name}
              className="h-105 w-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        {project.showLocation && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">
              Project Location
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {project.location}
            </p>

            {project.mapLink && (
              <a
                href={project.mapLink}
                target="_blank"
                className="mt-4 inline-flex text-sm font-bold text-gray-950 underline"
              >
                View on Google Maps
              </a>
            )}
          </div>
        )}

        {project.showPricing && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">Price Range</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {project.priceRange || "Contact sales team for pricing details."}
            </p>
          </div>
        )}

        {project.showContactCta && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Call or WhatsApp the sales team for site visit and booking
              details.
            </p>
          </div>
        )}
      </section>
      {project.formPosition === "AFTER_DETAILS" && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl">
            <LeadForm
              projectId={project.id}
              companyId={project.companyId}
              projectSlug={project.slug}
              projectName={project.name}
            />
          </div>
        </section>
      )}

      {(amenities.length > 0 || locationHighlights.length > 0) && (
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          {amenities.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-950">Amenities</h2>

              <div className="mt-5 grid gap-3">
                {amenities.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {locationHighlights.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-950">
                Location Highlights
              </h2>

              <div className="mt-5 grid gap-3">
                {locationHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {project.formPosition === "BOTTOM" && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl">
            <LeadForm
              projectId={project.id}
              companyId={project.companyId}
              projectSlug={project.slug}
              projectName={project.name}
            />
          </div>
        </section>
      )}

      {project.showContactCta && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gray-950 px-6 py-10 text-center text-white shadow-sm sm:px-10">
            <h2 className="text-3xl font-bold tracking-tight">{ctaHeading}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-gray-300">
              {ctaSubtext}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={callUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-gray-950 hover:bg-gray-100"
              >
                <Phone className="h-4 w-4" />
                {ctaButtonText}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
