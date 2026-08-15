import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { eventSchema } from "@/lib/validations";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid event id" },
      { status: 400 }
    );
  }

  await connectDB();

  const event = await Event.findById(id).lean();

  if (!event) {
    return NextResponse.json(
      { success: false, error: "Event not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: event,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid event id" },
      { status: 400 }
    );
  }

  await connectDB();

  const body = await req.json();

  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid event data",
      },
      { status: 400 }
    );
  }

  const updated = await Event.findByIdAndUpdate(
    id,
    parsed.data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updated) {
    return NextResponse.json(
      { success: false, error: "Event not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: updated,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid event id" },
      { status: 400 }
    );
  }

  await connectDB();

  const deleted = await Event.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Event not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { id },
  });
}