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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });