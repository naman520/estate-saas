import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Globe,
  LayoutTemplate,
  MousePointerClick,
  Receipt,
  Sparkles,
  Users,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "EstateFlow — Launch property websites & close more bookings",
  description:
    "EstateFlow gives builders and brokers a high-converting landing page for every project, a lead pipeline, follow-ups and payment receipts — all in one place.",
};

/* -------------------------------------------------------------------------- */
/*                                   Content                                  */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: "Landing pages in minutes",
    body: "Pick a template, add your project details and go live. Clean, luxury and conversion-focused designs built for real estate.",
  },
  {
    icon: Globe,
    title: "Your own domain",
    body: "Connect greenvalley.in or plots.yourbrand.com. DNS verification and SSL are handled for you.",
  },
  {
    icon: MousePointerClick,
    title: "Lead forms you control",
    body: "Drag-and-drop form fields, choose where the form sits, and stop duplicate enquiries automatically.",
  },
  {
    icon: BarChart3,
    title: "Know which ad worked",
    body: "UTM tags, Facebook and Google click IDs are saved with every lead, so you can see which campaign brought the booking.",
  },
  {
    icon: Users,
    title: "A pipeline built for site visits",
    body: "New → Contacted → Site visit → Negotiation → Booked. Filter by project, status or source in one click.",
  },
  {
    icon: CalendarClock,
    title: "Never miss a follow-up",
    body: "Set a follow-up date on any lead. Overdue, today and upcoming calls are waiting for you on the dashboard.",
  },
  {
    icon: Receipt,
    title: "Payment receipts, instantly",
    body: "Record token and booking payments and download a PDF receipt with your company name and footer.",
  },
  {
    icon: ShieldCheck,
    title: "Private & role-based",
    body: "Every company's projects, leads and receipts are isolated. Admin and sales roles control who can change pages, domains and settings.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Add your project",
    body: "Name, location, price range, photos, amenities and brochure.",
  },
  {
    n: "02",
    title: "Publish the landing page",
    body: "Choose a template, customise the form and connect your domain.",
  },
  {
    n: "03",
    title: "Run ads, close bookings",
    body: "Leads land in your pipeline with their ad source. Follow up, book the visit, issue the receipt.",
  },
];

const AI_FEATURES = [
  "Write landing page copy, amenities and SEO text from basic project details",
  "A 24/7 property assistant on every page that answers buyer questions and qualifies leads",
  "Lead scoring so your team calls the hottest buyers first",
];

const FAQS = [
  {
    q: "Who is EstateFlow for?",
    a: "Builders, developers, channel partners and brokers in India who sell projects and plots through online ads and need a simple way to capture and convert those leads.",
  },
  {
    q: "Do I need a developer to set it up?",
    a: "No. You fill in your project details, pick a template and publish. Connecting a custom domain only needs one DNS record, and we show you exactly what to add.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Every project can have its own domain or subdomain with free SSL. Until then, it lives on an EstateFlow link you can share right away.",
  },
  {
    q: "Is my data separate from other companies?",
    a: "Yes. Every company's projects, leads and receipts are isolated, and team roles control who can change what.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  const primaryHref = isSignedIn ? "/dashboard" : "/sign-up";
  const primaryLabel = isSignedIn ? "Go to dashboard" : "Get started free";

  return (
    <div className="min-h-screen bg-white text-gray-950">
      {/* ------------------------------- Navbar ------------------------------- */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-950 text-sm font-black text-white">
              E
            </span>
            <span className="text-lg font-bold tracking-tight">EstateFlow</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-gray-600 md:flex">
            <a href="#features" className="hover:text-gray-950">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-gray-950">
              How it works
            </a>
            <a href="#pricing" className="hover:text-gray-950">
              Pricing
            </a>
            <a href="#faq" className="hover:text-gray-950">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-2">
            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="hidden h-10 items-center rounded-xl px-4 text-sm font-semibold text-gray-700 hover:bg-gray-100 sm:inline-flex"
              >
                Sign in
              </Link>
            )}
            <Link
              href={primaryHref}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white hover:bg-gray-800"
            >
              {isSignedIn ? "Dashboard" : "Get started"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* -------------------------------- Hero -------------------------------- */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_60%)]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Built for Indian builders & brokers
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Turn ad clicks into{" "}
                <span className="text-emerald-600">site visits</span> and
                bookings.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                A high-converting landing page for every project, a lead
                pipeline that tracks which ad worked, follow-up reminders and
                payment receipts, all in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 text-base font-semibold text-white hover:bg-gray-800"
                >
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 text-base font-semibold text-gray-950 hover:bg-gray-100"
                >
                  See how it works
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
                {["Free plan available", "No coding needed", "Custom domains + SSL"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <HeroMockup />
          </div>
        </section>

        {/* ------------------------------ Problem ------------------------------- */}
        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
            {[
              {
                stat: "Leads in 5 places",
                body: "Facebook forms, WhatsApp, Excel sheets and missed calls. Nobody knows who followed up.",
              },
              {
                stat: "Ad spend in the dark",
                body: "You pay for clicks but can't tell which campaign actually brought the booking.",
              },
              {
                stat: "Weeks for one website",
                body: "Every new project means waiting on a developer for yet another landing page.",
              },
            ].map((item) => (
              <div key={item.stat}>
                <p className="text-lg font-bold">{item.stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------ Features ------------------------------ */}
        <section id="features" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <SectionHeading
              eyebrow="Features"
              title="Everything between the ad and the booking"
              subtitle="EstateFlow replaces the website builder, the lead spreadsheet and the receipt book."
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gray-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------- How it works ---------------------------- */}
        <section id="how-it-works" className="scroll-mt-20 bg-gray-950 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <SectionHeading
              dark
              eyebrow="How it works"
              title="Live in an afternoon"
              subtitle="From a new project to your first lead, without writing code."
            />

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------- AI ---------------------------------- */}
        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="grid items-center gap-10 rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-white p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-950 px-3 py-1 text-xs font-bold text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  Coming soon
                </span>
                <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                  AI that works your leads while you sleep
                </h2>
                <p className="mt-4 text-gray-600">
                  We&apos;re building an AI layer on top of EstateFlow, trained on
                  your own projects and inventory.
                </p>
              </div>
              <ul className="space-y-4">
                {AI_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-800"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------- Pricing ------------------------------ */}
        <section id="pricing" className="scroll-mt-20 border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <SectionHeading
              eyebrow="Pricing"
              title="Start free. Upgrade when it pays for itself."
            />

            <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
              <PricingCard
                name="Free"
                price="₹0"
                tagline="For your first project"
                features={[
                  "Unlimited projects & landing pages",
                  "Clean and Luxury templates",
                  "Lead pipeline & follow-ups",
                  "PDF payment receipts",
                  "Custom domain with SSL",
                ]}
                ctaHref={primaryHref}
                ctaLabel={isSignedIn ? "Go to dashboard" : "Start free"}
              />
              <PricingCard
                highlighted
                name="Pro"
                price="Early access"
                tagline="For teams running ads at scale"
                features={[
                  "Everything in Free",
                  "Conversion and Premium templates",
                  "Team members & roles (coming soon)",
                  "Priority support",
                  "First access to AI features",
                ]}
                ctaHref={primaryHref}
                ctaLabel={isSignedIn ? "Go to dashboard" : "Start free, upgrade later"}
              />
            </div>
          </div>
        </section>

        {/* --------------------------------- FAQ -------------------------------- */}
        <section id="faq" className="scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" />

            <div className="mt-12 divide-y divide-gray-200 rounded-2xl border border-gray-200">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    {faq.q}
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gray-300 text-sm transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Final CTA ----------------------------- */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-gray-950 px-6 py-16 text-center text-white sm:px-12">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Your next project deserves better than a spreadsheet.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Set up your first landing page today and see where every lead
              comes from.
            </p>
            <Link
              href={primaryHref}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-gray-950 hover:bg-gray-200"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* ------------------------------- Footer ------------------------------- */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} EstateFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-gray-950">
              Features
            </a>
            <a href="#pricing" className="hover:text-gray-950">
              Pricing
            </a>
            <Link href={isSignedIn ? "/dashboard" : "/sign-in"} className="hover:text-gray-950">
              {isSignedIn ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p
        className={`text-sm font-bold uppercase tracking-widest ${
          dark ? "text-emerald-400" : "text-emerald-600"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg ${dark ? "text-gray-400" : "text-gray-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PricingCard({
  name,
  price,
  tagline,
  features,
  ctaHref,
  ctaLabel,
  highlighted = false,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  ctaHref: string;
  ctaLabel: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl p-8 ${
        highlighted
          ? "bg-gray-950 text-white ring-1 ring-gray-950"
          : "border border-gray-200 bg-white"
      }`}
    >
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-500">
        {name}
      </p>
      <p className="mt-4 text-4xl font-black tracking-tight">{price}</p>
      <p className={`mt-2 text-sm ${highlighted ? "text-gray-400" : "text-gray-600"}`}>
        {tagline}
      </p>

      <ul className="mt-8 flex-1 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`mt-8 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold ${
          highlighted
            ? "bg-white text-gray-950 hover:bg-gray-200"
            : "bg-gray-950 text-white hover:bg-gray-800"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

/** Product preview built with plain markup — no screenshots to maintain. */
function HeroMockup() {
  const leads = [
    { name: "Rahul Khanna", project: "Green Valley Plots", source: "facebook", status: "Site visit", tone: "bg-amber-100 text-amber-800" },
    { name: "Priya Iyer", project: "Skyline Residency", source: "google", status: "New", tone: "bg-blue-100 text-blue-800" },
    { name: "Arjun Malhotra", project: "Green Valley Plots", source: "facebook", status: "Booked", tone: "bg-emerald-100 text-emerald-800" },
    { name: "Sneha Kapoor", project: "Skyline Residency", source: "website", status: "Contacted", tone: "bg-gray-100 text-gray-800" },
  ];

  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-emerald-100 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10">
        {/* window bar */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="ml-3 truncate rounded-md bg-white px-2 py-0.5 font-mono text-[11px] text-gray-500">
            app.estateflow / dashboard
          </span>
        </div>

        <div className="p-5">
          {/* stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "New leads", value: "48" },
              { label: "Site visits", value: "17" },
              { label: "Booked", value: "6" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-200 p-3">
                <p className="text-[11px] font-semibold text-gray-500">{s.label}</p>
                <p className="mt-1 text-2xl font-black">{s.value}</p>
              </div>
            ))}
          </div>

          {/* leads table */}
          <div className="mt-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
              <p className="text-xs font-bold">Recent leads</p>
              <p className="text-[11px] font-semibold text-gray-500">This week</p>
            </div>
            <ul className="divide-y divide-gray-100">
              {leads.map((l) => (
                <li key={l.name} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{l.name}</p>
                    <p className="truncate text-[11px] text-gray-500">
                      {l.project} · <span className="font-mono">utm={l.source}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${l.tone}`}>
                    {l.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* receipt toast */}
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-950 px-4 py-3 text-white">
            <FileText className="h-4 w-4 text-emerald-400" />
            <p className="text-xs font-semibold">
              Receipt EF-0007 generated · ₹2,00,000 token received
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
