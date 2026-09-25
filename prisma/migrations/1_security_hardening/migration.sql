-- EstateFlow: security hardening
-- Apply AFTER baselining your existing database as 0_init:
--   npx prisma migrate diff --from-empty --to-schema <OLD schema.prisma> --script > prisma/migrations/0_init/migration.sql
--   npx prisma migrate resolve --applied 0_init

-- 1. Company plan (gates PAID templates) -------------------------------------
CREATE TYPE "CompanyPlan" AS ENUM ('FREE', 'PRO');

ALTER TABLE "Company"
  ADD COLUMN "plan"       "CompanyPlan" NOT NULL DEFAULT 'FREE',
  ADD COLUMN "receiptSeq" INTEGER       NOT NULL DEFAULT 0;

-- 2. Per-company receipt numbering -------------------------------------------
-- Seed each company's counter from its highest existing receipt number
-- (e.g. EF-0007 -> 7) so new receipts continue the sequence.
UPDATE "Company" c
SET "receiptSeq" = COALESCE((
  SELECT MAX(CAST(SUBSTRING(r."receiptNumber" FROM '([0-9]+)$') AS INTEGER))
  FROM "Receipt" r
  WHERE r."companyId" = c."id"
    AND r."receiptNumber" ~ '[0-9]+$'
), 0);

-- Receipt numbers were globally unique; make them unique per company instead.
DROP INDEX IF EXISTS "Receipt_receiptNumber_key";
CREATE UNIQUE INDEX "Receipt_companyId_receiptNumber_key"
  ON "Receipt"("companyId", "receiptNumber");

-- 3. User.role: String -> Role enum ------------------------------------------
-- The Role enum was declared in the schema before but may or may not exist in
-- the database depending on how it was created, so create it only if missing.
DO $$
BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'SALES');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Anything unexpected becomes ADMIN (every existing user is a company creator).
UPDATE "User" SET "role" = 'ADMIN' WHERE UPPER("role") NOT IN ('ADMIN', 'SALES');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User"
  ALTER COLUMN "role" TYPE "Role" USING (UPPER("role")::"Role");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- 4. Drop legacy Project.customDomain (replaced by ProjectDomain) ------------
-- It was only ever stored, never used for routing.
DROP INDEX IF EXISTS "Project_customDomain_key";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "customDomain";
