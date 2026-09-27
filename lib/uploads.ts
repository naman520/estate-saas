/**
 * Shared upload rules — imported by both the client uploader and the
 * server route that issues upload tokens, so they can never drift apart.
 */

export type UploadKind = "image" | "pdf";

export const UPLOAD_RULES: Record<
  UploadKind,
  { allowedContentTypes: string[]; maxBytes: number; accept: string; label: string }
> = {
  image: {
    allowedContentTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ],
    maxBytes: 8 * 1024 * 1024, // 8 MB (after client-side compression)
    accept: "image/jpeg,image/png,image/webp,image/avif,image/gif",
    label: "JPG, PNG, WebP up to 8 MB",
  },
  pdf: {
    allowedContentTypes: ["application/pdf"],
    maxBytes: 25 * 1024 * 1024, // 25 MB brochures
    accept: "application/pdf",
    label: "PDF up to 25 MB",
  },
};

/** Every upload lives under this prefix in the Blob store. */
export const UPLOAD_PATH_PREFIX = "uploads/";

export function isUploadKind(value: unknown): value is UploadKind {
  return value === "image" || value === "pdf";
}
