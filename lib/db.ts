import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri || mongoUri.trim() === "") {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const mongoUriString = mongoUri.trim();

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(mongoUriString);

    console.log("MongoDB connected");

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}