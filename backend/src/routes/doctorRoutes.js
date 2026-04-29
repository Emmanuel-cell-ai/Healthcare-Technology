const express = require("express");

const doctorController = require("../controllers/doctorController");
const { requireAuth, requireRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.use(requireAuth, requireRole("doctor"));
router.get("/dashboard", doctorController.getDashboard);
router.get("/appointments", doctorController.listAppointments);
router.patch("/availability", doctorController.updateAvailability);
router.patch("/appointments/:appointmentId", doctorController.updateAppointmentStatus);
router.patch("/profile/license", upload.single("doctorLicense"), doctorController.uploadLicense);
router.get("/patients", doctorController.listPatients);
router.get("/patients/:patientId/records", doctorController.getPatientRecords);

module.exports = router;
