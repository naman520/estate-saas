import { notFound } from "next/navigation";
import { resolveProjectFromHostname } from "@/lib/domains";
import {
  fetchProjectBySlug,
  renderLandingTemplate,
} from "@/lib/render-landing";

// Always fetch fresh data — never serve a cached version
export const dynamic = "force-dynamic";

type DomainPageProps = {
  searchParams: Promise<{
    host?: string;
    [key: string]: string | string[] | undefined;
  }>;
};

/**
 * Internal route for custom domain rendering.
 *
 * This page is never accessed directly by users. The middleware rewrites
 * custom domain requests (e.g. `plots.builderxyz.com/`) to
 * `/_domain?host=plots.builderxyz.com`, which lands here.
 *
 * Flow:
 *   hostname → resolveProjectFromHostname → project slug → fetch project → render template
 */
export default async function DomainLandingPage({
  searchParams,
}: DomainPageProps) {
  const params = await searchParams;
  const hostname = params.host;

  if (!hostname) {
    notFound();
  }

  // Resolve hostname to project slug via ProjectDomain lookup (ACTIVE only)
  const slug = await resolveProjectFromHostname(hostname);

  if (!slug) {
    notFound();
  }

  const project = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  console.log(
    `[_domain] host=${hostname} → slug=${slug} templateSlug=${project.template?.slug ?? "free-clean"}`,
  );

  return renderLandingTemplate(project, "/");
}
