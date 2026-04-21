const express = require("express");

const alertController = require("../controllers/alertController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/", alertController.listAlerts);
router.patch("/:alertId/acknowledge", alertController.acknowledgeAlert);

module.exports = router;
