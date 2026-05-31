"use client";

import { useSearchParams } from "next/navigation";
import { createLead } from "@/app/p/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";

type LeadFormProps = {
  projectId: string;
  companyId: string;
  projectSlug: string;
  projectName: string;
};

function SubmitLeadButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Submitting..." : "Submit Enquiry"}
    </Button>
  );
}

export function LeadForm({
  projectId,
  companyId,
  projectSlug,
  projectName,
}: LeadFormProps) {
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "WEBSITE";
  const duplicate = searchParams.get("duplicate") === "true";
  const submitted = searchParams.get("submitted") === "true";

  return (
    <div>
      {submitted && (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">
          {duplicate
            ? "Your enquiry is already submitted. Our team will contact you shortly."
            : "Thank you! Your enquiry has been submitted. Our team will contact you shortly."}
        </div>
      )}

      <form
        action={createLead}
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-950">
            Book a Free Site Visit
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Submit your details and our team will call you shortly.
          </p>
        </div>

        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="companyId" value={companyId} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="projectName" value={projectName} />
        <input type="hidden" name="source" value={source} />

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Full Name <span className="text-red-600">*</span>
          </label>
          <Input name="name" placeholder="Enter your name" required />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <Input
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Email
          </label>
          <Input name="email" type="email" placeholder="Enter your email" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Budget
          </label>
          <Input name="budget" placeholder="Example: ₹15 Lakh - ₹25 Lakh" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-950">
            Message
          </label>
          <Textarea
            name="message"
            placeholder="I am interested in this project..."
          />
        </div>

        <SubmitLeadButton />
        <p className="text-center text-xs font-medium text-gray-600">
          Source: {source}
        </p>
      </form>
    </div>
  );
}
