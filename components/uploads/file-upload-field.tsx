"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { UPLOAD_RULES, type UploadKind } from "@/lib/uploads";
import { uploadErrorMessage, uploadFile } from "./upload-client";

type FileUploadFieldProps = {
  /** Form field name — the uploaded URL is submitted under this name. */
  name: string;
  defaultValue?: string | null;
  kind?: UploadKind;
  placeholder?: string;
  /** Preview shape for images. */
  aspect?: "wide" | "square";
};

/**
 * Upload a file OR paste a URL. Either way, the final URL is submitted with
 * the surrounding <form> under `name`, so existing server actions keep working.
 */
export function FileUploadField({
  name,
  defaultValue,
  kind = "image",
  placeholder = "https://...",
  aspect = "wide",
}: FileUploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const rules = UPLOAD_RULES[kind];
  const uploading = progress !== null;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const url = await uploadFile(file, kind, setProgress);
      setValue(url);
    } catch (err) {
      setError(uploadErrorMessage(err));
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const hasValue = value.trim().length > 0;

  return (
    <div className="space-y-3">
      {hasValue && kind === "image" && (
        <div
          className={`relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 ${
            aspect === "square" ? "h-24 w-24" : "aspect-[16/7] w-full max-w-md"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => setValue("")}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {hasValue && kind === "pdf" && (
        <div className="flex max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <FileText className="h-5 w-5 shrink-0 text-gray-700" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-950 hover:underline"
          >
            {decodeURIComponent(value.split("/").pop() ?? "Brochure")}
          </a>
          <button
            type="button"
            onClick={() => setValue("")}
            className="grid h-7 w-7 place-items-center rounded-full text-gray-600 hover:bg-gray-200"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-gray-950"
        />

        <input
          ref={inputRef}
          type="file"
          accept={rules.accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {progress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </button>
      </div>

      <p className="text-xs font-medium text-gray-600">
        Upload a file ({rules.label}) or paste a link.
      </p>
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
