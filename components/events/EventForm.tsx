"use client";
import { useState } from "react";
import { toast } from "sonner";
import { eventSchema, EventInput } from "@/lib/validations";

const CATEGORIES = ["Workshop", "Seminar", "Hackathon", "Talk", "Social", "Other"] as const;
const emptyValues: EventInput = {
  title: "", description: "", date: "", venue: "",
  category: "Workshop", imageUrl: "", registrationLink: "",
};

export default function EventForm({ initialValues, onSuccess, onCancel, eventId }: {
  initialValues?: Partial<EventInput>;
  onSuccess: () => void;
  onCancel: () => void;
  eventId?: string;
}) {
  const [values, setValues] = useState<EventInput>({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof EventInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof EventInput>(key: K, value: EventInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = eventSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof EventInput, string>> = {};
      parsed.error.issues.forEach((err) => {
        const key = err.path[0] as keyof EventInput | undefined;
        if (key) {
          fieldErrors[key] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const url = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.error); return; }
      toast.success(eventId ? "Event updated" : "Event created");
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Event Title</label>
        <input className="input-field" value={values.title}
          onChange={(e) => update("title", e.target.value)} />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <textarea className="input-field min-h-[100px]" value={values.description}
          onChange={(e) => update("description", e.target.value)} />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Date & Time</label>
          <input type="datetime-local" className="input-field" value={values.date}
            onChange={(e) => update("date", e.target.value)} />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Category</label>
          <select className="input-field" value={values.category}
            onChange={(e) => update("category", e.target.value as EventInput["category"])}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Venue</label>
        <input className="input-field" value={values.venue}
          onChange={(e) => update("venue", e.target.value)} />
        {errors.venue && <p className="mt-1 text-xs text-red-500">{errors.venue}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Image URL</label>
        <input className="input-field" value={values.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          placeholder="https://example.com/banner.jpg" />
        {errors.imageUrl && <p className="mt-1 text-xs text-red-500">{errors.imageUrl}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Registration Link</label>
        <input className="input-field" value={values.registrationLink}
          onChange={(e) => update("registrationLink", e.target.value)} />
        {errors.registrationLink && <p className="mt-1 text-xs text-red-500">{errors.registrationLink}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : eventId ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </form>
  );
}