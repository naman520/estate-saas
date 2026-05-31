import { FORM_POSITION_OPTIONS, PROJECT_STATUS_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type ProjectEditFormProps = {
  project: {
    id: string;
    name: string;
    location: string;
    priceRange: string | null;
    description: string | null;
    mapLink: string | null;
    brochureUrl: string | null;
    heroImage: string | null;
    status: string;

    customDomain: string | null;
    formPosition: string;
    showHeroImage: boolean;
    showLocation: boolean;
    showPricing: boolean;
    showBrochure: boolean;
    showContactCta: boolean;

    galleryImages: unknown;
    amenities: string | null;
    locationHighlights: string | null;
    ctaHeading: string | null;
    ctaSubtext: string | null;
    ctaButtonText: string | null;
  };
  updateAction: (formData: FormData) => Promise<void>;
};

export function ProjectEditForm({
  project,
  updateAction,
}: ProjectEditFormProps) {
  const galleryValue = Array.isArray(project.galleryImages)
    ? project.galleryImages.join("\n")
    : "";
  return (
    <Card>
      <CardContent className="p-6">
        <form action={updateAction} className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-950">
              Basic Project Details
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Update the information shown on the public project landing page.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Project Name <span className="text-red-600">*</span>
            </label>
            <Input
              name="name"
              defaultValue={project.name}
              placeholder="Example: Arambh"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Location <span className="text-red-600">*</span>
            </label>
            <Input
              name="location"
              defaultValue={project.location}
              placeholder="Example: Lucknow Outer Ring Road"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Price Range
            </label>
            <Input
              name="priceRange"
              defaultValue={project.priceRange || ""}
              placeholder="Example: ₹12 Lakh onwards"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Description
            </label>
            <Textarea
              name="description"
              defaultValue={project.description || ""}
              placeholder="Write project description..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Google Map Link
            </label>
            <Input
              name="mapLink"
              defaultValue={project.mapLink || ""}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Brochure URL
            </label>
            <Input
              name="brochureUrl"
              defaultValue={project.brochureUrl || ""}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Hero Image URL
            </label>
            <Input
              name="heroImage"
              defaultValue={project.heroImage || ""}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Status
            </label>
            <select
              name="status"
              defaultValue={project.status}
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            >
              {PROJECT_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-950">
              Landing Page Settings
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Control how this project page appears publicly.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Lead Form Position
            </label>
            <select
              name="formPosition"
              defaultValue={project.formPosition}
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            >
              {FORM_POSITION_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CheckboxField
              name="showHeroImage"
              label="Show hero image"
              defaultChecked={project.showHeroImage}
            />

            <CheckboxField
              name="showLocation"
              label="Show location section"
              defaultChecked={project.showLocation}
            />

            <CheckboxField
              name="showPricing"
              label="Show pricing section"
              defaultChecked={project.showPricing}
            />

            <CheckboxField
              name="showBrochure"
              label="Show brochure button"
              defaultChecked={project.showBrochure}
            />

            <CheckboxField
              name="showContactCta"
              label="Show contact CTA"
              defaultChecked={project.showContactCta}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Custom Domain
            </label>
            <Input
              name="customDomain"
              defaultValue={project.customDomain || ""}
              placeholder="Example: www.xyz.com"
            />
            <p className="mt-2 text-xs font-medium text-gray-600">
              For now this will only be saved. Actual DNS/domain connection will
              be added after deployment.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-950">
              Landing Page Content
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Add gallery images, amenities, location highlights and CTA
              content.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Gallery Image URLs
            </label>
            <Textarea
              name="galleryImages"
              defaultValue={galleryValue}
              placeholder={`https://example.com/image-1.jpg
https://example.com/image-2.jpg
https://example.com/image-3.jpg`}
            />
            <p className="mt-2 text-xs font-medium text-gray-600">
              Add one image URL per line.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Amenities
            </label>
            <Textarea
              name="amenities"
              defaultValue={project.amenities || ""}
              placeholder={`Wide roads
Green environment
Paver block finish
Demarcated plots`}
            />
            <p className="mt-2 text-xs font-medium text-gray-600">
              Add one amenity per line.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Location Highlights
            </label>
            <Textarea
              name="locationHighlights"
              defaultValue={project.locationHighlights || ""}
              placeholder={`11 KM from airport
Near Outer Ring Road
Close to medical college
Easy highway connectivity`}
            />
            <p className="mt-2 text-xs font-medium text-gray-600">
              Add one location highlight per line.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              CTA Heading
            </label>
            <Input
              name="ctaHeading"
              defaultValue={project.ctaHeading || ""}
              placeholder="Book your site visit today"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              CTA Subtext
            </label>
            <Textarea
              name="ctaSubtext"
              defaultValue={project.ctaSubtext || ""}
              placeholder="Talk to our team and get complete project details."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              CTA Button Text
            </label>
            <Input
              name="ctaButtonText"
              defaultValue={project.ctaButtonText || ""}
              placeholder="Call Now"
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-bold text-gray-950">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-gray-300"
      />
      {label}
    </label>
  );
}
