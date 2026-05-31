import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { ReceiptForm } from "@/components/forms/reciept-form";
import { createReceipt } from "../actions";

export default async function NewReceiptPage() {
  const projects = await prisma.project.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <PageContainer>
      <Link
        href="/dashboard/receipts"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to receipts
      </Link>

      <PageHeader
        title="New Receipt"
        description="Create a payment receipt record for a customer booking or payment."
      />

      <ReceiptForm projects={projects} createAction={createReceipt} />
    </PageContainer>
  );
}