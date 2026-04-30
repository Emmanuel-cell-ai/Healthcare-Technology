const Joi = require("joi");

const ChatMessage = require("../models/ChatMessage");
const DoctorPatientAssignment = require("../models/DoctorPatientAssignment");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const messageSchema = Joi.object({
  body: Joi.string().trim().min(1).max(2000).required(),
});

async function ensureMessagingAccess(currentUser, otherUserId) {
  const otherUser = await User.findById(otherUserId);
  if (!otherUser) {
    return { error: { status: 404, message: "Recipient not found." } };
  }

  if (currentUser.role === otherUser.role) {
    return { error: { status: 403, message: "Chat is only allowed between doctors and patients." } };
  }

  const doctorId = currentUser.role === "doctor" ? currentUser._id : otherUser._id;
  const patientId = currentUser.role === "patient" ? currentUser._id : otherUser._id;

  const assignment = await DoctorPatientAssignment.findOne({
    doctor: doctorId,
    patient: patientId,
    status: "active",
  });

  if (!assignment) {
    return { error: { status: 403, message: "You can only chat with assigned care partners." } };
  }

  return { otherUser };
}

exports.listConversations = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "fullName role")
    .populate("receiver", "fullName role");

  const conversationMap = new Map();
  for (const message of messages) {
    const otherUser = String(message.sender._id) === String(req.user._id) ? message.receiver : message.sender;
    if (!conversationMap.has(String(otherUser._id))) {
      conversationMap.set(String(otherUser._id), {
        participant: otherUser,
        lastMessage: message,
      });
    }
  }

  return res.status(200).json({
    conversations: Array.from(conversationMap.values()),
  });
});

exports.getConversation = asyncHandler(async (req, res) => {
  const access = await ensureMessagingAccess(req.user, req.params.userId);
  if (access.error) {
    return res.status(access.error.status).json({ message: access.error.message });
  }

  const messages = await ChatMessage.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "fullName role")
    .populate("receiver", "fullName role");

  return res.status(200).json({
    participant: access.otherUser.toSafeObject(),
    messages,
  });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const payload = await messageSchema.validateAsync(req.body, { abortEarly: false });
  const access = await ensureMessagingAccess(req.user, req.params.userId);
  if (access.error) {
    return res.status(access.error.status).json({ message: access.error.message });
  }

  const message = await ChatMessage.create({
    sender: req.user._id,
    receiver: req.params.userId,
    body: payload.body,
  });

  const populatedMessage = await ChatMessage.findById(message._id)
    .populate("sender", "fullName role")
    .populate("receiver", "fullName role");

  return res.status(201).json({
    message: "Message sent successfully.",
    chatMessage: populatedMessage,
  });
});
