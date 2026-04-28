const express = require("express");

const medicationController = require("../controllers/medicationController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.post("/", medicationController.createMedication);
router.get("/", medicationController.listMedications);
router.patch("/:medicationId", medicationController.updateMedication);
router.post("/:medicationId/log-dose", medicationController.logDose);
router.get("/:medicationId/timeline", medicationController.getMedicationTimeline);

module.exports = router;
