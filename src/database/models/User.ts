import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  firstSurname: { type: String, required: true },
  profileImage: { type: String },
  userEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = model("User", userSchema, "users");
