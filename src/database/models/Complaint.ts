import { model, Schema } from "mongoose";

const complaintSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  countComplaints: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
  location: {
    type: [Number, Number],
  },
  imageBackUp: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Complaint = model("Complaint", complaintSchema, "complaints");

export default Complaint;
