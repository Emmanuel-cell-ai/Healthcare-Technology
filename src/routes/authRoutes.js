const express = require("express");

const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.post(
  "/signup",
  upload.fields([
    { name: "doctorLicense", maxCount: 1 },
    { name: "medicalReports", maxCount: 5 },
  ]),
  authController.signup,
);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;
