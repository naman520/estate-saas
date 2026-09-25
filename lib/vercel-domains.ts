/**
 * Vercel Domains API wrapper.
 *
 * Programmatically adds / verifies / removes custom domains from the
 * Vercel project so traffic for those domains is routed to this app.
 *
 * All functions gracefully no-op (with a console warning) when
 * VERCEL_TOKEN or VERCEL_PROJECT_ID env vars are missing — this keeps
 * local development working without credentials.
 */

const VERCEL_API = "https://api.vercel.com";

/**
 * True when the Vercel API is configured. In production this should always
 * be true; locally it lets domain flows fall back to a plain DNS check.
 */
export function hasVercelCredentials(): boolean {
  return Boolean(
    process.env.VERCEL_TOKEN?.trim() && process.env.VERCEL_PROJECT_ID?.trim()
  );
}

function getCredentials(): { token: string; projectId: string } | null {
  const token = process.env.VERCEL_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();

  if (!token || !projectId) {
    console.warn(
      "[vercel-domains] VERCEL_TOKEN or VERCEL_PROJECT_ID is not set. " +
        "Vercel API calls will be skipped. Domain routing will not work in production " +
        "until these are configured."
    );
    return null;
  }

  return { token, projectId };
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ---------------------------------------------------------------------------
// Add domain
// ---------------------------------------------------------------------------

export async function addDomainToVercel(
  domain: string
): Promise<{ ok: boolean; error?: string }> {
  const creds = getCredentials();
  if (!creds) return { ok: false, error: "Vercel credentials not configured." };

  try {
    const res = await fetch(
      `${VERCEL_API}/v10/projects/${creds.projectId}/domains`,
      {
        method: "POST",
        headers: authHeaders(creds.token),
        body: JSON.stringify({ name: domain }),
      }
    );

    if (res.ok || res.status === 409) {
      // 409 = domain already exists on this project, treat as success
      return { ok: true };
    }

    const body = await res.json().catch(() => ({}));
    const message =
      body?.error?.message ?? `Vercel API error: ${res.status}`;
    console.error("[vercel-domains] addDomain failed:", message);
    return { ok: false, error: message };
  } catch (err) {
    console.error("[vercel-domains] addDomain exception:", err);
    return { ok: false, error: "Network error contacting Vercel API." };
  }
}

// ---------------------------------------------------------------------------
// Verify domain
// ---------------------------------------------------------------------------

export async function verifyDomainOnVercel(
  domain: string
): Promise<{ verified: boolean; error?: string }> {
  const creds = getCredentials();
  if (!creds) return { verified: false, error: "Vercel credentials not configured." };

  try {
    const res = await fetch(
      `${VERCEL_API}/v10/projects/${creds.projectId}/domains/${domain}/verify`,
      {
        method: "POST",
        headers: authHeaders(creds.token),
      }
    );

    const body = await res.json().catch(() => ({}));

    if (res.ok && body?.verified === true) {
      return { verified: true };
    }

    // Vercel returns verified:false when DNS hasn't propagated yet — not an error
    if (res.status === 400 || res.status === 200) {
      return { verified: false };
    }

    const message =
      body?.error?.message ?? `Vercel API error: ${res.status}`;
    console.error("[vercel-domains] verifyDomain failed:", message);
    return { verified: false, error: message };
  } catch (err) {
    console.error("[vercel-domains] verifyDomain exception:", err);
    return { verified: false, error: "Network error contacting Vercel API." };
  }
}

// ---------------------------------------------------------------------------
// Remove domain
// ---------------------------------------------------------------------------

export async function removeDomainFromVercel(
  domain: string
): Promise<{ ok: boolean; error?: string }> {
  const creds = getCredentials();
  if (!creds) return { ok: false, error: "Vercel credentials not configured." };

  try {
    const res = await fetch(
      `${VERCEL_API}/v10/projects/${creds.projectId}/domains/${domain}`,
      {
        method: "DELETE",
        headers: authHeaders(creds.token),
      }
    );

    if (res.ok || res.status === 404) {
      // 404 = already removed, treat as success
      return { ok: true };
    }

    const body = await res.json().catch(() => ({}));
    const message =
      body?.error?.message ?? `Vercel API error: ${res.status}`;
    console.error("[vercel-domains] removeDomain failed:", message);
    return { ok: false, error: message };
  } catch (err) {
    console.error("[vercel-domains] removeDomain exception:", err);
    return { ok: false, error: "Network error contacting Vercel API." };
  }
}
