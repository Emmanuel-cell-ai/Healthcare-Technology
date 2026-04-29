const express = require("express");

const patientController = require("../controllers/patientController");
const { requireAuth, requireRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.use(requireAuth, requireRole("patient"));
router.get("/doctors", patientController.listDoctors);
router.post("/appointments", patientController.requestAppointment);
router.get("/appointments", patientController.listMyAppointments);
router.get("/records/me", patientController.getMyRecords);
router.post("/reports", upload.array("medicalReports", 5), patientController.uploadMedicalReports);

module.exports = router;
