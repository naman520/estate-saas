import {
  Phone,
  MessageCircle,
  MapPin,
  Download,
  Navigation,
  ArrowRight,
} from "lucide-react";
import { PublicLeadForm } from "@/components/landing-form/public-lead-form";
import { ScrollReveal, StickyMobileCTA } from "./landing-shared";
import { parseFormConfig } from "@/lib/form-config";
import type { Project, Company, landingTemplate } from "@prisma/client";

type ProjectWithRelations = Project & {
  company: Company;
  template: landingTemplate | null;
};

type FreeLuxuryTemplateProps = {
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

export function FreeLuxuryTemplate({ project, returnPath }: FreeLuxuryTemplateProps) {
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

  const ctaHeading = project.ctaHeading || "Register Your Interest";
  const ctaSubtext =
    project.ctaSubtext ||
    "Connect with our team for an exclusive walkthrough and priority access.";
  const ctaButtonText = project.ctaButtonText || "Call Now";

  const { fields } = parseFormConfig(project.formSettings);

  /* Accent color — warm bronze, not gold */
  const accent = "#c8b08c";

  return (
    <main className="landing-page min-h-screen bg-[#141414] text-white antialiased">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#141414]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            {project.company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.company.logo}
                alt={project.company.name}
                className="h-7 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: accent }}
              >
                {project.company.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={callUrl}
              className="hidden sm:inline-flex items-center gap-2 rounded border px-4 py-2 text-xs font-medium tracking-widest uppercase transition-colors hover:bg-white/5"
              style={{ borderColor: `${accent}40`, color: accent }}
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-semibold tracking-widest text-[#141414] uppercase transition-colors"
              style={{ backgroundColor: accent }}
            >
              Enquire
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero — Full-Viewport Image ──────────────────────────── */}
      {project.showHeroImage && project.heroImage ? (
        <section className="relative h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden">
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.heroImage}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-[#141414]/30" />

          {/* Content over image */}
          <div className="relative h-full flex flex-col justify-end">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 pb-14 lg:pb-20">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-10" style={{ backgroundColor: accent }} />
                  <span
                    className="text-xs font-medium tracking-[0.25em] uppercase"
                    style={{ color: accent }}
                  >
                    {project.status.replaceAll("_", " ")}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
                  {project.name}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: accent }} />
                  <span className="text-sm tracking-wide">{project.location}</span>
                </div>

                {project.priceRange && project.showPricing && (
                  <div className="mt-6">
                    <span className="text-2xl sm:text-3xl font-light text-white">
                      {project.priceRange}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-fade-in delay-500">
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-gray-500 to-transparent" />
          </div>
        </section>
      ) : (
        /* Fallback hero without image */
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1610] via-[#141414] to-[#141414]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20 lg:py-28">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10" style={{ backgroundColor: accent }} />
                <span
                  className="text-xs font-medium tracking-[0.25em] uppercase"
                  style={{ color: accent }}
                >
                  {project.status.replaceAll("_", " ")} · {project.company.name}
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.05]">
                {project.name}
              </h1>

              <div className="mt-5 flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: accent }} />
                <span className="text-sm tracking-wide">{project.location}</span>
              </div>

              {project.priceRange && project.showPricing && (
                <p className="mt-8 text-3xl font-light text-white">
                  {project.priceRange}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Introduction ────────────────────────────────────────── */}
      {project.description && (
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
            <ScrollReveal>
              <div
                className="h-px w-16 mx-auto mb-8"
                style={{ backgroundColor: `${accent}50` }}
              />
              <p className="text-lg sm:text-xl leading-8 text-gray-400 font-light">
                {project.description}
              </p>
              <div
                className="h-px w-16 mx-auto mt-8"
                style={{ backgroundColor: `${accent}50` }}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Action Buttons ──────────────────────────────────────── */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={callUrl}
                className="inline-flex items-center gap-3 rounded border px-7 py-3.5 text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:text-[#141414]"
                style={{
                  borderColor: accent,
                  color: accent,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = accent;
                  (e.currentTarget as HTMLElement).style.color = "#141414";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.color = accent;
                }}
              >
                <Phone className="h-4 w-4" />
                {ctaButtonText}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                className="inline-flex items-center gap-3 rounded border border-white/10 px-7 py-3.5 text-sm font-medium tracking-widest text-gray-400 uppercase hover:bg-white/5 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              {project.showBrochure && project.brochureUrl && (
                <a
                  href={project.brochureUrl}
                  target="_blank"
                  className="inline-flex items-center gap-3 rounded border border-white/10 px-7 py-3.5 text-sm font-medium tracking-widest text-gray-400 uppercase hover:bg-white/5 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Brochure
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Gallery ─────────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-8" style={{ backgroundColor: accent }} />
              <h2
                className="text-xs tracking-[0.3em] uppercase font-medium"
                style={{ color: accent }}
              >
                Gallery
              </h2>
            </div>
          </ScrollReveal>

          {/* Art-directed grid — first image large */}
          <div className="grid gap-3 sm:grid-cols-2">
            {galleryImages.map((url, i) => (
              <ScrollReveal
                key={`${url}-${i}`}
                delay={i * 100}
                className={i === 0 && galleryImages.length > 2 ? "sm:col-span-2" : ""}
              >
                <div className="overflow-hidden rounded-sm group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${project.name} gallery ${i + 1}`}
                    className={`w-full object-cover transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 ${
                      i === 0 && galleryImages.length > 2
                        ? "h-64 sm:h-96"
                        : "h-52 sm:h-64"
                    }`}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Amenities ───────────────────────────────────────────── */}
      {amenities.length > 0 && (
        <section className="py-16 border-t border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px w-8" style={{ backgroundColor: accent }} />
                <h2
                  className="text-xs tracking-[0.3em] uppercase font-medium"
                  style={{ color: accent }}
                >
                  Amenities
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-white/[0.06] rounded-sm overflow-hidden">
              {amenities.map((item, i) => (
                <ScrollReveal key={item} delay={i * 40}>
                  <div className="flex items-center gap-4 bg-white/[0.02] px-6 py-5 border-b border-r border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                    <div
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    <span className="text-sm text-gray-300 tracking-wide">
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
        <section className="py-16 border-t border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px w-8" style={{ backgroundColor: accent }} />
                <h2
                  className="text-xs tracking-[0.3em] uppercase font-medium"
                  style={{ color: accent }}
                >
                  Location
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {locationHighlights.map((item, i) => (
                <ScrollReveal key={item} delay={i * 60}>
                  <div className="flex items-start gap-4 border border-white/[0.06] bg-white/[0.02] px-6 py-5 rounded-sm">
                    <Navigation
                      className="h-4 w-4 mt-0.5 shrink-0"
                      style={{ color: accent }}
                    />
                    <span className="text-sm text-gray-300 tracking-wide">
                      {item}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {project.mapLink && (
              <ScrollReveal delay={200}>
                <a
                  href={project.mapLink}
                  target="_blank"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium tracking-wider transition-colors"
                  style={{ color: accent }}
                >
                  View on Google Maps
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* ── Enquiry Section ─────────────────────────────────────── */}
      <section
        id="enquiry"
        className="py-20 border-t border-white/[0.06]"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-2 items-start">
            <ScrollReveal>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-8" style={{ backgroundColor: accent }} />
                  <h2
                    className="text-xs tracking-[0.3em] uppercase font-medium"
                    style={{ color: accent }}
                  >
                    Enquire
                  </h2>
                </div>
                <h3 className="text-3xl sm:text-4xl font-light text-white leading-tight">
                  {ctaHeading}
                </h3>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-md">
                  {ctaSubtext}
                </p>
                <div className="mt-8 flex gap-4">
                  <a
                    href={callUrl}
                    className="inline-flex items-center gap-2 rounded border px-6 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-300"
                    style={{ borderColor: accent, color: accent }}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {ctaButtonText}
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded border border-white/10 px-6 py-3 text-xs font-medium tracking-widest text-gray-400 uppercase hover:bg-white/5 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
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
                hideSource
                returnPath={returnPath}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#0a0a0a] py-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-xs tracking-[0.2em] uppercase font-medium"
            style={{ color: accent }}
          >
            {project.company.name}
          </span>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {project.company.name}. All rights
            reserved. Powered by EstateFlow.
          </p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ───────────────────────────────────── */}
      <StickyMobileCTA
        callUrl={callUrl}
        whatsappUrl={whatsappUrl}
        variant="dark"
      />

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
    </main>
  );
}
