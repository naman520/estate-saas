"use client";

import { useState, useTransition } from "react";
import { Trash2, PlusCircle, GripVertical, Save, Loader2 } from "lucide-react";
import type { FormField, FieldType } from "@/lib/form-config";
import {
  MAX_FIELDS,
  VALID_FIELD_TYPES,
  FIELD_TYPE_LABELS,
} from "@/lib/form-config";

type SaveResult = { error?: string } | null;

type FormBuilderProps = {
  projectId: string;
  initialFields: FormField[];
  saveAction: (formData: FormData) => Promise<SaveResult>;
};

export function FormBuilder({
  projectId,
  initialFields,
  saveAction,
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function addField() {
    if (fields.length >= MAX_FIELDS) return;
    const newField: FormField = {
      id: crypto.randomUUID(),
      label: "New Field",
      type: "text",
      placeholder: "",
      required: false,
    };
    setFields((prev) => [...prev, newField]);
  }

  function deleteField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function updateField(id: string, patch: Partial<FormField>) {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, ...patch };
        // Clear options when switching away from select
        if (patch.type && patch.type !== "select") {
          delete updated.options;
        }
        // Init options when switching to select
        if (patch.type === "select" && !updated.options) {
          updated.options = [];
        }
        return updated;
      })
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setSaveStatus("idle");

    const fd = new FormData();
    fd.set("projectId", projectId);
    fd.set("fieldsJson", JSON.stringify(fields));

    startTransition(async () => {
      const result = await saveAction(fd);
      if (result?.error) {
        setSaveStatus("error");
        setErrorMsg(result.error);
      } else {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Field cards */}
      {fields.map((field, index) => (
        <FieldCard
          key={field.id}
          field={field}
          index={index}
          onUpdate={(patch) => updateField(field.id, patch)}
          onDelete={() => deleteField(field.id)}
          canDelete={fields.length > 1}
        />
      ))}

      {/* Add field button */}
      <button
        type="button"
        onClick={addField}
        disabled={fields.length >= MAX_FIELDS}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 py-4 text-sm font-semibold text-gray-500 transition hover:border-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PlusCircle className="h-4 w-4" />
        Add Field
        {fields.length >= MAX_FIELDS && (
          <span className="ml-1 text-xs font-normal text-gray-400">
            (max {MAX_FIELDS} reached)
          </span>
        )}
      </button>

      {/* Error message */}
      {saveStatus === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{fields.length}</span> /{" "}
          {MAX_FIELDS} fields configured
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saveStatus === "saved" ? (
            "✓ Saved!"
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Form
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ── Field Card ──────────────────────────────────────────────────────────────

import { useState as useLocalState, useEffect, useRef } from "react";

type FieldCardProps = {
  field: FormField;
  index: number;
  onUpdate: (patch: Partial<FormField>) => void;
  onDelete: () => void;
  canDelete: boolean;
};

function FieldCard({
  field,
  index,
  onUpdate,
  onDelete,
  canDelete,
}: FieldCardProps) {
  // Keep raw textarea content in local state so pressing Enter works correctly.
  // We never re-drive this from field.options (which is filtered) — only reset
  // it when the type flips from something else TO "select".
  const [optionsText, setOptionsText] = useLocalState(
    () => (field.options ?? []).join("\n")
  );
  const prevType = useRef(field.type);

  useEffect(() => {
    if (prevType.current !== "select" && field.type === "select") {
      // Field type just changed TO select — re-initialise textarea
      setOptionsText((field.options ?? []).join("\n"));
    }
    prevType.current = field.type;
  }, [field.type, field.options]);

  function handleOptionsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const raw = e.target.value;
    setOptionsText(raw); // preserve every character the user types
    onUpdate({
      // Only send non-empty, trimmed lines to the parent
      options: raw
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean),
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-300" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Field {index + 1}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
            {FIELD_TYPE_LABELS[field.type]}
          </span>
          {field.required && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
              Required
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
          title="Delete field"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Card body */}
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {/* Label */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
            Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="e.g. Full Name"
            required
            className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
            Field Type
          </label>
          <select
            value={field.type}
            onChange={(e) => onUpdate({ type: e.target.value as FieldType })}
            className="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          >
            {VALID_FIELD_TYPES.map((t) => (
              <option key={t} value={t}>
                {FIELD_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        {/* Placeholder */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="e.g. Enter your name"
            className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          />
        </div>

        {/* Required toggle */}
        <div className="flex items-end pb-0.5">
          <label className="flex cursor-pointer items-center gap-3">
            <div
              role="checkbox"
              aria-checked={field.required}
              onClick={() => onUpdate({ required: !field.required })}
              className={`relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                field.required ? "bg-gray-950" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  field.required ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Required field
            </span>
          </label>
        </div>
      </div>

      {/* Dropdown options (only for select type) */}
      {field.type === "select" && (
        <div className="border-t border-gray-100 p-4">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
            Dropdown Options{" "}
            <span className="text-red-500">*</span>
            <span className="ml-1 font-normal normal-case text-gray-400">
              — one option per line
            </span>
          </label>
          <textarea
            value={optionsText}
            onChange={handleOptionsChange}
            placeholder={"1 BHK\n2 BHK\n3 BHK\nVilla"}
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 font-mono text-xs text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          />
          {(field.options ?? []).length === 0 && (
            <p className="mt-1 text-xs text-red-500">
              At least one option is required for a dropdown field.
            </p>
          )}
          {(field.options ?? []).length > 0 && (
            <p className="mt-1 text-xs text-gray-400">
              {field.options!.length} option
              {field.options!.length !== 1 ? "s" : ""} configured
            </p>
          )}
        </div>
      )}
    </div>
  );
}

