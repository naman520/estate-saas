"use client";

import { upload } from "@vercel/blob/client";
import { UPLOAD_PATH_PREFIX, UPLOAD_RULES, type UploadKind } from "@/lib/uploads";

const MAX_IMAGE_DIMENSION = 2400; // px, long edge
const COMPRESS_ABOVE_BYTES = 600 * 1024; // leave small images untouched
const WEBP_QUALITY = 0.82;

/** Makes a filename safe for URLs: "Tower A (Final).JPG" → "tower-a-final.jpg" */
function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return `${base || "file"}${ext ? `.${ext}` : ""}`;
}

/**
 * Downscales large photos in the browser before upload.
 * A 12 MB phone photo typically becomes ~400–900 KB WebP, which makes
 * landing pages load much faster on mobile data.
 * Falls back to the original file if anything goes wrong.
 */
async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));

    if (scale === 1 && file.size <= COMPRESS_ABOVE_BYTES) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
    );

    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  }
}

export type UploadProgress = (percentage: number) => void;

/** Validates, compresses (images) and uploads a file. Returns the public URL. */
export async function uploadFile(
  original: File,
  kind: UploadKind,
  onProgress?: UploadProgress,
): Promise<string> {
  const rules = UPLOAD_RULES[kind];

  if (!rules.allowedContentTypes.includes(original.type)) {
    throw new Error(`Unsupported file type. Allowed: ${rules.label}.`);
  }

  const file = kind === "image" ? await compressImage(original) : original;

  if (file.size > rules.maxBytes) {
    throw new Error(`File is too large. Allowed: ${rules.label}.`);
  }

  const folder = kind === "pdf" ? "documents" : "images";
  const pathname = `${UPLOAD_PATH_PREFIX}${folder}/${safeFileName(file.name)}`;

  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: kind,
    contentType: file.type,
    multipart: file.size > 5 * 1024 * 1024,
    onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
  });

  return blob.url;
}

export function uploadErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    // Vercel Blob wraps our route's error message; keep it readable
    return error.message.replace(/^Vercel Blob:\s*/i, "");
  }
  return "Upload failed. Please try again.";
}
