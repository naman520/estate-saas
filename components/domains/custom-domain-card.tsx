"use client";

import { useState, useTransition } from "react";
import type { ProjectDomain } from "@prisma/client";
import { Globe, CheckCircle2, Clock, AlertCircle, Trash2, ExternalLink, Copy, Check, RefreshCw, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCustomDomain, removeCustomDomain } from "@/app/dashboard/projects/[id]/domains/actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  projectId: string;
  domain: ProjectDomain | null;
};

type CheckResult = {
  status: "ACTIVE" | "PENDING" | "ERROR";
  resolvedTo: string | null;
  message: string;
};

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
        <Clock className="h-3 w-3" />
        Pending DNS
      </span>
    );
  }
  if (status === "ERROR") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
        <AlertCircle className="h-3 w-3" />
        DNS Error
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
      <Clock className="h-3 w-3" />
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Copy button
// ---------------------------------------------------------------------------

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 rounded p-1 text-gray-400 hover:text-gray-700 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// DNS Instructions table
// ---------------------------------------------------------------------------

function DnsInstructions({ domain }: { domain: string }) {
  const cnameTarget = process.env.NEXT_PUBLIC_DNS_CNAME_TARGET ?? "cname.vercel-dns.com";

  return (
    <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-yellow-800">
        Required DNS Record
      </p>
      <p className="mt-1 text-xs text-yellow-700">
        Add this record at your domain registrar (Hostinger, GoDaddy, Namecheap, etc.)
      </p>

      <div className="mt-3 overflow-x-auto rounded-lg border border-yellow-200 bg-white">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-yellow-100 bg-yellow-50">
              <th className="px-3 py-2 text-left font-bold text-gray-600">Type</th>
              <th className="px-3 py-2 text-left font-bold text-gray-600">Name / Host</th>
              <th className="px-3 py-2 text-left font-bold text-gray-600">Value / Target</th>
              <th className="px-3 py-2 text-left font-bold text-gray-600">TTL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2.5 font-mono font-bold text-blue-700">CNAME</td>
              <td className="px-3 py-2.5 font-mono">
                @
                <CopyButton value="@" />
              </td>
              <td className="px-3 py-2.5 font-mono">
                {cnameTarget}
                <CopyButton value={cnameTarget} />
              </td>
              <td className="px-3 py-2.5 font-mono text-gray-500">Auto</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-yellow-700">
        <span className="font-bold">Note:</span> Some registrars don&apos;t allow CNAME on the root domain (@).
        In that case, use <span className="font-mono font-bold">www</span> as the Name and redirect
        <span className="font-mono"> {domain}</span> → <span className="font-mono">www.{domain}</span>.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CustomDomainCard({ projectId, domain }: Props) {
  const [isPending, startTransition] = useTransition();
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Optimistic status — updates immediately after DNS check without page reload
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const currentStatus = optimisticStatus ?? domain?.status ?? null;

  const handleCheckDns = async () => {
    if (!domain) return;
    setIsChecking(true);
    setCheckResult(null);

    try {
      const res = await fetch("/api/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: domain.id, projectId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckResult({
          status: "ERROR",
          resolvedTo: null,
          message: data?.error ?? "Could not check this domain.",
        });
        return;
      }
      setCheckResult(data as CheckResult);
      setOptimisticStatus(data.status);
    } catch {
      setCheckResult({
        status: "ERROR",
        resolvedTo: null,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleRemove = () => {
    if (!domain) return;
    startTransition(async () => {
      const fd = new FormData();
      await removeCustomDomain(projectId, domain.id);
    });
  };

  // ── State 1: No domain configured ──────────────────────────────────────────
  if (!domain) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-950">Custom Domain</h2>
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-1 text-sm font-medium text-gray-600">
            Connect your own domain to serve this landing page at your brand URL.
          </p>

          <form
            action={addCustomDomain.bind(null, projectId)}
            className="mt-4 space-y-3"
          >
            <Input
              name="domain"
              placeholder="realestatesales.com"
              required
              className="font-mono text-sm"
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {isPending ? "Adding..." : "Add Custom Domain"}
            </Button>
          </form>

          <p className="mt-3 text-xs text-gray-500">
            Works with Hostinger, GoDaddy, Namecheap, or any DNS provider.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── State 3: Active ─────────────────────────────────────────────────────────
  if (currentStatus === "ACTIVE") {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardContent>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-950">Custom Domain</h2>
            <StatusBadge status="ACTIVE" />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 border border-green-200">
            <Globe className="h-4 w-4 flex-shrink-0 text-green-600" />
            <a
              href={`https://${domain.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm font-bold text-green-800 hover:underline"
            >
              {domain.domain}
            </a>
            <ExternalLink className="h-3.5 w-3.5 text-green-600" />
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Your landing page is live on this domain. SSL is managed automatically by Vercel.
          </p>

          <div className="mt-4 space-y-2">
            <a
              href={`https://${domain.domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Site
              </Button>
            </a>

            {!showRemoveConfirm ? (
              <Button
                variant="ghost"
                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setShowRemoveConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Domain
              </Button>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-bold text-red-800">
                  Remove {domain.domain}?
                </p>
                <p className="mt-1 text-xs text-red-600">
                  The domain will stop serving your landing page.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={handleRemove}
                    disabled={isPending}
                  >
                    {isPending ? "Removing..." : "Yes, Remove"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRemoveConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── State 2: Pending / Error ─────────────────────────────────────────────────
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-950">Custom Domain</h2>
          <StatusBadge status={currentStatus ?? "PENDING"} />
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
          <Globe className="h-4 w-4 flex-shrink-0 text-gray-500" />
          <span className="flex-1 truncate font-mono text-sm font-bold text-gray-800">
            {domain.domain}
          </span>
        </div>

        <DnsInstructions domain={domain.domain} />

        {/* DNS check result feedback */}
        {checkResult && (
          <div
            className={`mt-3 rounded-xl p-3 text-xs font-medium ${
              checkResult.status === "ACTIVE"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-orange-50 text-orange-700 border border-orange-200"
            }`}
          >
            {checkResult.message}
            {checkResult.resolvedTo && (
              <p className="mt-1 font-mono opacity-75">
                Resolved to: {checkResult.resolvedTo}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 space-y-2">
          <Button
            className="w-full"
            onClick={handleCheckDns}
            disabled={isChecking}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking DNS..." : "Check DNS Status"}
          </Button>

          {!showRemoveConfirm ? (
            <Button
              variant="ghost"
              className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setShowRemoveConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Domain
            </Button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-bold text-red-800">Remove this domain?</p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="danger"
                  className="flex-1"
                  onClick={handleRemove}
                  disabled={isPending}
                >
                  {isPending ? "Removing..." : "Remove"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRemoveConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
