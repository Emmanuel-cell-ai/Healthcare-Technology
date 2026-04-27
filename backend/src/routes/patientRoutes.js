const express = require("express");

const patientController = require("../controllers/patientController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("patient"));
router.get("/doctors", patientController.listDoctors);
router.post("/appointments", patientController.requestAppointment);
router.get("/appointments", patientController.listMyAppointments);
router.get("/records/me", patientController.getMyRecords);

module.exports = router;
