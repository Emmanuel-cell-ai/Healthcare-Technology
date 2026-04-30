const express = require("express");

const chatController = require("../controllers/chatController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/conversations", chatController.listConversations);
router.get("/:userId/messages", chatController.getConversation);
router.post("/:userId/messages", chatController.sendMessage);

module.exports = router;
