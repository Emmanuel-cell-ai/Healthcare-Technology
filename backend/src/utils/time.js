function buildScheduleDate(referenceDate, scheduleTime) {
  const [hours, minutes] = scheduleTime.split(":").map(Number);
  const scheduledDate = new Date(referenceDate);
  scheduledDate.setHours(hours, minutes, 0, 0);
  return scheduledDate;
}

function isWithinReminderWindow(now, scheduledFor, adherenceWindowMinutes) {
  const windowMillis = adherenceWindowMinutes * 60 * 1000;
  return now >= scheduledFor && now <= new Date(scheduledFor.getTime() + windowMillis);
}

function hasDatePassed(date, now = new Date()) {
  return Boolean(date) && new Date(date).setHours(23, 59, 59, 999) < now.getTime();
}

function getDueWindowBounds(takenAt, adherenceWindowMinutes) {
  const windowMillis = adherenceWindowMinutes * 60 * 1000;
  return {
    windowStart: new Date(takenAt.getTime() - windowMillis),
    windowEnd: new Date(takenAt.getTime() + windowMillis),
  };
}

module.exports = {
  buildScheduleDate,
  getDueWindowBounds,
  hasDatePassed,
  isWithinReminderWindow,
};
