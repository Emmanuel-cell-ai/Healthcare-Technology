const express = require("express");

const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/signup/request-otp", authController.requestSignupOtp);
router.post("/signup/verify-otp", authController.verifySignupOtp);
router.post("/login/request-otp", authController.requestLoginOtp);
router.post("/login/verify-otp", authController.verifyLoginOtp);
router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;
