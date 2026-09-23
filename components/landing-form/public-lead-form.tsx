"use client";

import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createFormLead } from "@/app/p/[slug]/actions";
import type { FormField } from "@/lib/form-config";

type PublicLeadFormProps = {
  projectId: string;
  companyId: string;
  projectSlug: string;
  projectName: string;
  fields: FormField[];
  /** Override the outer form wrapper class. Defaults to white card style. */
  formClassName?: string;
  /** Title shown at the top of the form. */
  headerTitle?: string;
  /** Subtitle shown below the title. */
  headerSubtext?: string;
  /** Visual variant for the form — controls input/button theming */
  variant?: "default" | "dark" | "accent" | "minimal";
  /** Optional override for the submit button class */
  buttonClassName?: string;
  /** Hide the form header (title + subtitle) */
  hideHeader?: boolean;
  /** Hide the source label at the bottom */
  hideSource?: boolean;
  /** Return path for form submission redirect (defaults to /p/{slug}) */
  returnPath?: string;
};

const VARIANTS = {
  default: {
    form: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",
    heading: "text-lg font-bold text-gray-950",
    subtext: "mt-1 text-sm font-medium text-gray-700",
    label: "mb-2 block text-sm font-bold text-gray-950",
    input:
      "h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10",
    select:
      "h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10",
    button:
      "w-full rounded-xl bg-gray-950 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60",
    success:
      "mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800",
    source: "text-center text-xs font-medium text-gray-400",
  },
  dark: {
    form: "space-y-4 rounded-2xl border border-white/10 bg-[#111] p-5",
    heading: "text-lg font-bold text-white",
    subtext: "mt-1 text-sm font-medium text-gray-400",
    label: "mb-2 block text-sm font-bold text-gray-300",
    input:
      "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-white/30 focus:ring-2 focus:ring-white/10",
    select:
      "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10",
    button:
      "w-full rounded-xl bg-white py-3 text-sm font-bold text-gray-950 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60",
    success:
      "mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-bold text-green-400",
    source: "text-center text-xs font-medium text-gray-600",
  },
  accent: {
    form: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",
    heading: "text-lg font-bold text-gray-950",
    subtext: "mt-1 text-sm font-medium text-gray-600",
    label: "mb-2 block text-sm font-bold text-gray-800",
    input:
      "h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10",
    select:
      "h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10",
    button:
      "w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60",
    success:
      "mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800",
    source: "text-center text-xs font-medium text-gray-400",
  },
  minimal: {
    form: "space-y-4 p-0",
    heading: "text-lg font-bold text-gray-950",
    subtext: "mt-1 text-sm font-medium text-gray-600",
    label: "mb-2 block text-sm font-semibold text-gray-700",
    input:
      "h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200",
    select:
      "h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200",
    button:
      "w-full rounded-lg bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60",
    success:
      "mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800",
    source: "text-center text-xs font-medium text-gray-400",
  },
};

function SubmitButton({
  className,
}: {
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? "Submitting…" : "Submit Enquiry"}
    </button>
  );
}

export function PublicLeadForm({
  projectId,
  companyId,
  projectSlug,
  projectName,
  fields,
  formClassName,
  headerTitle,
  headerSubtext,
  variant = "default",
  buttonClassName,
  hideHeader = false,
  hideSource = false,
  returnPath,
}: PublicLeadFormProps) {
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "WEBSITE";
  const duplicate = searchParams.get("duplicate") === "true";
  const submitted = searchParams.get("submitted") === "true";

  const title = headerTitle ?? "Book a Free Site Visit";
  const subtitle =
    headerSubtext ?? "Submit your details and our team will call you shortly.";

  const v = VARIANTS[variant];

  return (
    <div>
      {submitted && (
        <div className={v.success}>
          {duplicate
            ? "Your enquiry is already submitted. Our team will contact you shortly."
            : "Thank you! Your enquiry has been submitted. Our team will contact you shortly."}
        </div>
      )}

      <form
        action={createFormLead}
        className={formClassName ?? v.form}
      >
        {/* Form header */}
        {!hideHeader && (
          <div>
            <h3 className={v.heading}>{title}</h3>
            <p className={v.subtext}>{subtitle}</p>
          </div>
        )}

        {/* Hidden meta fields */}
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="companyId" value={companyId} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="projectName" value={projectName} />
        <input type="hidden" name="source" value={source} />
        {returnPath && (
          <input type="hidden" name="_returnPath" value={returnPath} />
        )}

        {/* Dynamic fields */}
        {fields.map((field) => (
          <div key={field.id}>
            <label className={v.label}>
              {field.label}
              {field.required && (
                <span className="ml-1 text-red-600">*</span>
              )}
            </label>

            {field.type === "select" ? (
              <select
                name={`field_${field.id}`}
                required={field.required}
                defaultValue=""
                className={v.select}
              >
                <option value="" disabled>
                  {field.placeholder || `Select ${field.label}`}
                </option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={`field_${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
                className={v.input}
              />
            )}
          </div>
        ))}

        <SubmitButton className={buttonClassName ?? v.button} />

        {!hideSource && (
          <p className={v.source}>
            Source: {source}
          </p>
        )}
      </form>
    </div>
  );
}
