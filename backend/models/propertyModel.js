const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "A property must have a title"] },
    type: { type: String, enum: ["Residential", "Commercial"], required: true },
    location: { type: String, required: true },
    area: { type: String, required: true },
    googleMapsLink: { type: String, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    features: [String],
    ownerDetails: { type: String },
    images: { type: [String], required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", location: "text", area: "text" });

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
