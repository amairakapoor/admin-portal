import { connectDB } from "@/lib/db";
import Event, { IEvent } from "@/models/Event";
import EventBrowser from "@/components/events/EventBrowser";
import PublicNavBar from "@/components/ui/PublicNavBar";

export const dynamic = "force-dynamic";

async function getEvents(): Promise<IEvent[]> {
  await connectDB();
  const events = await Event.find({}).sort({ date: 1 }).lean();
  return JSON.parse(JSON.stringify(events));
}

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <main className="min-h-screen">
      <PublicNavBar />
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Upcoming Events</h1>
          <p className="mt-2 text-sm text-slate-500">Explore workshops, talks, and hackathons hosted by the MSc Society.</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <EventBrowser initialEvents={events as any} />
      </div>
    </main>
  );
}