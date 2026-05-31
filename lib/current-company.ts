import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function getCurrentCompany() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      company: true,
    },
  });

  if (existingUser) {
    return existingUser.company;
  }

  const clerkUser = await currentUser();

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
  const name =
    clerkUser?.fullName ||
    clerkUser?.firstName ||
    email?.split("@")[0] ||
    "New User";

  const companyName = `${name}'s Company`;

  const baseSlug = slugify(companyName);
  const slug = `${baseSlug}-${userId.slice(-6)}`;

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
  });

  return company;
}