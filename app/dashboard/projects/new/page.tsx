import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProject } from "../actions";
import { PROJECT_STATUS_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProjectPage() {
  return (
    <PageContainer>
      <div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>

      <PageHeader
        title="Create New Project"
        description="Add project details and generate a public landing page for lead capture."
      />

      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <form action={createProject} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Project Name <span className="text-red-600">*</span>
              </label>
              <Input name="name" placeholder="Example: Arambh" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Location <span className="text-red-600">*</span>
              </label>
              <Input
                name="location"
                placeholder="Example: Lucknow Outer Ring Road"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Price Range
              </label>
              <Input name="priceRange" placeholder="Example: ₹12 Lakh onwards" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Write short project description..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Google Map Link
              </label>
              <Input name="mapLink" placeholder="https://maps.app.goo.gl/..." />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Brochure URL
              </label>
              <Input name="brochureUrl" placeholder="https://..." />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Hero Image URL
              </label>
              <Input name="heroImage" placeholder="https://..." />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-950">
                Status
              </label>
              <select
                name="status"
                defaultValue="ACTIVE"
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              >
                {PROJECT_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link href="/dashboard/projects">
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>

              <Button type="submit" className="w-full sm:w-auto">
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}