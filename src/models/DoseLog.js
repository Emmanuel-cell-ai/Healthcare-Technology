const mongoose = require("mongoose");

const doseLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
      index: true,
    },
    takenAt: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    sideEffects: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DoseLog", doseLogSchema);
