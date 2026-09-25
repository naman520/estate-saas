"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/current-company";
import {
  VALID_FIELD_TYPES,
  MAX_FIELDS,
} from "@/lib/form-config";
import type { FormField } from "@/lib/form-config";

export async function saveFormConfig(formData: FormData): Promise<{ error?: string } | null> {
  let company;
  try {
    ({ company } = await requireRole("ADMIN"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  try {
    const projectId = String(formData.get("projectId") || "").trim();

    if (!projectId) {
      return { error: "Project ID is missing." };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId, companyId: company.id },
    });

    if (!project) {
      return { error: "Project not found." };
    }

    const fieldsJson = String(formData.get("fieldsJson") || "").trim();

    let rawFields: unknown;
    try {
      rawFields = JSON.parse(fieldsJson);
    } catch {
      return { error: "Invalid form configuration data." };
    }

    if (!Array.isArray(rawFields)) {
      return { error: "Invalid form configuration data." };
    }

    if (rawFields.length < 1) {
      return { error: "The form must have at least 1 field." };
    }

    if (rawFields.length > MAX_FIELDS) {
      return { error: `Maximum ${MAX_FIELDS} fields are allowed.` };
    }

    const validated: FormField[] = [];

    for (const f of rawFields) {
      if (!f || typeof f !== "object" || Array.isArray(f)) {
        return { error: "Invalid field data." };
      }

      const field = f as Record<string, unknown>;
      const id = String(field.id ?? "").trim();
      const label = String(field.label ?? "").trim();
      const type = String(field.type ?? "");
      const placeholder = String(field.placeholder ?? "").trim();
      const required = Boolean(field.required);

      if (!id) return { error: "Each field must have a unique ID." };
      if (!label) return { error: "Each field must have a label." };
      if (!VALID_FIELD_TYPES.includes(type as (typeof VALID_FIELD_TYPES)[number])) {
        return { error: `Invalid field type: ${type}` };
      }

      const entry: FormField = {
        id,
        label,
        type: type as FormField["type"],
        placeholder,
        required,
      };

      if (type === "select") {
        const opts = Array.isArray(field.options)
          ? (field.options as unknown[])
              .filter((o): o is string => typeof o === "string" && o.trim() !== "")
              .map((o) => o.trim())
          : [];

        if (opts.length === 0) {
          return { error: `Dropdown field "${label}" must have at least one option.` };
        }
        entry.options = opts;
      }

      validated.push(entry);
    }

    // Check for duplicate IDs
    const ids = validated.map((f) => f.id);
    if (new Set(ids).size !== ids.length) {
      return { error: "Form fields must have unique IDs." };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        // Round-trip through JSON to produce a plain object that satisfies Prisma's InputJsonValue
        formSettings: JSON.parse(JSON.stringify({ fields: validated })),
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/landing/form`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/p/${project.slug}`);

    return null; // success
  } catch (err) {
    console.error("[saveFormConfig]", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}