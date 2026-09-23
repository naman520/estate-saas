import { notFound } from "next/navigation";
import {
  fetchProjectBySlug,
  renderLandingTemplate,
} from "@/lib/render-landing";

// Always fetch fresh data — never serve a cached version of the public page
export const dynamic = "force-dynamic";

type PublicProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicProjectPage({
  params,
}: PublicProjectPageProps) {
  const { slug } = await params;

  const project = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const templateSlug = project.template?.slug ?? "free-clean";

  console.log(
    `[/p/${slug}] templateId=${project.templateId ?? "null"} templateSlug=${templateSlug}`
  );

  return renderLandingTemplate(project);
}

