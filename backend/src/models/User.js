const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isContactVerified: {
      type: Boolean,
      default: false,
    },
    emergencyContactName: {
      type: String,
      default: "",
      trim: true,
    },
    emergencyContactPhone: {
      type: String,
      default: "",
      trim: true,
    },
    medicalNotes: {
      type: String,
      default: "",
      trim: true,
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    fullName: this.fullName,
    contact: this.contact,
    isContactVerified: this.isContactVerified,
    emergencyContactName: this.emergencyContactName,
    emergencyContactPhone: this.emergencyContactPhone,
    medicalNotes: this.medicalNotes,
    timezone: this.timezone,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

module.exports = mongoose.model("User", userSchema);
