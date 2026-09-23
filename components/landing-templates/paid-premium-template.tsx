import {
  Phone,
  MessageCircle,
  MapPin,
  Download,
  CheckCircle2,
  Navigation,
  ChevronRight,
  ArrowRight,
  Building2,
  Shield,
} from "lucide-react";
import { PublicLeadForm } from "@/components/landing-form/public-lead-form";
import { ScrollReveal, StickyMobileCTA } from "./landing-shared";
import { parseFormConfig } from "@/lib/form-config";
import type { Project, Company, landingTemplate } from "@prisma/client";

type ProjectWithRelations = Project & {
  company: Company;
  template: landingTemplate | null;
};

type PaidPremiumTemplateProps = {
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

const FAQ_ITEMS = [
  {
    q: "What is the possession timeline?",
    a: "Please contact our sales team for the latest possession schedule and construction updates.",
  },
  {
    q: "Are bank loans available?",
    a: "Yes, we have tie-ups with leading banks and NBFCs offering competitive home loan rates.",
  },
  {
    q: "Can I schedule a site visit?",
    a: "Absolutely. Submit the enquiry form and our team will coordinate a visit at your convenience.",
  },
];

export function PaidPremiumTemplate({ project, returnPath }: PaidPremiumTemplateProps) {
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

  const ctaHeading =
    project.ctaHeading || "Schedule Your Private Site Visit";
  const ctaSubtext =
    project.ctaSubtext ||
    "Experience the project first-hand with a guided tour by our experts.";
  const ctaButtonText = project.ctaButtonText || "Book Site Visit";

  const { fields } = parseFormConfig(project.formSettings);

  return (
    <main className="landing-page min-h-screen bg-white text-gray-900 antialiased">
      {/* ── Navigation ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            {project.company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.company.logo}
                alt={project.company.name}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-800" />
                <span className="text-sm font-bold text-gray-900 tracking-tight">
                  {project.company.name}
                </span>
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#about" className="hover:text-gray-900 transition-colors">
              About
            </a>
            {amenities.length > 0 && (
              <a href="#amenities" className="hover:text-gray-900 transition-colors">
                Amenities
              </a>
            )}
            {galleryImages.length > 0 && (
              <a href="#gallery" className="hover:text-gray-900 transition-colors">
                Gallery
              </a>
            )}
            {locationHighlights.length > 0 && (
              <a href="#location" className="hover:text-gray-900 transition-colors">
                Location
              </a>
            )}
            <a href="#contact" className="hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={callUrl}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Book Visit
            </a>
          </div>
        </div>
      </header>

      {/* ── Cinematic Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" id="about">
        {project.showHeroImage && project.heroImage ? (
          <>
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.heroImage}
              alt={project.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />

            {/* Content over hero image */}
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-24 lg:py-32 min-h-[500px] lg:min-h-[600px] flex items-center">
              <div className="max-w-2xl animate-fade-in-up">
                <div className="flex items-center gap-3 mb-5">
                  <span className="rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white/90 uppercase tracking-wide border border-white/10">
                    {project.status.replaceAll("_", " ")}
                  </span>
                  <span className="text-xs text-white/50 font-medium">
                    by {project.company.name}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  {project.name}
                </h1>

                <div className="mt-5 flex items-center gap-2 text-white/70">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{project.location}</span>
                </div>

                {project.priceRange && project.showPricing && (
                  <div className="mt-8 inline-flex flex-col gap-1 rounded-xl bg-white/10 backdrop-blur-sm px-6 py-4 border border-white/10">
                    <span className="text-xs font-medium uppercase tracking-widest text-white/60">
                      Starting From
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {project.priceRange}
                    </span>
                  </div>
                )}

                {project.description && (
                  <p className="mt-8 text-white/60 leading-relaxed max-w-lg">
                    {project.description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    {ctaButtonText}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  {project.showBrochure && project.brochureUrl && (
                    <a
                      href={project.brochureUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Brochure
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No hero image — gradient background */
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 lg:py-28">
              <div className="max-w-2xl animate-fade-in-up">
                <div className="flex items-center gap-3 mb-5">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wide">
                    {project.status.replaceAll("_", " ")}
                  </span>
                  <span className="text-xs text-white/40 font-medium">
                    by {project.company.name}
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
                  {project.name}
                </h1>

                <div className="mt-5 flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{project.location}</span>
                </div>

                {project.priceRange && project.showPricing && (
                  <div className="mt-8 inline-flex flex-col gap-1 rounded-xl bg-white/10 px-6 py-4">
                    <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                      Starting From
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {project.priceRange}
                    </span>
                  </div>
                )}

                {project.description && (
                  <p className="mt-8 text-white/50 leading-relaxed max-w-lg">
                    {project.description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-gray-100 transition-colors"
                  >
                    {ctaButtonText}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Trust Strip ─────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                RERA Registered
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Premium Construction
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-700" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Trusted Developer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Project Story ───────────────────────────────────────── */}
      {project.description && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_320px] items-start">
              <ScrollReveal>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    About the Project
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                    {project.name}
                  </h2>
                  <div className="mt-1 h-1 w-12 rounded-full bg-slate-800" />
                  <p className="mt-6 text-gray-600 leading-8 text-base">
                    {project.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={callUrl}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                    {project.showBrochure && project.brochureUrl && (
                      <a
                        href={project.brochureUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download Brochure
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>

              {/* Stats sidebar */}
              <ScrollReveal delay={150}>
                <div className="space-y-4 lg:sticky lg:top-24">
                  {project.showPricing && project.priceRange && (
                    <div className="rounded-xl bg-slate-900 p-5 text-white">
                      <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-1">
                        Price Range
                      </p>
                      <p className="text-xl font-bold">{project.priceRange}</p>
                    </div>
                  )}
                  {project.showLocation && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {project.location}
                      </p>
                      {project.mapLink && (
                        <a
                          href={project.mapLink}
                          target="_blank"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          View Map
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">
                      Status
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {project.status.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ─────────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="bg-slate-50 border-y border-gray-100 py-20" id="gallery">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <ScrollReveal>
              <div className="mb-10">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Visual Tour
                </span>
                <h2 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                  Project Gallery
                </h2>
                <div className="mt-1 h-1 w-12 rounded-full bg-slate-800" />
              </div>
            </ScrollReveal>

            {/* Premium gallery layout — first large, rest in grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((url, i) => (
                <ScrollReveal
                  key={`${url}-${i}`}
                  delay={i * 80}
                  className={
                    i === 0 && galleryImages.length > 2
                      ? "sm:col-span-2 sm:row-span-2"
                      : ""
                  }
                >
                  <div className="overflow-hidden rounded-xl group h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${project.name} gallery ${i + 1}`}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                        i === 0 && galleryImages.length > 2
                          ? "min-h-[300px] sm:min-h-[400px]"
                          : "h-52 sm:h-60"
                      }`}
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Amenities ───────────────────────────────────────────── */}
      {amenities.length > 0 && (
        <section className="py-20" id="amenities">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <ScrollReveal>
              <div className="mb-10">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Lifestyle
                </span>
                <h2 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                  World-Class Amenities
                </h2>
                <div className="mt-1 h-1 w-12 rounded-full bg-slate-800" />
                <p className="mt-3 text-sm text-gray-500 max-w-lg">
                  Curated amenities designed to elevate everyday living into an experience.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((item, i) => (
                <ScrollReveal key={item} delay={i * 50}>
                  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 hover:border-slate-200 hover:shadow-sm transition-all">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-slate-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {item}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Location ────────────────────────────────────────────── */}
      {locationHighlights.length > 0 && (
        <section
          className="bg-slate-900 text-white py-20"
          id="location"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <ScrollReveal>
              <div className="mb-10">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Connectivity
                </span>
                <h2 className="mt-2 text-3xl font-bold text-white tracking-tight">
                  Location Advantages
                </h2>
                <div className="mt-1 h-1 w-12 rounded-full bg-white/30" />
              </div>
            </ScrollReveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {locationHighlights.map((item, i) => (
                <ScrollReveal key={item} delay={i * 60}>
                  <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                    <Navigation className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-gray-300">
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
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gray-300 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                  <ArrowRight className="h-4 w-4" />
                </a>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* ── Brochure Section ────────────────────────────────────── */}
      {project.showBrochure && project.brochureUrl && (
        <section className="py-16 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl bg-slate-50 border border-gray-100 px-8 py-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Download Project Brochure
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get detailed floor plans, specifications, and pricing in our comprehensive brochure.
                  </p>
                </div>
                <a
                  href={project.brochureUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shrink-0"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Have Questions?
              </span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="mt-2 mx-auto h-1 w-12 rounded-full bg-slate-800" />
            </div>
          </ScrollReveal>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 80}>
                <details className="group rounded-xl border border-gray-100 bg-white overflow-hidden">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none">
                    <h3 className="text-sm font-bold text-gray-900 pr-4">
                      {faq.q}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-gray-100 px-6 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / Lead Form ─────────────────────────────────── */}
      <section
        className="bg-slate-50 border-t border-gray-100 py-20"
        id="contact"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <ScrollReveal>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Get in Touch
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                  {ctaHeading}
                </h2>
                <div className="mt-1 h-1 w-12 rounded-full bg-slate-800" />
                <p className="mt-4 text-gray-500 leading-relaxed max-w-md">
                  {ctaSubtext}
                </p>

                {/* Contact options */}
                <div className="mt-8 space-y-3">
                  <a
                    href={callUrl}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white group-hover:bg-slate-800 transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">Call Us</p>
                      <p className="text-sm font-bold text-gray-900">
                        {project.company.phone || companyPhone}
                      </p>
                    </div>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366] text-white">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">WhatsApp</p>
                      <p className="text-sm font-bold text-gray-900">
                        Send a message
                      </p>
                    </div>
                  </a>
                  {project.company.email && (
                    <a
                      href={`mailto:${project.company.email}`}
                      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Email</p>
                        <p className="text-sm font-bold text-gray-900">
                          {project.company.email}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Lead form */}
            <ScrollReveal delay={150}>
              <div className="rounded-2xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-slate-900 px-6 py-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Request Callback
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Our team responds within 30 minutes
                  </p>
                </div>
                <div className="p-6">
                  <PublicLeadForm
                    projectId={project.id}
                    companyId={project.companyId}
                    projectSlug={project.slug}
                    projectName={project.name}
                    fields={fields}
                    variant="minimal"
                    hideHeader
                    hideSource
                    returnPath={returnPath}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      {project.showContactCta && (
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {ctaHeading}
              </h2>
              <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                {ctaSubtext}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={callUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <Phone className="h-4 w-4" />
                  {ctaButtonText}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              {project.company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.company.logo}
                  alt={project.company.name}
                  className="h-6 w-auto object-contain"
                />
              ) : (
                <>
                  <Building2 className="h-4 w-4 text-slate-700" />
                  <span className="text-sm font-bold text-gray-900">
                    {project.company.name}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-5 text-xs text-gray-500 font-medium">
              {project.company.phone && (
                <a href={callUrl} className="hover:text-gray-900 transition-colors">
                  {project.company.phone}
                </a>
              )}
              {project.company.email && (
                <a
                  href={`mailto:${project.company.email}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {project.company.email}
                </a>
              )}
            </div>
            <p className="text-xs text-gray-400">Powered by EstateFlow</p>
          </div>
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
