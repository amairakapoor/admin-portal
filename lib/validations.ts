import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  date: z.string().min(1, "Date is required"),
  venue: z.string().min(2, "Venue is required").max(200),
  category: z.enum(["Workshop", "Seminar", "Hackathon", "Talk", "Social", "Other"]),
  imageUrl: z.string().url("Must be a valid image URL").or(z.literal("")),
  registrationLink: z.string().url("Must be a valid URL (include https://)"),
});

export type EventInput = z.infer<typeof eventSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;