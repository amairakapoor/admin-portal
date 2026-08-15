import { Calendar, MapPin, Tag } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { EventInput } from "@/lib/validations";

interface EventRow extends EventInput { _id: string; }

export default function EventDetailsModal({ event, onClose }: { event: EventRow; onClose: () => void }) {
  const dateLabel = new Date(event.date).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });

  return (
    <Modal title={event.title} onClose={onClose}>
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title} className="mb-4 h-44 w-full rounded-lg object-cover" />
      )}
      <div className="space-y-2 text-sm text-slate-500">
        <p className="flex items-center gap-2"><Tag size={14} /> {event.category}</p>
        <p className="flex items-center gap-2"><Calendar size={14} /> {dateLabel}</p>
        <p className="flex items-center gap-2"><MapPin size={14} /> {event.venue}</p>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{event.description}</p>
      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full">
        Register Now →
      </a>
    </Modal>
  );
}