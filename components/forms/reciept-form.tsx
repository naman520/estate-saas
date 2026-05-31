import Link from "next/link";
import { PAYMENT_MODE_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProjectOption = {
  id: string;
  name: string;
};

type ReceiptFormProps = {
  projects: ProjectOption[];
  createAction: (formData: FormData) => Promise<void>;
};

export function ReceiptForm({ projects, createAction }: ReceiptFormProps) {
  return (
    <Card className="max-w-3xl">
      <CardContent className="p-6">
        <form action={createAction} className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Receipt Details</h2>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Add customer payment details. PDF generation will be added next.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Customer Name <span className="text-red-600">*</span>
            </label>
            <Input
              name="customerName"
              placeholder="Example: Rahul Sharma"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Phone
            </label>
            <Input name="phone" type="tel" placeholder="Example: 9876543210" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Project
            </label>
            <select
              name="projectId"
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Amount <span className="text-red-600">*</span>
            </label>
            <Input
              name="amount"
              type="text"
              inputMode="numeric"
              placeholder="Example: 50000"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Payment Mode <span className="text-red-600">*</span>
            </label>
            <select
              name="paymentMode"
              defaultValue="UPI"
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              required
            >
              {PAYMENT_MODE_OPTIONS.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Transaction ID
            </label>
            <Input
              name="transactionId"
              placeholder="Example: UPI123456789 / Cheque no."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Unit / Plot Details
            </label>
            <Input
              name="unitDetails"
              placeholder="Example: Plot No. 21, 1000 sqft"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Notes
            </label>
            <Textarea
              name="notes"
              placeholder="Example: Booking amount received."
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link href="/dashboard/receipts">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>

            <Button type="submit" className="w-full sm:w-auto">
              Create Receipt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
