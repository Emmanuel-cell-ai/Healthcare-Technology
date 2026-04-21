const bcrypt = require("bcryptjs");
const Joi = require("joi");

const OtpCode = require("../models/OtpCode");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { issueToken } = require("../services/tokenService");
const { createOtpChallenge, sanitizeOtpResponse, verifyOtpCode } = require("../services/otpService");

const profileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  contact: Joi.string().trim().min(5).max(120).required(),
  password: Joi.string().min(8).max(128).required(),
  emergencyContactName: Joi.string().trim().max(120).allow("", null),
  emergencyContactPhone: Joi.string().trim().max(60).allow("", null),
  medicalNotes: Joi.string().trim().max(500).allow("", null),
  timezone: Joi.string().trim().max(60).default("UTC"),
});

const otpVerifySchema = Joi.object({
  contact: Joi.string().trim().required(),
  otp: Joi.string().trim().length(6).required(),
});

const loginRequestSchema = Joi.object({
  contact: Joi.string().trim().required(),
  password: Joi.string().min(8).max(128).required(),
});

exports.requestSignupOtp = asyncHandler(async (req, res) => {
  const payload = await profileSchema.validateAsync(req.body, { abortEarly: false });
  const existingUser = await User.findOne({ contact: payload.contact.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({ message: "An account already exists for this contact." });
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const challenge = await createOtpChallenge({
    purpose: "signup",
    contact: payload.contact,
    metadata: {
      fullName: payload.fullName,
      passwordHash,
      emergencyContactName: payload.emergencyContactName || "",
      emergencyContactPhone: payload.emergencyContactPhone || "",
      medicalNotes: payload.medicalNotes || "",
      timezone: payload.timezone || "UTC",
    },
  });

  return res.status(201).json({
    message: "OTP sent. Verify the code to complete signup.",
    challenge: sanitizeOtpResponse(challenge),
  });
});

exports.verifySignupOtp = asyncHandler(async (req, res) => {
  const payload = await otpVerifySchema.validateAsync(req.body, { abortEarly: false });
  const challenge = await verifyOtpCode({
    purpose: "signup",
    contact: payload.contact,
    otp: payload.otp,
  });

  const existingUser = await User.findOne({ contact: challenge.contact });
  if (existingUser) {
    return res.status(409).json({ message: "An account already exists for this contact." });
  }

  const user = await User.create({
    fullName: challenge.metadata.fullName,
    contact: challenge.contact,
    passwordHash: challenge.metadata.passwordHash,
    emergencyContactName: challenge.metadata.emergencyContactName,
    emergencyContactPhone: challenge.metadata.emergencyContactPhone,
    medicalNotes: challenge.metadata.medicalNotes,
    timezone: challenge.metadata.timezone || "UTC",
    isContactVerified: true,
  });

  await OtpCode.deleteMany({ purpose: "signup", contact: challenge.contact });

  const token = issueToken(user);
  return res.status(201).json({
    message: "Signup completed successfully.",
    token,
    user: user.toSafeObject(),
  });
});

exports.requestLoginOtp = asyncHandler(async (req, res) => {
  const payload = await loginRequestSchema.validateAsync(req.body, { abortEarly: false });
  const user = await User.findOne({ contact: payload.contact.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "No account was found for this contact." });
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const challenge = await createOtpChallenge({
    purpose: "login",
    contact: user.contact,
    metadata: { userId: user._id.toString() },
  });

  return res.status(200).json({
    message: "OTP sent. Verify the code to finish logging in.",
    challenge: sanitizeOtpResponse(challenge),
  });
});

exports.verifyLoginOtp = asyncHandler(async (req, res) => {
  const payload = await otpVerifySchema.validateAsync(req.body, { abortEarly: false });
  const challenge = await verifyOtpCode({
    purpose: "login",
    contact: payload.contact,
    otp: payload.otp,
  });

  const user = await User.findById(challenge.metadata.userId);
  if (!user) {
    return res.status(404).json({ message: "Account no longer exists." });
  }

  user.lastLoginAt = new Date();
  await user.save();
  await OtpCode.deleteMany({ purpose: "login", contact: challenge.contact });

  const token = issueToken(user);
  return res.status(200).json({
    message: "Login successful.",
    token,
    user: user.toSafeObject(),
  });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user.toSafeObject() });
});
