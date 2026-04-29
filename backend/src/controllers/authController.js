const bcrypt = require("bcryptjs");
const Joi = require("joi");

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { issueToken } = require("../services/tokenService");
const { sendMail } = require("../services/emailService");
const { generateTemporaryPassword } = require("../utils/password");

const signupSchema = Joi.object({
  role: Joi.string().valid("patient", "doctor").required(),
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  contact: Joi.string().trim().min(5).max(120).required(),
  password: Joi.string().min(8).max(128).required(),
  emergencyContactName: Joi.string().trim().max(120).allow("", null),
  emergencyContactPhone: Joi.string().trim().max(60).allow("", null),
  medicalNotes: Joi.string().trim().max(500).allow("", null),
  timezone: Joi.string().trim().max(60).default("UTC"),
  specialization: Joi.when("role", {
    is: "doctor",
    then: Joi.string().trim().max(120).allow("", null),
    otherwise: Joi.forbidden(),
  }),
  maxPatients: Joi.when("role", {
    is: "doctor",
    then: Joi.number().integer().min(1).max(500).default(10),
    otherwise: Joi.forbidden(),
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  temporaryPassword: Joi.string().min(8).max(128).required(),
  newPassword: Joi.string().min(8).max(128).required(),
});

function toFileMetadata(file) {
  if (!file) {
    return null;
  }

  return {
    fileName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    filePath: `/uploads/${file.fieldname === "doctorLicense" ? "licenses" : "reports"}/${file.filename}`,
    uploadedAt: new Date(),
  };
}

exports.signup = asyncHandler(async (req, res) => {
  const payload = await signupSchema.validateAsync(req.body, { abortEarly: false, convert: true });
  const existingUser = await User.findOne({
    $or: [{ email: payload.email.toLowerCase() }, { contact: payload.contact.toLowerCase() }],
  });

  if (existingUser) {
    return res.status(409).json({ message: "A user already exists with this email or contact." });
  }

  if (payload.role === "doctor" && !req.files?.doctorLicense?.[0]) {
    return res.status(400).json({ message: "Doctor license upload is required." });
  }

  if (payload.role === "patient" && (!req.files?.medicalReports || req.files.medicalReports.length === 0)) {
    return res.status(400).json({ message: "At least one medical report upload is required." });
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    role: payload.role,
    fullName: payload.fullName,
    email: payload.email.toLowerCase(),
    contact: payload.contact.toLowerCase(),
    passwordHash,
    emergencyContactName: payload.emergencyContactName || "",
    emergencyContactPhone: payload.emergencyContactPhone || "",
    medicalNotes: payload.medicalNotes || "",
    timezone: payload.timezone || "UTC",
    specialization: payload.role === "doctor" ? payload.specialization || "" : "",
    maxPatients: payload.role === "doctor" ? payload.maxPatients || 10 : 10,
    doctorLicense: payload.role === "doctor" ? toFileMetadata(req.files.doctorLicense[0]) : undefined,
    medicalReports:
      payload.role === "patient" ? req.files.medicalReports.map((file) => toFileMetadata(file)) : [],
    isContactVerified: true,
  });

  const token = issueToken(user);
  return res.status(201).json({
    message: "Signup completed successfully.",
    token,
    user: user.toSafeObject(),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const payload = await loginSchema.validateAsync(req.body, { abortEarly: false });
  const user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "No account was found for this email address." });
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = issueToken(user);
  return res.status(200).json({
    message: "Login successful.",
    token,
    user: user.toSafeObject(),
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const payload = await forgotPasswordSchema.validateAsync(req.body, { abortEarly: false });
  const user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "No account was found for this email address." });
  }

  const temporaryPassword = generateTemporaryPassword();
  user.passwordHash = await bcrypt.hash(temporaryPassword, 12);
  await user.save();

  await sendMail({
    to: user.email,
    subject: "Your temporary password",
    text: `Hello ${user.fullName}, your temporary password is ${temporaryPassword}. Please log in and change it immediately.`,
    html: `<p>Hello ${user.fullName},</p><p>Your temporary password is <strong>${temporaryPassword}</strong>.</p><p>Please log in and change it immediately.</p>`,
  });

  return res.status(200).json({
    message: "A temporary password has been sent to the user's email.",
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const payload = await resetPasswordSchema.validateAsync(req.body, { abortEarly: false });
  const user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "No account was found for this email address." });
  }

  const isValidPassword = await bcrypt.compare(payload.temporaryPassword, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: "The temporary password is invalid." });
  }

  user.passwordHash = await bcrypt.hash(payload.newPassword, 12);
  await user.save();

  return res.status(200).json({
    message: "Password reset successful. You can now log in with your new password.",
  });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user.toSafeObject() });
});
