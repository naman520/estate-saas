/**
 * Shared landing page renderer.
 *
 * Single source of truth for fetching a project and selecting the correct
 * landing template. Used by both `/p/[slug]` and custom-domain routing.
 */

import { prisma } from "@/lib/prisma";
import { FreeCleanTemplate } from "@/components/landing-templates/free-clean-template";
import { FreeLuxuryTemplate } from "@/components/landing-templates/free-luxury-template";
import { PaidPremiumTemplate } from "@/components/landing-templates/paid-premium-template";
import { PaidConversionTemplate } from "@/components/landing-templates/paid-conversion-template";
import type { Project, Company, landingTemplate } from "@prisma/client";

export type ProjectWithRelations = Project & {
  company: Company;
  template: landingTemplate | null;
};

/**
 * Fetches a project with its company and template relations by slug.
 * Returns null if not found.
 */
export async function fetchProjectBySlug(
  slug: string,
): Promise<ProjectWithRelations | null> {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      template: true,
      company: true,
    },
  });
}

/**
 * Renders the appropriate landing template for a project.
 * Returns a JSX element — the correct template based on `project.template.slug`.
 *
 * @param returnPath — Optional return path for form submissions (e.g. "/" for custom domains).
 *                     When omitted, the form defaults to /p/{slug}.
 */
export function renderLandingTemplate(
  project: ProjectWithRelations,
  returnPath?: string,
): React.JSX.Element {
  const templateSlug = project.template?.slug ?? "free-clean";

  if (templateSlug === "free-luxury") {
    return <FreeLuxuryTemplate project={project} returnPath={returnPath} />;
  }

  if (templateSlug === "paid-premium") {
    return <PaidPremiumTemplate project={project} returnPath={returnPath} />;
  }

  if (templateSlug === "paid-conversion") {
    return <PaidConversionTemplate project={project} returnPath={returnPath} />;
  }

  // Default: free-clean
  return <FreeCleanTemplate project={project} returnPath={returnPath} />;
}

