const mongoose = require("mongoose");

const medicationAlertSchema = new mongoose.Schema(
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
    scheduledFor: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    channels: {
      type: [String],
      default: ["in_app"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "skipped"],
      default: "pending",
    },
    acknowledgedAt: Date,
    lastNotifiedAt: Date,
  },
  {
    timestamps: true,
  },
);

medicationAlertSchema.index({ medication: 1, scheduledFor: 1 }, { unique: true });

module.exports = mongoose.model("MedicationAlert", medicationAlertSchema);
