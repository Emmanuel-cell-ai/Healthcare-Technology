const express = require("express");

const doctorController = require("../controllers/doctorController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("doctor"));
router.get("/dashboard", doctorController.getDashboard);
router.patch("/availability", doctorController.updateAvailability);
router.patch("/appointments/:appointmentId", doctorController.updateAppointmentStatus);
router.get("/patients", doctorController.listPatients);
router.get("/patients/:patientId/records", doctorController.getPatientRecords);

module.exports = router;
