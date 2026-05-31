import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { CompanySettingsForm } from "@/components/forms/company-settings-form";
import { updateCompanySettings } from "./actions";
import { getCurrentCompany } from "@/lib/current-company";



export default async function SettingsPage() {
  const company = await getCurrentCompany();

  if (!company) {
    throw new Error("Demo company not found.");
  }

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your company profile, contact details, and receipt information."
      />

      <CompanySettingsForm
        company={company}
        updateAction={updateCompanySettings}
      />
    </PageContainer>
  );
}