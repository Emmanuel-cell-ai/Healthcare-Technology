const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["queued", "accepted", "completed", "cancelled"],
      default: "queued",
      index: true,
    },
    queueNumber: {
      type: Number,
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({ patient: 1, doctor: 1, status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
