import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireRole } from "@/lib/current-company";
import { UPLOAD_PATH_PREFIX, UPLOAD_RULES, isUploadKind } from "@/lib/uploads";

/**
 * Issues short-lived client tokens for direct browser → Vercel Blob uploads.
 *
 * Files never pass through this server (so there's no 4.5 MB serverless body
 * limit). This route only decides *whether* an upload is allowed and with
 * which constraints; Vercel Blob enforces the content type and size.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Only company admins may upload project/company media
        const { company, user } = await requireRole("ADMIN");

        if (!pathname.startsWith(UPLOAD_PATH_PREFIX) || pathname.includes("..")) {
          throw new Error("Invalid upload path.");
        }

        const kind = isUploadKind(clientPayload) ? clientPayload : "image";
        const rules = UPLOAD_RULES[kind];

        return {
          allowedContentTypes: rules.allowedContentTypes,
          maximumSizeInBytes: rules.maxBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ companyId: company.id, userId: user.id }),
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    const status = /permission|unauthorized/i.test(message) ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
