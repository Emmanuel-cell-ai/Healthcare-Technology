const MedicationAlert = require("../models/MedicationAlert");
const asyncHandler = require("../utils/asyncHandler");

exports.listAlerts = asyncHandler(async (req, res) => {
  const alerts = await MedicationAlert.find({ user: req.user._id })
    .sort({ scheduledFor: -1 })
    .limit(100)
    .populate("medication", "name dosage scheduleTimes");

  return res.status(200).json({ alerts });
});

exports.acknowledgeAlert = asyncHandler(async (req, res) => {
  const alert = await MedicationAlert.findOneAndUpdate(
    { _id: req.params.alertId, user: req.user._id },
    {
      $set: {
        acknowledgedAt: new Date(),
        status: "completed",
      },
    },
    { new: true },
  );

  if (!alert) {
    return res.status(404).json({ message: "Alert not found." });
  }

  return res.status(200).json({
    message: "Alert acknowledged.",
    alert,
  });
});
