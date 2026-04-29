require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");

const DEFAULT_PATIENT = {
  role: "patient",
  fullName: "John Doe",
  email: "patient@example.com",
  contact: "patient123",
  passwordHash: "",
  isContactVerified: true,
  emergencyContactName: "Jane Doe",
  emergencyContactPhone: "emergency123",
  medicalNotes: "Default patient account for testing",
  timezone: "UTC",
};

const DEFAULT_DOCTOR = {
  role: "doctor",
  fullName: "Dr. Sarah Smith",
  email: "doctor@example.com",
  contact: "doctor123",
  passwordHash: "",
  isContactVerified: true,
  emergencyContactName: "",
  emergencyContactPhone: "",
  medicalNotes: "",
  timezone: "UTC",
  specialization: "General Medicine",
  maxPatients: 50,
  licenseVerified: true,
};

const DEFAULT_PASSWORD = "password123";

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Hash the password
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    // Create patient account
    const patientData = { ...DEFAULT_PATIENT, passwordHash };
    const existingPatient = await User.findOne({ email: patientData.email });
    
    if (existingPatient) {
      console.log("Patient account already exists");
    } else {
      await User.create(patientData);
      console.log("Created default patient account:");
      console.log(`  Email: ${patientData.email}`);
      console.log(`  Contact: ${patientData.contact}`);
      console.log(`  Password: ${DEFAULT_PASSWORD}`);
    }

    // Create doctor account
    const doctorData = { ...DEFAULT_DOCTOR, passwordHash };
    const existingDoctor = await User.findOne({ email: doctorData.email });
    
    if (existingDoctor) {
      console.log("Doctor account already exists");
    } else {
      await User.create(doctorData);
      console.log("Created default doctor account:");
      console.log(`  Email: ${doctorData.email}`);
      console.log(`  Contact: ${doctorData.contact}`);
      console.log(`  Password: ${DEFAULT_PASSWORD}`);
    }

    console.log("\n✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();