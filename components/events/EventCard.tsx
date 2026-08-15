"use client";
import { Calendar, MapPin, Pencil, Trash2, Eye } from "lucide-react";
import { EventInput } from "@/lib/validations";

interface EventRow extends EventInput { _id: string; }

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=60";

const CATEGORY_STYLES: Record<string, string> = {
  Workshop: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  Seminar: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  Hackathon: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  Talk: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
  Social: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

interface EventCardProps {
  event: EventRow;
  variant: "public" | "admin";
  onView?: (event: EventRow) => void;
  onEdit?: (event: EventRow) => void;
  onDelete?: (event: EventRow) => void;
}

export default function EventCard({ event, variant, onView, onEdit, onDelete }: EventCardProps) {
  const dateLabel = new Date(event.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5">
      <button
        type="button"
        onClick={() => onView?.(event)}
        disabled={!onView}
        className="relative h-40 w-full overflow-hidden bg-slate-100 text-left dark:bg-slate-800 disabled:cursor-default"
      >
        <img
          src={event.imageUrl || FALLBACK_IMAGE}
          alt={event.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur ${
            CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES.Other
          }`}
        >
          {event.category}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <button
          type="button"
          onClick={() => onView?.(event)}
          disabled={!onView}
          className="text-left disabled:cursor-default"
        >
          {/* ONLY DARK MODE FIX */}
          <h3 className="line-clamp-2 font-semibold text-slate-900 dark:text-white hover:text-brand-600">
            {event.title}
          </h3>
        </button>

        {/* ONLY DARK MODE FIX */}
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-300">
          {event.description}
        </p>

        {/* ONLY DARK MODE FIX */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-300">
          <p className="flex items-center gap-1.5">
            <Calendar size={13} />
            {dateLabel}
          </p>

          <p className="flex items-center gap-1.5 truncate">
            <MapPin size={13} />
            {event.venue}
          </p>
        </div>

        <div className="mt-4 flex-1" />

        {variant === "public" ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-2 w-full"
          >
            Register Now →
          </a>
        ) : (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onView?.(event)}
              className="btn-secondary flex-1 !px-3 text-sm"
            >
              <Eye size={14} /> View
            </button>

            <button
              onClick={() => onEdit?.(event)}
              className="btn-secondary flex-1 !px-3 text-sm"
            >
              <Pencil size={14} /> Edit
            </button>

            <button
              onClick={() => onDelete?.(event)}
              className="btn-danger !px-3 text-sm"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}