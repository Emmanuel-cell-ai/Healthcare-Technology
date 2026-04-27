const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
    doctorLicense: {
      fileName: {
        type: String,
        default: "",
      },
      originalName: {
        type: String,
        default: "",
      },
      mimeType: {
        type: String,
        default: "",
      },
      filePath: {
        type: String,
        default: "",
      },
      uploadedAt: Date,
    },
    medicalReports: {
      type: [
        {
          fileName: String,
          originalName: String,
          mimeType: String,
          filePath: String,
          uploadedAt: Date,
        },
      ],
      default: [],
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "fully_booked"],
      default: "available",
    },
    specialization: {
      type: String,
      default: "",
      trim: true,
    },
    maxPatients: {
      type: Number,
      default: 10,
      min: 1,
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
    role: this.role,
    fullName: this.fullName,
    email: this.email,
    contact: this.contact,
    isContactVerified: this.isContactVerified,
    emergencyContactName: this.emergencyContactName,
    emergencyContactPhone: this.emergencyContactPhone,
    medicalNotes: this.medicalNotes,
    doctorLicense: this.role === "doctor" ? this.doctorLicense : undefined,
    medicalReports: this.role === "patient" ? this.medicalReports : undefined,
    availabilityStatus: this.role === "doctor" ? this.availabilityStatus : undefined,
    specialization: this.role === "doctor" ? this.specialization : undefined,
    maxPatients: this.role === "doctor" ? this.maxPatients : undefined,
    timezone: this.timezone,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

module.exports = mongoose.model("User", userSchema);
