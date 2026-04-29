const Joi = require("joi");

const Appointment = require("../models/Appointment");
const DoctorPatientAssignment = require("../models/DoctorPatientAssignment");
const DoseLog = require("../models/DoseLog");
const Medication = require("../models/Medication");
const MedicationAlert = require("../models/MedicationAlert");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const availabilitySchema = Joi.object({
  availabilityStatus: Joi.string().valid("available", "fully_booked").required(),
});

const appointmentStatusSchema = Joi.object({
  status: Joi.string().valid("queued", "accepted", "completed", "cancelled").required(),
});

function computeAdherenceSummary(totalAlerts, completedAlerts) {
  if (!totalAlerts) {
    return {
      totalReminders: 0,
      completedReminders: 0,
      skippedReminders: 0,
      adherenceRate: 0,
    };
  }

  return {
    totalReminders: totalAlerts,
    completedReminders: completedAlerts,
    skippedReminders: totalAlerts - completedAlerts,
    adherenceRate: Number(((completedAlerts / totalAlerts) * 100).toFixed(2)),
  };
}

exports.updateAvailability = asyncHandler(async (req, res) => {
  const payload = await availabilitySchema.validateAsync(req.body, { abortEarly: false });
  req.user.availabilityStatus = payload.availabilityStatus;
  await req.user.save();

  return res.status(200).json({
    message: "Doctor availability updated.",
    user: req.user.toSafeObject(),
  });
});

exports.getDashboard = asyncHandler(async (req, res) => {
  const [activeAssignments, queuedAppointments] = await Promise.all([
    DoctorPatientAssignment.countDocuments({ doctor: req.user._id, status: "active" }),
    Appointment.countDocuments({ doctor: req.user._id, status: "queued" }),
  ]);

  return res.status(200).json({
    doctor: req.user.toSafeObject(),
    stats: {
      assignedPatientsCount: activeAssignments,
      queuedAppointments,
      remainingCapacity: Math.max(req.user.maxPatients - activeAssignments, 0),
    },
  });
});

exports.listAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .sort({ assignedAt: 1 })
    .populate("patient", "fullName email contact medicalNotes timezone medicalReports");

  return res.status(200).json({ appointments });
});

exports.listPatients = asyncHandler(async (req, res) => {
  const assignments = await DoctorPatientAssignment.find({
    doctor: req.user._id,
    status: "active",
  })
    .sort({ assignedAt: 1 })
    .populate("patient", "fullName email contact medicalReports medicalNotes timezone")
    .populate("appointment", "queueNumber status assignedAt");

  const patientIds = assignments.map((assignment) => assignment.patient._id);
  const [alertsByPatient, completedByPatient] = await Promise.all([
    MedicationAlert.aggregate([
      { $match: { user: { $in: patientIds } } },
      { $group: { _id: "$user", total: { $sum: 1 } } },
    ]),
    MedicationAlert.aggregate([
      { $match: { user: { $in: patientIds }, status: "completed" } },
      { $group: { _id: "$user", total: { $sum: 1 } } },
    ]),
  ]);

  const totalMap = new Map(alertsByPatient.map((item) => [String(item._id), item.total]));
  const completedMap = new Map(completedByPatient.map((item) => [String(item._id), item.total]));

  return res.status(200).json({
    patients: assignments.map((assignment) => ({
      assignmentId: assignment._id,
      assignedAt: assignment.assignedAt,
      queueNumber: assignment.appointment?.queueNumber,
      appointmentStatus: assignment.appointment?.status,
      patient: assignment.patient,
      adherence: computeAdherenceSummary(
        totalMap.get(String(assignment.patient._id)) || 0,
        completedMap.get(String(assignment.patient._id)) || 0,
      ),
    })),
  });
});

exports.getPatientRecords = asyncHandler(async (req, res) => {
  const assignment = await DoctorPatientAssignment.findOne({
    doctor: req.user._id,
    patient: req.params.patientId,
    status: "active",
  });

  if (!assignment) {
    return res.status(403).json({ message: "This patient is not assigned to you." });
  }

  const [patient, medications, doseLogs, alerts] = await Promise.all([
    User.findById(req.params.patientId),
    Medication.find({ user: req.params.patientId }).sort({ createdAt: -1 }),
    DoseLog.find({ user: req.params.patientId }).sort({ takenAt: -1 }).limit(100),
    MedicationAlert.find({ user: req.params.patientId }).sort({ scheduledFor: -1 }).limit(100),
  ]);

  if (!patient) {
    return res.status(404).json({ message: "Patient not found." });
  }

  return res.status(200).json({
    patient: patient.toSafeObject(),
    medications,
    doseLogs,
    alerts,
  });
});

exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const payload = await appointmentStatusSchema.validateAsync(req.body, { abortEarly: false });
  const appointment = await Appointment.findOne({
    _id: req.params.appointmentId,
    doctor: req.user._id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  appointment.status = payload.status;
  await appointment.save();

  if (payload.status === "completed" || payload.status === "cancelled") {
    await DoctorPatientAssignment.updateMany(
      { appointment: appointment._id },
      { $set: { status: "completed" } },
    );
  }

  return res.status(200).json({
    message: "Appointment status updated.",
    appointment,
  });
});

exports.uploadLicense = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "A doctor license file is required." });
  }

  req.user.doctorLicense = {
    fileName: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    filePath: `/uploads/licenses/${req.file.filename}`,
    uploadedAt: new Date(),
  };
  await req.user.save();

  return res.status(200).json({
    message: "Doctor license uploaded successfully.",
    user: req.user.toSafeObject(),
  });
});
