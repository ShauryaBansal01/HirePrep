import mongoose, { Document, Schema } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// 2. Pass the IUser interface to the Schema constructor.
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "admin"],
      default: "candidate",
    },
  },
  {
    timestamps: true,
  }
);

// 3. Pass the IUser interface to the model
export default mongoose.model<IUser>("User", userSchema);
