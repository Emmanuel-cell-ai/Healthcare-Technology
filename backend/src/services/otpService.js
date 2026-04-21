const crypto = require("crypto");

const OtpCode = require("../models/OtpCode");

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function createOtpChallenge({ purpose, contact, metadata = {} }) {
  const otp = generateOtpCode();
  const normalizedContact = contact.toLowerCase();
  const expiresInMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  await OtpCode.deleteMany({ purpose, contact: normalizedContact });

  const challenge = await OtpCode.create({
    purpose,
    contact: normalizedContact,
    codeHash: hashOtp(otp),
    expiresAt,
    metadata,
  });

  const deliveryMode = process.env.OTP_DELIVERY_MODE || "console";
  console.log(`[OTP:${purpose}] Send code ${otp} to ${normalizedContact} via ${deliveryMode}`);

  return {
    ...challenge.toObject(),
    plainCode: otp,
  };
}

function sanitizeOtpResponse(challenge) {
  const response = {
    contact: challenge.contact,
    purpose: challenge.purpose,
    expiresAt: challenge.expiresAt,
    deliveryMode: process.env.OTP_DELIVERY_MODE || "console",
  };

  if ((process.env.NODE_ENV || "development") !== "production") {
    response.debugOtp = challenge.plainCode;
  }

  return response;
}

async function verifyOtpCode({ purpose, contact, otp }) {
  const challenge = await OtpCode.findOne({
    purpose,
    contact: contact.toLowerCase(),
  }).sort({ createdAt: -1 });

  if (!challenge) {
    const error = new Error("OTP challenge not found.");
    error.statusCode = 404;
    throw error;
  }

  if (challenge.expiresAt.getTime() < Date.now()) {
    const error = new Error("OTP has expired.");
    error.statusCode = 410;
    throw error;
  }

  if (challenge.attempts >= Number(process.env.OTP_MAX_ATTEMPTS || 5)) {
    const error = new Error("Maximum OTP attempts exceeded.");
    error.statusCode = 429;
    throw error;
  }

  const matches = challenge.codeHash === hashOtp(otp);
  if (!matches) {
    challenge.attempts += 1;
    await challenge.save();
    const error = new Error("OTP is invalid.");
    error.statusCode = 401;
    throw error;
  }

  return challenge;
}

module.exports = {
  createOtpChallenge,
  sanitizeOtpResponse,
  verifyOtpCode,
};
