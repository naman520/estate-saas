"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";



export async function updateCompanySettings(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const logo = String(formData.get("logo") || "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") || "").trim();
  const receiptFooter = String(formData.get("receiptFooter") || "").trim();
  const company = await getCurrentCompany();

  if (!name) {
    throw new Error("Company name is required.");
  }

  await prisma.company.update({
    where: {
      id: company.id,
    },
    data: {
      name,
      phone: phone || null,
      email: email || null,
      logo: logo || null,
      whatsappNumber: whatsappNumber || null,
      receiptFooter: receiptFooter || null,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/receipts");
  revalidatePath("/dashboard/projects");

  redirect("/dashboard/settings?updated=true");
}