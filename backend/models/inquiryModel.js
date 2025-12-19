const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    phone: { type: String, required: [true, "Phone is required"] },
    message: { type: String, required: [true, "Message is required"] },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: true,
    },
    agent: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
