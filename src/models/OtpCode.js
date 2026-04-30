const mongoose = require("mongoose");

const otpCodeSchema = new mongoose.Schema(
  {
    purpose: {
      type: String,
      enum: ["signup", "login"],
      required: true,
    },
    contact: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpCode", otpCodeSchema);
