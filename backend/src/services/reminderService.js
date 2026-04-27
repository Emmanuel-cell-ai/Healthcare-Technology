const Medication = require("../models/Medication");
const MedicationAlert = require("../models/MedicationAlert");
const { buildScheduleDate, hasDatePassed, isWithinReminderWindow } = require("../utils/time");

let reminderTimer = null;

function formatReminderMessage(medication, scheduledFor) {
  return `Time to take ${medication.name} (${medication.dosage}) at ${scheduledFor.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}.`;
}

async function processMedicationSchedules() {
  const medications = await Medication.find({ isActive: true });
  const now = new Date();
  const repeatIntervalMs = Number(process.env.ALERT_REPEAT_INTERVAL_MS || 15 * 60 * 1000);

  for (const medication of medications) {
    if (hasDatePassed(medication.endDate, now) || medication.startDate > now) {
      continue;
    }

    for (const scheduleTime of medication.scheduleTimes) {
      const scheduledFor = buildScheduleDate(now, scheduleTime);
      const isDue = isWithinReminderWindow(now, scheduledFor, medication.adherenceWindowMinutes);

        if (!isDue) {
          if (scheduledFor < now) {
            await MedicationAlert.updateMany(
            {
              medication: medication._id,
              scheduledFor,
              status: "pending",
            },
            { $set: { status: "skipped" } },
          );
        }
        continue;
      }

      const message = formatReminderMessage(medication, scheduledFor);
      let alert = await MedicationAlert.findOne({
        medication: medication._id,
        scheduledFor,
      });
      let shouldNotify = false;

      if (!alert) {
        alert = await MedicationAlert.create({
          user: medication.user,
          medication: medication._id,
          scheduledFor,
          channels: medication.reminderChannels,
          message,
          lastNotifiedAt: now,
        });
        shouldNotify = true;
      } else if (
        alert.status === "pending" &&
        (!alert.lastNotifiedAt || now.getTime() - alert.lastNotifiedAt.getTime() >= repeatIntervalMs)
      ) {
        alert.lastNotifiedAt = now;
        alert.message = message;
        await alert.save();
        shouldNotify = true;
      }

      if (shouldNotify) {
        const deliveryMode = process.env.ALERT_DELIVERY_MODE || "console";
        console.log(`[ALERT:${deliveryMode}] ${message} User=${medication.user}`);
      }
    }
  }
}

function startReminderEngine() {
  if (reminderTimer) {
    return;
  }

  processMedicationSchedules().catch((error) => {
    console.error("Reminder job failed", error);
  });

  reminderTimer = setInterval(() => {
    processMedicationSchedules().catch((error) => {
      console.error("Reminder job failed", error);
    });
  }, Number(process.env.REMINDER_POLL_INTERVAL_MS || 60000));
}

module.exports = { startReminderEngine };
