"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";

function generateReceiptNumber(count: number) {
  const nextNumber = count + 1;
  return `EF-${String(nextNumber).padStart(4, "0")}`;
}

export async function createReceipt(formData: FormData) {
  const customerName = String(formData.get("customerName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const projectId = String(formData.get("projectId") || "").trim();
  const amountValue = String(formData.get("amount") || "").trim();
  const paymentMode = String(formData.get("paymentMode") || "").trim();
  const transactionId = String(formData.get("transactionId") || "").trim();
  const unitDetails = String(formData.get("unitDetails") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!customerName) {
    throw new Error("Customer name is required.");
  }

  if (!amountValue) {
    throw new Error("Amount is required.");
  }

  if (!paymentMode) {
    throw new Error("Payment mode is required.");
  }

  const amount = Number(amountValue);

  if (Number.isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a valid positive number.");
  }

  const company = await getCurrentCompany();

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: company.id,
      },
    });

    if (!project) {
      throw new Error("Invalid project selected.");
    }
  }

  const receiptCount = await prisma.receipt.count({
    where: {
      companyId: company.id,
    },
  });

  const receiptNumber = generateReceiptNumber(receiptCount);

  await prisma.receipt.create({
    data: {
      companyId: company.id,
      projectId: projectId || null,
      receiptNumber,
      customerName,
      phone: phone || null,
      amount,
      paymentMode,
      transactionId: transactionId || null,
      unitDetails: unitDetails || null,
      notes: notes || null,
    },
  });

  redirect("/dashboard/receipts");
}