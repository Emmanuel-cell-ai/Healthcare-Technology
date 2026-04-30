const Joi = require("joi");

const Appointment = require("../models/Appointment");
const DoctorPatientAssignment = require("../models/DoctorPatientAssignment");
const Medication = require("../models/Medication");
const MedicationAlert = require("../models/MedicationAlert");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const requestAppointmentSchema = Joi.object({
  doctorId: Joi.string().trim().required(),
  notes: Joi.string().trim().max(500).allow("", null),
});

function buildDoctorAvailability(doctor, activeAssignments) {
  const assignedPatientsCount = activeAssignments.get(String(doctor._id)) || 0;
  const status = doctor.availabilityStatus === "fully_booked" || assignedPatientsCount >= doctor.maxPatients
    ? "fully_booked"
    : "available";

  return {
    id: doctor._id,
    fullName: doctor.fullName,
    email: doctor.email,
    contact: doctor.contact,
    specialization: doctor.specialization,
    availabilityStatus: status,
    assignedPatientsCount,
    maxPatients: doctor.maxPatients,
  };
}

exports.listDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "doctor" }).sort({ createdAt: 1 });
  const assignmentCounts = await DoctorPatientAssignment.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: "$doctor", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(assignmentCounts.map((item) => [String(item._id), item.count]));
  return res.status(200).json({
    doctors: doctors.map((doctor) => buildDoctorAvailability(doctor, countMap)),
  });
});

exports.requestAppointment = asyncHandler(async (req, res) => {
  const payload = await requestAppointmentSchema.validateAsync(req.body, { abortEarly: false });
  const doctor = await User.findOne({ _id: payload.doctorId, role: "doctor" });

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found." });
  }

  const activeAssignmentsCount = await DoctorPatientAssignment.countDocuments({
    doctor: doctor._id,
    status: "active",
  });

  if (doctor.availabilityStatus === "fully_booked" || activeAssignmentsCount >= doctor.maxPatients) {
    return res.status(409).json({ message: "This doctor is currently fully booked." });
  }

  const existingAssignment = await DoctorPatientAssignment.findOne({
    doctor: doctor._id,
    patient: req.user._id,
    status: "active",
  });

  if (existingAssignment) {
    return res.status(409).json({ message: "You are already assigned to this doctor." });
  }

  const queueNumber = (await Appointment.countDocuments({ doctor: doctor._id })) + 1;
  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctor._id,
    queueNumber,
    notes: payload.notes || "",
  });

  const assignment = await DoctorPatientAssignment.create({
    doctor: doctor._id,
    patient: req.user._id,
    appointment: appointment._id,
  });

  return res.status(201).json({
    message: "Appointment created and assigned in FIFO order.",
    appointment,
    assignment,
  });
});

exports.listMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .sort({ createdAt: -1 })
    .populate("doctor", "fullName specialization availabilityStatus maxPatients");

  return res.status(200).json({ appointments });
});

exports.getMyRecords = asyncHandler(async (req, res) => {
  const [medications, alerts] = await Promise.all([
    Medication.find({ user: req.user._id }).sort({ createdAt: -1 }),
    MedicationAlert.find({ user: req.user._id }).sort({ scheduledFor: -1 }).limit(20),
  ]);

  return res.status(200).json({
    patient: req.user.toSafeObject(),
    medications,
    alerts,
  });
});

exports.uploadMedicalReports = asyncHandler(async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    return res.status(400).json({ message: "At least one report file is required." });
  }

  const uploadedReports = files.map((file) => ({
    fileName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    filePath: `/uploads/reports/${file.filename}`,
    uploadedAt: new Date(),
  }));

  req.user.medicalReports = [...req.user.medicalReports, ...uploadedReports];
  await req.user.save();

  return res.status(200).json({
    message: "Medical report uploaded successfully.",
    medicalReports: req.user.medicalReports,
    user: req.user.toSafeObject(),
  });
});
