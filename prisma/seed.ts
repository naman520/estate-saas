import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const company = await prisma.company.upsert({
    where: {
      slug: "estateflow-demo",
    },
    update: {
      name: "EstateFlow Demo",
      phone: "987562134",
      email: "demo@estateflow.in",
    },
    create: {
      name: "EstateFlow Demo",
      slug: "estateflow-demo",
      phone: "987562134",
      email: "demo@estateflow.in",
    },
  });

  console.log("Demo company created:", company);

  const templates = [
    {
      name: "Free Clean",
      slug: "free-clean",
      tier: "FREE" as const,
      description: "Simple clean landing page for lead generation.",
      previewImg: "/templates/free-clean.png",
    },
    {
      name: "Free Luxury",
      slug: "free-luxury",
      tier: "FREE" as const,
      description: "Dark premium style landing page for real estate projects.",
      previewImg: "/templates/free-luxury.png",
    },
    {
      name: "Paid Premium",
      slug: "paid-premium",
      tier: "PAID" as const,
      description: "Premium brand-focused landing page with advanced sections.",
      previewImg: "/templates/paid-premium.png",
    },
    {
      name: "Paid Conversion",
      slug: "paid-conversion",
      tier: "PAID" as const,
      description: "High-converting ad landing page for Meta and Google leads.",
      previewImg: "/templates/paid-conversion.png",
    },
  ];

  for (const template of templates) {
    const createdTemplate = await prisma.landingTemplate.upsert({
      where: {
        slug: template.slug,
      },
      update: {
        name: template.name,
        tier: template.tier,
        description: template.description,
        previewImg: template.previewImg,
      },
      create: template,
    });

    console.log("Landing template seeded:", createdTemplate.name);
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });