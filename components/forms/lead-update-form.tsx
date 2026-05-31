import { LEAD_STATUS_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type LeadUpdateFormProps = {
  leadId: string;
  currentStatus: string;
  currentNotes: string | null;
  currentFollowUpAt: Date | null;
  updateAction: (formData: FormData) => Promise<void>;
};

function formatDateTimeLocal(date: Date | null) {
  if (!date) return "";

  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

  return localDate.toISOString().slice(0, 16);
}

export function LeadUpdateForm({
  currentStatus,
  currentNotes,
  currentFollowUpAt,
  updateAction,
}: LeadUpdateFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <form action={updateAction} className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Update Lead</h2>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Update status, notes, and next follow-up date.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Lead Status
            </label>
            <select
              name="status"
              defaultValue={currentStatus}
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            >
              {LEAD_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Follow-up Date
            </label>
            <input
              name="followUpAt"
              type="datetime-local"
              defaultValue={formatDateTimeLocal(currentFollowUpAt)}
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-950">
              Notes
            </label>
            <Textarea
              name="notes"
              defaultValue={currentNotes || ""}
              placeholder="Example: Customer asked to call again tomorrow. Interested in 1000 sqft plot."
            />
          </div>

          <Button type="submit" className="w-full">
            Save Lead Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}