import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { LeadUpdateForm } from "@/components/forms/lead-update-form";
import { updateLead } from "./actions";
import { getCurrentCompany } from "@/lib/current-company";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const company = await getCurrentCompany();

  const lead = await prisma.lead.findUnique({
    where: {
      id,
      companyId: company.id,
    },
    include: {
      project: true,
      company: true,
    },
  });

  if (!lead) {
    notFound();
  }

  const updateLeadWithId = updateLead.bind(null, lead.id);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <div className="mb-8">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-2 text-sm font-medium text-white "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
            <p className="mt-1 text-sm text-white">
              Lead captured on {formatDate(lead.createdAt)}
            </p>
          </div>

          <span className="w-fit rounded-full bg-black px-4 py-2 text-xs font-medium text-white">
            {lead.status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-black">Customer Details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                  <User className="h-4 w-4" />
                  Name
                </div>
                <p className="font-semibold text-black">{lead.name}</p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <a
                  href={`tel:${lead.phone}`}
                  className="font-semibold text-black hover:underline"
                >
                  {lead.phone}
                </a>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="font-semibold text-black">{lead.email || "Not provided"}</p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                  <CalendarClock className="h-4 w-4" />
                  Follow-up
                </div>
                <p className="font-semibold text-black">
                  {lead.followUpAt ? formatDate(lead.followUpAt) : "Not set"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-black">Project Interest</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 text-sm font-medium text-black">
                  Project
                </div>
                <p className="font-semibold text-black">
                  {lead.project?.name || "No project"}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="font-semibold text-black">
                  {lead.project?.location || "Not available"}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 text-sm font-medium text-black">
                  Budget
                </div>
                <p className="font-semibold text-black">{lead.budget || "Not provided"}</p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 text-sm font-medium text-black">
                  Source
                </div>
                <p className="font-semibold text-black">{lead.source || "WEBSITE"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-black">Customer Message</h2>
            <p className="text-sm leading-6 text-black">
              {lead.message || "No message provided."}
            </p>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-black">Saved Notes</h2>
            <p className="whitespace-pre-wrap text-sm leading-6 text-black">
              {lead.notes || "No notes added yet."}
            </p>
          </section>
        </div>

        <LeadUpdateForm
          leadId={lead.id}
          currentStatus={lead.status}
          currentNotes={lead.notes}
          currentFollowUpAt={lead.followUpAt}
          updateAction={updateLeadWithId}
        />
      </div>
    </div>
  );
}