import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { verifyDomainOnVercel } from "@/lib/vercel-domains";
import { checkDomainCNAME } from "@/lib/dns-verify";
import { getCurrentCompany } from "@/lib/current-company";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await getCurrentCompany();
    const body = await req.json();
    const { domainId, projectId } = body as {
      domainId: string;
      projectId: string;
    };

    if (!domainId || !projectId) {
      return NextResponse.json(
        { error: "domainId and projectId are required" },
        { status: 400 }
      );
    }

    // Fetch domain record and verify ownership
    const domainRecord = await prisma.projectDomain.findUnique({
      where: { id: domainId },
      include: { project: true },
    });

    if (!domainRecord || domainRecord.project.companyId !== company.id) {
      return NextResponse.json(
        { error: "Domain record not found" },
        { status: 404 }
      );
    }

    const domain = domainRecord.domain;

    // Run verification checks in parallel
    const [vercelResult, dnsResult] = await Promise.all([
      verifyDomainOnVercel(domain),
      checkDomainCNAME(domain),
    ]);

    const isVerified = vercelResult.verified || dnsResult.verified;
    const newStatus = isVerified ? "ACTIVE" : "PENDING";

    // Update DB status
    await prisma.projectDomain.update({
      where: { id: domainId },
      data: { status: newStatus },
    });

    if (isVerified) {
      return NextResponse.json({
        status: "ACTIVE",
        resolvedTo: dnsResult.resolvedTo,
        message: `✅ ${domain} is verified and live!`,
      });
    }

    return NextResponse.json({
      status: "PENDING",
      resolvedTo: dnsResult.resolvedTo,
      message:
        dnsResult.error ??
        "DNS not verified yet. Check your registrar and try again in a few minutes.",
    });
  } catch (err) {
    console.error("[api/domains/check]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
