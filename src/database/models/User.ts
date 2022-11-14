import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  firstSurname: { type: String, required: true },
  profileImage: { type: String },
  userEmail: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  complaints: [{ type: Schema.Types.ObjectId, ref: "Complaint" }],
});

export const User = model("User", userSchema, "users");
