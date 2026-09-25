import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

/**
 * Project slugs are globally unique (they power /p/[slug]), so the
 * uniqueness check must NOT be scoped to the current company.
 */
export async function generateUniqueProjectSlug(
  name: string,
  excludeProjectId?: string,
): Promise<string> {
  const baseSlug = slugify(name) || "project";

  const taken = await prisma.project.findFirst({
    where: {
      slug: baseSlug,
      ...(excludeProjectId ? { NOT: { id: excludeProjectId } } : {}),
    },
    select: { id: true },
  });

  if (!taken) return baseSlug;

  // Short random suffix instead of Date.now() → nicer URLs
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${baseSlug}-${suffix}`;
}
