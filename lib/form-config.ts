/**
 * Shared types and utilities for the lead form configuration system.
 * Used by both the dashboard form builder and the public landing page templates.
 */

export type FieldType = "text" | "email" | "tel" | "number" | "select";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder: string;
  required: boolean;
  options?: string[]; // only for select type
}

export interface FormConfig {
  fields: FormField[];
}

export const VALID_FIELD_TYPES: FieldType[] = [
  "text",
  "email",
  "tel",
  "number",
  "select",
];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Text",
  email: "Email",
  tel: "Phone",
  number: "Number",
  select: "Dropdown",
};

export const MAX_FIELDS = 5;

export const DEFAULT_FORM_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: false,
  },
];

/**
 * Safely parses raw formSettings JSON into a validated FormConfig.
 * Falls back to DEFAULT_FORM_FIELDS if the data is missing or invalid.
 */
export function parseFormConfig(raw: unknown): FormConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { fields: DEFAULT_FORM_FIELDS.map((f) => ({ ...f })) };
  }

  const obj = raw as Record<string, unknown>;
  const fieldsRaw = obj.fields;

  if (!Array.isArray(fieldsRaw) || fieldsRaw.length === 0) {
    return { fields: DEFAULT_FORM_FIELDS.map((f) => ({ ...f })) };
  }

  const parsed: FormField[] = [];

  for (const f of fieldsRaw) {
    if (!f || typeof f !== "object" || Array.isArray(f)) continue;
    const field = f as Record<string, unknown>;

    const id = String(field.id ?? "").trim();
    const label = String(field.label ?? "").trim();
    const type = String(field.type ?? "") as FieldType;

    if (!id || !label || !VALID_FIELD_TYPES.includes(type)) continue;

    const options =
      type === "select" && Array.isArray(field.options)
        ? (field.options as unknown[]).filter(
            (o): o is string => typeof o === "string" && o.trim() !== ""
          )
        : undefined;

    parsed.push({
      id,
      label,
      type,
      placeholder: String(field.placeholder ?? "").trim(),
      required: Boolean(field.required),
      options,
    });
  }

  if (parsed.length === 0) {
    return { fields: DEFAULT_FORM_FIELDS.map((f) => ({ ...f })) };
  }

  return { fields: parsed };
}
