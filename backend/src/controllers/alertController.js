const DoseLog = require("../models/DoseLog");
const Medication = require("../models/Medication");
const MedicationAlert = require("../models/MedicationAlert");
const asyncHandler = require("../utils/asyncHandler");
const { getDueWindowBounds } = require("../utils/time");

exports.listAlerts = asyncHandler(async (req, res) => {
  const alerts = await MedicationAlert.find({ user: req.user._id })
    .sort({ scheduledFor: -1 })
    .limit(100)
    .populate("medication", "name dosage scheduleTimes");

  return res.status(200).json({ alerts });
});

exports.takeAlertDose = asyncHandler(async (req, res) => {
  const alert = await MedicationAlert.findOne({
    _id: req.params.alertId,
    user: req.user._id,
  }).populate("medication");

  if (!alert) {
    return res.status(404).json({ message: "Alert not found." });
  }

  if (alert.status === "completed") {
    return res.status(200).json({ message: "Medication was already marked as taken.", alert });
  }

  const medication = await Medication.findById(alert.medication._id);
  if (!medication) {
    return res.status(404).json({ message: "Medication not found." });
  }

  const takenAt = new Date();
  const { windowStart, windowEnd } = getDueWindowBounds(takenAt, medication.adherenceWindowMinutes);
  const existingDose = await DoseLog.findOne({
    medication: medication._id,
    user: req.user._id,
    takenAt: { $gte: windowStart, $lte: windowEnd },
  });

  const doseLog =
    existingDose ||
    (await DoseLog.create({
      medication: medication._id,
      user: req.user._id,
      takenAt,
      notes: "Logged from in-app reminder action.",
    }));

  alert.status = "completed";
  alert.acknowledgedAt = takenAt;
  await alert.save();

  return res.status(200).json({
    message: "Dose recorded successfully.",
    alert,
    doseLog,
  });
});

exports.markAlertSkipped = asyncHandler(async (req, res) => {
  const alert = await MedicationAlert.findOneAndUpdate(
    { _id: req.params.alertId, user: req.user._id, status: "pending" },
    { $set: { status: "skipped" } },
    { new: true },
  );

  if (!alert) {
    return res.status(404).json({ message: "Pending alert not found." });
  }

  return res.status(200).json({
    message: "Dose marked as skipped.",
    alert,
  });
});
