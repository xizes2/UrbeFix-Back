import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true, unique: true },
  lastName: { type: String, required: true, unique: true },
  profileImage: { type: String, unique: true },
  userEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
});

export const User = model("User", userSchema, "users");
