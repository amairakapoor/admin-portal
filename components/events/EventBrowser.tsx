"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import EventCard from "./EventCard";
import EventDetails from "./EventDetails";
import { EventInput } from "@/lib/validations";

interface EventRow extends EventInput { _id: string; }
const CATEGORIES = ["All", "Workshop", "Seminar", "Hackathon", "Talk", "Social", "Other"];

export default function EventsBrowser({ initialEvents }: { initialEvents: EventRow[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewing, setViewing] = useState<EventRow | null>(null);

  const filtered = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesSearch = !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || event.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [initialEvents, search, category]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-field pl-10" placeholder="Search events or venues…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:max-w-[180px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-sm text-slate-500">No events match your search.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event._id} event={event} variant="public" onView={setViewing} />
          ))}
        </div>
      )}

      {viewing && <EventDetails event={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}