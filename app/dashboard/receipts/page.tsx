import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentCompany } from "@/lib/current-company";


export default async function ReceiptsPage() {
  const company = await getCurrentCompany();

  const receipts = await prisma.receipt.findMany({
    where:{
      companyId: company.id,
    },
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageContainer>
      <PageHeader
        title="Receipts"
        description="Create and manage customer payment receipts."
        action={
          <Link href="/dashboard/receipts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Receipt
            </Button>
          </Link>
        }
      />

      <Card className="overflow-hidden">
        {receipts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <h2 className="text-lg font-bold text-gray-950">No receipts yet</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-700">
              Create your first receipt after receiving a booking or payment
              from a customer.
            </p>

            <Link href="/dashboard/receipts/new" className="mt-5">
              <Button>Create Receipt</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-5 py-3 font-bold">Receipt</th>
                  <th className="px-5 py-3 font-bold">Customer</th>
                  <th className="px-5 py-3 font-bold">Project</th>
                  <th className="px-5 py-3 font-bold">Amount</th>
                  <th className="px-5 py-3 font-bold">Payment</th>
                  <th className="px-5 py-3 font-bold">Created</th>
                  <th className="px-5 py-3 font-bold">PDF</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-950">
                        {receipt.receiptNumber}
                      </p>
                      {receipt.unitDetails && (
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          {receipt.unitDetails}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-950">
                        {receipt.customerName}
                      </p>
                      {receipt.phone && (
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          {receipt.phone}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {receipt.project?.name || "No project"}
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-950">
                      {formatCurrency(receipt.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800">
                        {receipt.paymentMode.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {formatDate(receipt.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/receipts/${receipt.id}/pdf`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sm font-bold text-gray-950 hover:underline"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
