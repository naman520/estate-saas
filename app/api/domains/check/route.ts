import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/current-company";
import { verifyAndUpdateDomain } from "@/lib/domain-verification";

export async function POST(req: NextRequest) {
  let company;
  try {
    ({ company } = await requireRole("ADMIN"));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { domainId } = body as { domainId?: string };

    if (!domainId) {
      return NextResponse.json(
        { error: "domainId is required" },
        { status: 400 }
      );
    }

    // Fetch domain record and verify ownership
    const domainRecord = await prisma.projectDomain.findFirst({
      where: { id: domainId, project: { companyId: company.id } },
    });

    if (!domainRecord) {
      return NextResponse.json(
        { error: "Domain record not found" },
        { status: 404 }
      );
    }

    const result = await verifyAndUpdateDomain(
      domainRecord.id,
      domainRecord.domain,
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/domains/check]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
