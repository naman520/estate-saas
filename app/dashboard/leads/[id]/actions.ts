"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "SITE_VISIT_PLANNED"
  | "SITE_VISIT_DONE"
  | "NEGOTIATION"
  | "BOOKED"
  | "LOST";

export async function updateLead(leadId: string, formData: FormData) {
  const status = String(formData.get("status") || "NEW") as LeadStatus;
  const notes = String(formData.get("notes") || "").trim();
  const followUpAtValue = String(formData.get("followUpAt") || "").trim();
  const company = await getCurrentCompany();
  const followUpAt = followUpAtValue ? new Date(followUpAtValue) : null;

  const lead = await prisma.lead.findFirst({
  where: {
    id: leadId,
    companyId: company.id,
  },
});

if (!lead) {
  throw new Error("Lead not found.");
}

  await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status,
      notes: notes || null,
      followUpAt,
    },
  });

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);

  redirect(`/dashboard/leads/${leadId}`);
}