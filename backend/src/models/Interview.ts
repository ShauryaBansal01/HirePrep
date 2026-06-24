import mongoose, { Document, Schema } from "mongoose";

// 1. The Interface
export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  role: string;
  difficulty: string;
  questions: string[];
  status: "pending" | "completed";
}

// 2. The Schema
const interviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    questions: {
      type: [String], // Array of strings
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// 3. Export the Model
export default mongoose.model<IInterview>("Interview", interviewSchema);
