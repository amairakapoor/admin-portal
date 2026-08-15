import mongoose, { Schema, models, model } from "mongoose";

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  category: "Workshop" | "Seminar" | "Hackathon" | "Talk" | "Social" | "Other";
  imageUrl: string;
  registrationLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
      type: String,
      required: true,
      enum: ["Workshop", "Seminar", "Hackathon", "Talk", "Social", "Other"],
      default: "Other",
    },
    imageUrl: { type: String, default: "" },
    registrationLink: { type: String, required: true },
  },
  { timestamps: true } // auto-adds createdAt and updatedAt
);

EventSchema.index({ date: 1 });     // speeds up sorting by soonest event
EventSchema.index({ category: 1 }); // speeds up category filter queries

export default models.Event || model<IEvent>("Event", EventSchema);