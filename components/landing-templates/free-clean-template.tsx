import {
  Phone,
  MessageCircle,
  MapPin,
  Download,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { PublicLeadForm } from "@/components/landing-form/public-lead-form";
import { ScrollReveal, StickyMobileCTA } from "./landing-shared";
import { parseFormConfig } from "@/lib/form-config";
import type { Project, Company, landingTemplate } from "@prisma/client";

type ProjectWithRelations = Project & {
  company: Company;
  template: landingTemplate | null;
};

type FreeCleanTemplateProps = {
  project: ProjectWithRelations;
  returnPath?: string;
};

function textToList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function jsonToStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

export function FreeCleanTemplate({ project, returnPath }: FreeCleanTemplateProps) {
  const companyPhone = project.company.phone || "9876543210";
  const companyWhatsapp =
    project.company.whatsappNumber || project.company.phone || "9876543210";

  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${project.name}. Please share more details.`
  );
  const whatsappUrl = `https://wa.me/91${companyWhatsapp}?text=${whatsappMessage}`;
  const callUrl = `tel:+91${companyPhone}`;

  const amenities = textToList(project.amenities);
  const locationHighlights = textToList(project.locationHighlights);
  const galleryImages = jsonToStringArray(project.galleryImages);

  const ctaHeading = project.ctaHeading || "Interested in this project?";
  const ctaSubtext =
    project.ctaSubtext ||
    "Submit your details and our team will reach out to schedule a site visit.";
  const ctaButtonText = project.ctaButtonText || "Call Now";

  const { fields } = parseFormConfig(project.formSettings);

  return (
    <main className="landing-page min-h-screen bg-white text-gray-900 antialiased">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            {project.company.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.company.logo}
                alt={project.company.name}
                className="h-8 w-auto object-contain"
              />
            )}
            <span className="text-sm font-semibold text-gray-800 tracking-tight">
              {project.company.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={callUrl}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Enquire Now
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] items-start">
            {/* Left column — project info */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 tracking-wide uppercase">
                  {project.status.replaceAll("_", " ")}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl leading-[1.1]">
                {project.name}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-sm font-medium">{project.location}</span>
              </div>

              {project.priceRange && project.showPricing && (
                <div className="mt-6">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                    Starting Price
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {project.priceRange}
                  </p>
                </div>
              )}

              {project.description && (
                <p className="mt-6 text-base leading-7 text-gray-600 max-w-xl">
                  {project.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={callUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {ctaButtonText}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                {project.showBrochure && project.brochureUrl && (
                  <a
                    href={project.brochureUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Brochure
                  </a>
                )}
              </div>
            </div>

            {/* Right column — lead form */}
            <div
              id="enquiry"
              className="lg:sticky lg:top-24 lg:self-start animate-fade-in-up delay-200"
            >
              <PublicLeadForm
                projectId={project.id}
                companyId={project.companyId}
                projectSlug={project.slug}
                projectName={project.name}
                fields={fields}
                variant="default"
                hideSource
                returnPath={returnPath}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero Image ──────────────────────────────────────────── */}
      {project.showHeroImage && project.heroImage && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-16">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.heroImage}
                alt={project.name}
                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover"
              />
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Project Quick Info ──────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
          <div className="grid gap-6 sm:grid-cols-3">
            {project.showLocation && (
              <ScrollReveal>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {project.location}
                  </p>
                  {project.mapLink && (
                    <a
                      href={project.mapLink}
                      target="_blank"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View on Maps
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </ScrollReveal>
            )}
            {project.showPricing && (
              <ScrollReveal delay={100}>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Price Range
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {project.priceRange || "Contact for pricing"}
                  </p>
                </div>
              </ScrollReveal>
            )}
            {project.showContactCta && (
              <ScrollReveal delay={200}>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Contact
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {project.company.phone || "Call for details"}
                  </p>
                  {project.company.email && (
                    <p className="text-xs text-gray-500 mt-1">
                      {project.company.email}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Gallery ─────────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Project Gallery
            </h2>
          </ScrollReveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((url, i) => (
              <ScrollReveal key={`${url}-${i}`} delay={i * 80}>
                <div className="overflow-hidden rounded-xl group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${project.name} gallery ${i + 1}`}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Amenities ───────────────────────────────────────────── */}
      {amenities.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-100 py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Amenities
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-lg">
                Thoughtfully designed features for comfortable modern living.
              </p>
            </ScrollReveal>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((item, i) => (
                <ScrollReveal key={item} delay={i * 50}>
                  <div className="flex items-center gap-3 rounded-lg bg-white border border-gray-100 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {item}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Location Highlights ─────────────────────────────────── */}
      {locationHighlights.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Location Highlights
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-lg">
                Everything you need, right where you need it.
              </p>
            </ScrollReveal>
            <div className="grid gap-2 sm:grid-cols-2">
              {locationHighlights.map((item, i) => (
                <ScrollReveal key={item} delay={i * 50}>
                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
                    <Navigation className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {item}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA + Second Form ───────────────────────────────────── */}
      {project.showContactCta && (
        <section className="bg-gray-900 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-start">
              <ScrollReveal>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
                    {ctaHeading}
                  </h2>
                  <p className="mt-4 text-gray-400 leading-relaxed max-w-md">
                    {ctaSubtext}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={callUrl}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {ctaButtonText}
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <PublicLeadForm
                  projectId={project.id}
                  companyId={project.companyId}
                  projectSlug={project.slug}
                  projectName={project.name}
                  fields={fields}
                  variant="dark"
                  headerTitle="Get a Callback"
                  headerSubtext="Our team will reach out within 30 minutes."
                  hideSource
                  returnPath={returnPath}
                />
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {project.company.name}. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-300">Powered by EstateFlow</p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ───────────────────────────────────── */}
      <StickyMobileCTA
        callUrl={callUrl}
        whatsappUrl={whatsappUrl}
        variant="light"
      />

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
    </main>
  );
}
