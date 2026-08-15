"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import EventForm from "@/components/events/EventForm";
import EventCard from "@/components/events/EventCard";
import EventDetails from "@/components/events/EventDetails";
import DashBoardHeader from "@/components/ui/DashBoardHeader";
import { EventInput } from "@/lib/validations";

interface EventRow extends EventInput { _id: string; }
type ModalState =
  | { mode: "closed" } | { mode: "create" } | { mode: "view"; event: EventRow }
  | { mode: "edit"; event: EventRow } | { mode: "delete"; event: EventRow };

export default function DashboardPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events?limit=50");
      const data = await res.json();
      if (data.success) setEvents(data.data);
      else toast.error(data.error || "Failed to load events");
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  async function handleDelete(event: EventRow) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${event._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) { toast.error(data.error || "Failed to delete event"); return; }
      toast.success("Event deleted");
      setModal({ mode: "closed" });
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <DashBoardHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">All Events</h2>
            <p className="text-sm text-slate-500">{events.length} total</p>
          </div>
          <button onClick={() => setModal({ mode: "create" })} className="btn-primary">
            <Plus size={16} /> Add Event
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="card h-72 animate-pulse" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="card p-12 text-center text-sm text-slate-500">
            No events yet. Click &quot;Add Event&quot; to create your first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} variant="admin"
                onView={(e) => setModal({ mode: "view", event: e })}
                onEdit={(e) => setModal({ mode: "edit", event: e })}
                onDelete={(e) => setModal({ mode: "delete", event: e })} />
            ))}
          </div>
        )}
      </main>

      {modal.mode === "create" && (
        <Modal title="Add New Event" onClose={() => setModal({ mode: "closed" })}>
          <EventForm onSuccess={() => { setModal({ mode: "closed" }); fetchEvents(); }}
            onCancel={() => setModal({ mode: "closed" })} />
        </Modal>
      )}
      {modal.mode === "view" && (
        <EventDetails event={modal.event} onClose={() => setModal({ mode: "closed" })} />
      )}
      {modal.mode === "edit" && (
        <Modal title="Edit Event" onClose={() => setModal({ mode: "closed" })}>
          <EventForm eventId={modal.event._id}
            initialValues={{ ...modal.event, date: new Date(modal.event.date).toISOString().slice(0, 16) }}
            onSuccess={() => { setModal({ mode: "closed" }); fetchEvents(); }}
            onCancel={() => setModal({ mode: "closed" })} />
        </Modal>
      )}
      {modal.mode === "delete" && (
        <Modal title="Delete Event" onClose={() => setModal({ mode: "closed" })}>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <strong>{modal.event.title}</strong>? This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setModal({ mode: "closed" })} className="btn-secondary">Cancel</button>
            <button onClick={() => handleDelete(modal.event)} disabled={deleting} className="btn-danger">
              {deleting ? "Deleting…" : "Delete Event"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}