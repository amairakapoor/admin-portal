import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { eventSchema } from "@/lib/validations";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(searchParams.get("limit")) || 9);

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") query.category = category;

    const [events, total] = await Promise.all([
      Event.find(query).sort({ date: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Event.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const event = await Event.create(parsed.data);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}