const Joi = require("joi");

const DoseLog = require("../models/DoseLog");
const Medication = require("../models/Medication");
const MedicationAlert = require("../models/MedicationAlert");
const asyncHandler = require("../utils/asyncHandler");
const { getDueWindowBounds } = require("../utils/time");

const medicationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  dosage: Joi.string().trim().min(1).max(120).required(),
  instructions: Joi.string().trim().max(500).allow("", null),
  scheduleTimes: Joi.array()
    .items(Joi.string().trim().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/))
    .min(1)
    .required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).allow(null),
  adherenceWindowMinutes: Joi.number().integer().min(5).max(240).default(30),
  reminderChannels: Joi.array()
    .items(Joi.string().valid("in_app", "email", "sms"))
    .min(1)
    .default(["in_app"]),
  prescriberName: Joi.string().trim().max(120).allow("", null),
  refillDate: Joi.date().allow(null),
  notes: Joi.string().trim().max(500).allow("", null),
  isActive: Joi.boolean().default(true),
});

const medicationUpdateSchema = medicationSchema.fork(
  ["name", "dosage", "scheduleTimes", "startDate"],
  (schema) => schema.optional(),
);

const doseLogSchema = Joi.object({
  takenAt: Joi.date().default(() => new Date(), "current timestamp"),
  notes: Joi.string().trim().max(500).allow("", null),
  sideEffects: Joi.string().trim().max(500).allow("", null),
});

exports.createMedication = asyncHandler(async (req, res) => {
  const payload = await medicationSchema.validateAsync(req.body, { abortEarly: false });

  const medication = await Medication.create({
    ...payload,
    user: req.user._id,
  });

  return res.status(201).json({
    message: "Medication schedule created.",
    medication,
  });
});

exports.listMedications = asyncHandler(async (req, res) => {
  const medications = await Medication.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({ medications });
});

exports.updateMedication = asyncHandler(async (req, res) => {
  const payload = await medicationUpdateSchema.min(1).validateAsync(req.body, { abortEarly: false });
  const medication = await Medication.findOneAndUpdate(
    { _id: req.params.medicationId, user: req.user._id },
    payload,
    { new: true, runValidators: true },
  );

  if (!medication) {
    return res.status(404).json({ message: "Medication not found." });
  }

  return res.status(200).json({
    message: "Medication updated.",
    medication,
  });
});

exports.logDose = asyncHandler(async (req, res) => {
  const payload = await doseLogSchema.validateAsync(req.body, { abortEarly: false });
  const medication = await Medication.findOne({ _id: req.params.medicationId, user: req.user._id });

  if (!medication) {
    return res.status(404).json({ message: "Medication not found." });
  }

  const doseLog = await DoseLog.create({
    medication: medication._id,
    user: req.user._id,
    ...payload,
  });

  const { windowStart, windowEnd } = getDueWindowBounds(
    new Date(payload.takenAt),
    medication.adherenceWindowMinutes,
  );

  await MedicationAlert.updateMany(
    {
      user: req.user._id,
      medication: medication._id,
      scheduledFor: {
        $gte: windowStart,
        $lte: windowEnd,
      },
      status: { $in: ["pending", "missed"] },
    },
    {
      $set: {
        status: "completed",
        acknowledgedAt: new Date(payload.takenAt),
      },
    },
  );

  return res.status(201).json({
    message: "Dose logged successfully.",
    doseLog,
  });
});

exports.getMedicationTimeline = asyncHandler(async (req, res) => {
  const medication = await Medication.findOne({ _id: req.params.medicationId, user: req.user._id });
  if (!medication) {
    return res.status(404).json({ message: "Medication not found." });
  }

  const [alerts, doses] = await Promise.all([
    MedicationAlert.find({ medication: medication._id, user: req.user._id })
      .sort({ scheduledFor: -1 })
      .limit(30),
    DoseLog.find({ medication: medication._id, user: req.user._id })
      .sort({ takenAt: -1 })
      .limit(30),
  ]);

  return res.status(200).json({
    medication,
    alerts,
    doses,
  });
});
