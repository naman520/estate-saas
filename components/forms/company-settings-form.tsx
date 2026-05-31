"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CompanySettingsFormProps = {
  company: {
    name: string;
    phone: string | null;
    email: string | null;
    logo: string | null;
    whatsappNumber: string | null;
    receiptFooter: string | null;
  };
  updateAction: (formData: FormData) => Promise<void>;
};

export function CompanySettingsForm({
  company,
  updateAction,
}: CompanySettingsFormProps) {
  const searchParams = useSearchParams();
  const updated = searchParams.get("updated") === "true";

  return (
    <div className="space-y-5">
      {updated && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">
          Company settings updated successfully.
        </div>
      )}

      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <form action={updateAction} className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                Company Profile
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-700">
                These details will be used on landing pages and receipts.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Company Name <span className="text-red-600">*</span>
              </label>
              <Input
                name="name"
                defaultValue={company.name}
                placeholder="Example: BookMyAssets"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Phone
              </label>
              <Input
                name="phone"
                defaultValue={company.phone || ""}
                placeholder="Example: 9876543210"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                WhatsApp Number
              </label>
              <Input
                name="whatsappNumber"
                defaultValue={company.whatsappNumber || ""}
                placeholder="Example: 9876543210"
              />
              <p className="mt-2 text-xs font-medium text-gray-600">
                Used for WhatsApp buttons on public project pages.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Email
              </label>
              <Input
                name="email"
                type="email"
                defaultValue={company.email || ""}
                placeholder="Example: sales@company.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Logo URL
              </label>
              <Input
                name="logo"
                defaultValue={company.logo || ""}
                placeholder="https://example.com/logo.png"
              />
              <p className="mt-2 text-xs font-medium text-gray-600">
                Image upload will come later. For now, paste a logo URL.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Receipt Footer Text
              </label>
              <Textarea
                name="receiptFooter"
                defaultValue={company.receiptFooter || ""}
                placeholder="Example: Thank you for choosing us. This receipt is computer-generated."
              />
            </div>

            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}