import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Alert from '../shared/Alert';

const MedicationTracker = () => {
  const { medications, alerts, takeAlertDose, logDose } = useApp();
  const [notice, setNotice] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const todayAlertsByMedication = useMemo(() => {
    const map = new Map();
    alerts
      .filter((alert) => String(alert.scheduledFor).slice(0, 10) === today)
      .forEach((alert) => {
        const medicationId = alert.medication?._id || alert.medication?.id || alert.medication;
        const existing = map.get(medicationId) || [];
        existing.push(alert);
        map.set(medicationId, existing);
      });
    return map;
  }, [alerts, today]);

  const handleTake = async (medicationId, alertId) => {
    try {
      if (alertId) {
        await takeAlertDose(alertId);
      } else {
        await logDose(medicationId);
      }
      setNotice('Dose logged successfully.');
    } catch (error) {
      setNotice(error.message);
    }
  };

  if (!medications.length) {
    return (
      <div className="empty-state">
        <span>Meds</span>
        <p>No medications added yet</p>
      </div>
    );
  }

  return (
    <div className="med-tracker">
      {notice && <Alert message={notice} onClose={() => setNotice('')} type="success" />}

      <div className="med-list">
        {medications.map((medication) => {
          const medicationId = medication.id || medication._id;
          const medicationAlerts = todayAlertsByMedication.get(medicationId) || [];

          return (
            <div key={medicationId} className="med-card">
              <div className="med-info">
                <h4>{medication.name}</h4>
                <p>{medication.dosage}</p>
                <p className="med-start">Started: {String(medication.startDate).slice(0, 10)}</p>
              </div>
              <div className="med-times">
                {medication.scheduleTimes.map((time) => {
                  const matchingAlert = medicationAlerts.find((alert) => {
                    const scheduled = new Date(alert.scheduledFor);
                    const alertTime = `${String(scheduled.getHours()).padStart(2, '0')}:${String(scheduled.getMinutes()).padStart(2, '0')}`;
                    return alertTime === time;
                  });

                  const status = matchingAlert?.status || 'pending';
                  const isDone = status === 'completed';
                  const isSkipped = status === 'skipped';

                  return (
                    <button
                      key={time}
                      onClick={() => !isDone && handleTake(medicationId, matchingAlert?.id || matchingAlert?._id)}
                      className={`time-slot ${isDone ? 'taken' : 'pending'}`}
                      disabled={isDone}
                    >
                      {time}
                      <span>{isDone ? 'Taken' : isSkipped ? 'Skipped' : 'Take'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicationTracker;
