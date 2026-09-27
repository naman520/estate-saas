import { prisma } from "@/lib/prisma";
import { formatIndianPhone, whatsappLink } from "@/lib/utils";

/**
 * New-lead email alerts via Resend (https://resend.com), called with plain
 * fetch so there's no extra dependency.
 *
 * Env:
 *   RESEND_API_KEY      — required; alerts are skipped (with a log) if missing
 *   NOTIFY_FROM_EMAIL   — e.g. "EstateFlow <leads@yourdomain.com>".
 *                         Defaults to Resend's test sender, which can only
 *                         deliver to your own Resend account email.
 *   NEXT_PUBLIC_APP_URL — e.g. "https://app.estateflow.in" for dashboard links
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "EstateFlow <onboarding@resend.dev>";

function appUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
  if (explicit) return explicit;
  const host = process.env.NEXT_PUBLIC_APP_HOST?.trim();
  if (host) return `https://${host}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type SendEmailInput = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[notifications] RESEND_API_KEY not set — skipping email.");
    return;
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM_EMAIL?.trim() || DEFAULT_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${body.slice(0, 300)}`);
  }
}

/**
 * Emails the company (company email + all admin users) about a new lead.
 * Never throws — a failed alert must not affect lead capture.
 */
export async function notifyNewLead(leadId: string): Promise<void> {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        project: { select: { name: true } },
        company: {
          select: {
            name: true,
            email: true,
            users: {
              where: { role: "ADMIN" },
              select: { email: true },
            },
          },
        },
      },
    });

    if (!lead) return;

    const recipients = Array.from(
      new Set(
        [lead.company.email, ...lead.company.users.map((u) => u.email)]
          .filter((e): e is string => Boolean(e && e.includes("@")))
          .map((e) => e.trim().toLowerCase()),
      ),
    );

    if (recipients.length === 0) {
      console.warn(`[notifications] No recipient email for company of lead ${leadId}.`);
      return;
    }

    const projectName = lead.project?.name ?? "your project";
    const leadUrl = `${appUrl()}/dashboard/leads/${lead.id}`;
    const phoneDisplay = formatIndianPhone(lead.phone);
    const waUrl = whatsappLink(
      lead.phone,
      `Hi ${lead.name}, thank you for your enquiry about ${projectName}. When would be a good time to talk?`,
    );

    const formData =
      lead.formData && typeof lead.formData === "object" && !Array.isArray(lead.formData)
        ? (lead.formData as Record<string, unknown>)
        : {};
    const attribution =
      formData._attribution && typeof formData._attribution === "object"
        ? (formData._attribution as Record<string, string>)
        : {};
    const campaign = attribution.utm_campaign;

    const rows: [string, string][] = [
      ["Name", lead.name],
      ["Phone", phoneDisplay],
      ...(lead.email ? [["Email", lead.email] as [string, string]] : []),
      ...(lead.budget ? [["Budget", lead.budget] as [string, string]] : []),
      ["Project", projectName],
      ["Source", lead.source ?? "WEBSITE"],
      ...(campaign ? [["Campaign", campaign] as [string, string]] : []),
      ...(lead.message ? [["Message", lead.message] as [string, string]] : []),
    ];

    const rowsHtml = rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600">${escapeHtml(v)}</td></tr>`,
      )
      .join("");

    const button = (href: string, label: string, bg: string) =>
      `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;border-radius:10px;background:${bg};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">${escapeHtml(label)}</a>`;

    const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px;color:#059669;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">New lead</p>
  <h1 style="margin:0 0 16px;color:#111827;font-size:22px">${escapeHtml(lead.name)} enquired about ${escapeHtml(projectName)}</h1>
  <table style="border-collapse:collapse;margin-bottom:20px">${rowsHtml}</table>
  <div>
    ${waUrl ? button(waUrl, "WhatsApp now", "#16a34a") : ""}
    ${button(`tel:${lead.phone}`, "Call", "#111827")}
    ${button(leadUrl, "Open in EstateFlow", "#374151")}
  </div>
  <p style="margin-top:20px;color:#9ca3af;font-size:12px">Tip: leads contacted within 5 minutes are far more likely to book a site visit.</p>
</div>`;

    const text = [
      `New lead for ${projectName}`,
      "",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      waUrl ? `WhatsApp: ${waUrl}` : "",
      `Open: ${leadUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendEmail({
      to: recipients,
      subject: `New lead: ${lead.name} · ${projectName}`,
      html,
      text,
      replyTo: lead.email ?? undefined,
    });
  } catch (error) {
    console.error("[notifications] notifyNewLead failed:", error);
  }
}
