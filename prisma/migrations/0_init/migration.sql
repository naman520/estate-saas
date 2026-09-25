-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SALES');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'UPCOMING', 'SOLD_OUT');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'SITE_VISIT_PLANNED', 'SITE_VISIT_DONE', 'NEGOTIATION', 'BOOKED', 'LOST');

-- CreateEnum
CREATE TYPE "TemplateTier" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "DomainType" AS ENUM ('CUSTOM', 'PLATFORM_SUBDOMAIN');

-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'VERIFYING', 'ACTIVE', 'ERROR');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "whatsappNumber" TEXT,
    "receiptFooter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "priceRange" TEXT,
    "description" TEXT,
    "mapLink" TEXT,
    "brochureUrl" TEXT,
    "heroImage" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "customDomain" TEXT,
    "formPosition" TEXT NOT NULL DEFAULT 'HERO_RIGHT',
    "showHeroImage" BOOLEAN NOT NULL DEFAULT true,
    "showLocation" BOOLEAN NOT NULL DEFAULT true,
    "showPricing" BOOLEAN NOT NULL DEFAULT true,
    "showBrochure" BOOLEAN NOT NULL DEFAULT true,
    "showContactCta" BOOLEAN NOT NULL DEFAULT true,
    "galleryImages" JSONB,
    "amenities" TEXT,
    "locationHighlights" TEXT,
    "ctaHeading" TEXT,
    "ctaSubtext" TEXT,
    "ctaButtonText" TEXT,
    "formSettings" JSONB,
    "templateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "projectId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "budget" TEXT,
    "message" TEXT,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "followUpAt" TIMESTAMP(3),
    "notes" TEXT,
    "formData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "projectId" TEXT,
    "receiptNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT,
    "amount" INTEGER NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "transactionId" TEXT,
    "unitDetails" TEXT,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landingTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "TemplateTier" NOT NULL,
    "description" TEXT,
    "previewImg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landingTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectDomain" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "type" "DomainType" NOT NULL,
    "status" "DomainStatus" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_customDomain_key" ON "Project"("customDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_projectId_phone_key" ON "Lead"("projectId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON "Receipt"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "landingTemplate_slug_key" ON "landingTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectDomain_domain_key" ON "ProjectDomain"("domain");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "landingTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDomain" ADD CONSTRAINT "ProjectDomain_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

