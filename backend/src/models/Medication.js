const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      default: "",
      trim: true,
    },
    scheduleTimes: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one schedule time is required.",
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    adherenceWindowMinutes: {
      type: Number,
      default: 30,
    },
    reminderChannels: {
      type: [String],
      default: ["in_app"],
    },
    prescriberName: {
      type: String,
      default: "",
      trim: true,
    },
    refillDate: Date,
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Medication", medicationSchema);
