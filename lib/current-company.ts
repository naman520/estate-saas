import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Company, Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export type Membership = {
  user: User;
  company: Company;
};

/**
 * Resolves the signed-in Clerk user to their EstateFlow user + company.
 * Creates a company (with the user as ADMIN) on first login.
 *
 * Wrapped in React `cache()` so multiple calls within the same request
 * (layout + page + server action) hit the database only once.
 */
export const getCurrentMembership = cache(async (): Promise<Membership> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  });

  if (existingUser) {
    const { company, ...user } = existingUser;
    return { user, company };
  }

  const clerkUser = await currentUser();

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
  const name =
    clerkUser?.fullName ||
    clerkUser?.firstName ||
    email?.split("@")[0] ||
    "New User";

  const companyName = `${name}'s Company`;
  const slug = `${slugify(companyName)}-${userId.slice(-6)}`;

  const company = await prisma.company.create({
    data: {
      name: companyName,
      slug,
      email,
      users: {
        create: {
          clerkId: userId,
          name,
          email,
          role: "ADMIN",
        },
      },
    },
    include: { users: true },
  });

  const { users, ...companyOnly } = company;
  return { user: users[0], company: companyOnly };
});

export async function getCurrentCompany(): Promise<Company> {
  const { company } = await getCurrentMembership();
  return company;
}

/**
 * Throws unless the current user has one of the allowed roles.
 * Use at the top of every server action / route that mutates
 * company-level settings.
 *
 *   const { company } = await requireRole("ADMIN");
 */
export async function requireRole(...allowed: Role[]): Promise<Membership> {
  const membership = await getCurrentMembership();

  if (!allowed.includes(membership.user.role)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return membership;
}
