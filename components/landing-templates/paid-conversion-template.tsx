import {
  Phone,
  MessageCircle,
  MapPin,
  Download,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Clock,
  TrendingUp,
  Shield,
  ChevronRight,
  Building2,
} from "lucide-react";
import { PublicLeadForm } from "@/components/landing-form/public-lead-form";
import { ScrollReveal, StickyMobileCTA } from "./landing-shared";
import { parseFormConfig } from "@/lib/form-config";
import type { Project, Company, landingTemplate } from "@prisma/client";

type ProjectWithRelations = Project & {
  company: Company;
  template: landingTemplate | null;
};

type PaidConversionTemplateProps = {
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
    a: "Submit the enquiry form and our team will coordinate a visit at your convenience.",
  },
  {
    q: "Is this project RERA registered?",
    a: "Yes. Contact our team for the RERA registration number and full compliance details.",
  },
];

export function PaidConversionTemplate({
  project,
}: PaidConversionTemplateProps) {
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
    project.ctaHeading || "Get Exclusive Pricing Today";
  const ctaSubtext =
    project.ctaSubtext ||
    "Submit your details for priority access and the best available rates.";
  const ctaButtonText = project.ctaButtonText || "Get Pricing Now";

  const { fields } = parseFormConfig(project.formSettings);

  return (
    <main className="landing-page min-h-screen bg-white text-gray-900 antialiased">
      {/* ── Announcement Bar ────────────────────────────────────── */}
      <div className="bg-emerald-800 text-white py-2.5 px-4 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-wide">
          Limited Period Pricing Available — Call{" "}
          <a href={callUrl} className="underline underline-offset-2 font-bold">
            {companyPhone}
          </a>{" "}
          for Details
        </p>
      </div>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            {project.company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.company.logo}
                alt={project.company.name}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-sm font-bold text-gray-900 tracking-tight">
                {project.company.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={callUrl}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border-2 border-emerald-700 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {companyPhone}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero — Compact Above-Fold ───────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
            {/* Left — compact copy */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {project.status.replaceAll("_", " ")}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
                {project.name}
              </h1>

              <div className="mt-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-gray-300">
                  {project.location}
                </span>
              </div>

              {project.priceRange && project.showPricing && (
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {project.priceRange}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">
                    onwards
                  </span>
                </div>
              )}

              {project.description && (
                <p className="mt-4 text-gray-400 leading-relaxed max-w-lg text-sm">
                  {project.description}
                </p>
              )}

              {/* Key value props */}
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  { icon: TrendingUp, text: "High Growth Corridor" },
                  { icon: Shield, text: "RERA Registered" },
                  { icon: Building2, text: "Premium Construction" },
                  { icon: Clock, text: "On-Time Delivery Track Record" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/[0.08] px-3 py-2.5"
                  >
                    <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-gray-300">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={callUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/30"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                {project.showBrochure && project.brochureUrl && (
                  <a
                    href={project.brochureUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Brochure
                  </a>
                )}
              </div>
            </div>

            {/* Right — sticky lead form */}
            <div className="lg:sticky lg:top-16 animate-fade-in-up delay-200">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-white">
                <div className="bg-emerald-700 px-5 py-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                    Quick Enquiry
                  </p>
                  <h3 className="text-base font-extrabold mt-1 leading-tight">
                    Get Exclusive Pricing Today
                  </h3>
                </div>
                <div className="p-5">
                  <PublicLeadForm
                    projectId={project.id}
                    companyId={project.companyId}
                    projectSlug={project.slug}
                    projectName={project.name}
                    fields={fields}
                    variant="accent"
                    hideHeader
                    hideSource
                  />
                </div>
                <div className="bg-emerald-50 border-t border-emerald-100 px-5 py-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    Our team responds within 15 minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ─────────────────────────────────────────── */}
      <section className="bg-emerald-700 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-200" />
              <span>RERA Registered</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-emerald-500" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-200" />
              <span>Bank Approved</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-emerald-500" />
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-200" />
              <span>Trusted Developer</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero Image ──────────────────────────────────────────── */}
      {project.showHeroImage && project.heroImage && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.heroImage}
                alt={project.name}
                className="w-full h-64 sm:h-80 lg:h-[400px] object-cover"
              />
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Why Choose — Amenities ──────────────────────────────── */}
      {amenities.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-100 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-6 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Why Choose This Project
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {project.name} — Key Highlights
              </h2>
            </ScrollReveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((item, i) => (
                <ScrollReveal key={item} delay={i * 40}>
                  <div className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 px-5 py-4 shadow-sm hover:border-emerald-200 hover:shadow-emerald-50 transition-all">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
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

      {/* ── Price + CTA Block ───────────────────────────────────── */}
      {project.showPricing && project.priceRange && (
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <ScrollReveal>
              <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-10 text-white text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-2">
                  Attractive Pricing
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold">
                  {project.priceRange}
                </p>
                <p className="mt-2 text-sm text-emerald-100">
                  onwards · EMI options available with partner banks
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={callUrl}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                    {ctaButtonText}
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Gallery ─────────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-6 rounded-full bg-emerald-600" />
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Project Photos
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((url, i) => (
              <ScrollReveal key={`${url}-${i}`} delay={i * 60}>
                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm group">
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

      {/* ── Location ────────────────────────────────────────────── */}
      {locationHighlights.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-6 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Connectivity
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Prime Location Advantages
              </h2>
            </ScrollReveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {locationHighlights.map((item, i) => (
                <ScrollReveal key={item} delay={i * 50}>
                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                    <Navigation className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700">
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
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
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

      {/* ── Mid-Page Enquiry Form ───────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Get a Callback in 15 Minutes
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Our project specialists are available to answer all your questions.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
              <PublicLeadForm
                projectId={project.id}
                companyId={project.companyId}
                projectSlug={project.slug}
                projectName={project.name}
                fields={fields}
                variant="accent"
                hideHeader
                hideSource
                buttonClassName="w-full rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-6 rounded-full bg-emerald-600" />
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
          </ScrollReveal>
          <div className="space-y-2">
            {FAQ_ITEMS.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 60}>
                <details className="group rounded-xl border border-gray-100 bg-white overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none">
                    <h3 className="text-sm font-bold text-gray-900 pr-4">
                      {faq.q}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-gray-100 px-5 py-4">
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

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="bg-gray-950 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              {ctaHeading}
            </h2>
            <p className="mt-3 text-gray-400 text-sm max-w-md mx-auto">
              {ctaSubtext}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={callUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-extrabold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/30"
              >
                <Phone className="h-4 w-4" />
                {ctaButtonText}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-8 py-4 text-sm font-bold text-white hover:bg-white/5 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Now
              </a>
            </div>
            <p className="mt-5 text-xs text-gray-600">
              No spam. Instant callback from our team.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 bg-gray-950 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {project.company.name}. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-700">Powered by EstateFlow</p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ───────────────────────────────────── */}
      <StickyMobileCTA
        callUrl={callUrl}
        whatsappUrl={whatsappUrl}
        variant="accent"
        callLabel="Call Now"
        whatsappLabel="WhatsApp"
      />

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
    </main>
  );
}
