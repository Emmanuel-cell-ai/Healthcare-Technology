import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Alert from '../shared/Alert';

const MedicationTracker = () => {
  const { medications, logs } = useApp();
  const { user } = useAuth();
  const [alert, setAlert] = useState(null);

  const userMeds = medications.filter(m => m.patientId === user?.id);
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === today);

  useEffect(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    userMeds.forEach(med => {
      med.times.forEach(time => {
        if (time === currentTime) {
          setAlert(`⏰ Time to take ${med.name} - ${med.dosage}`);
          if (Notification.permission === 'granted') {
            new Notification('CareDiv Reminder', { body: `Take ${med.name} - ${med.dosage}` });
          }
        }
      });
    });
  }, []);

  const handleTake = (medId, time) => {
    setAlert(`✅ Taken! ${userMeds.find(m => m.id === medId)?.name} at ${time}`);
  };

  return (
    <div className="med-tracker">
      {alert && <Alert message={alert} onClose={() => setAlert(null)} type="success" />}
      
      {userMeds.length === 0 ? (
        <div className="empty-state">
          <span>💊</span>
          <p>No medications added yet</p>
        </div>
      ) : (
        <div className="med-list">
          {userMeds.map(med => (
            <div key={med.id} className="med-card">
              <div className="med-info">
                <h4>{med.name}</h4>
                <p>{med.dosage} • {med.frequency}</p>
                <p className="med-start">Started: {med.startDate}</p>
              </div>
              <div className="med-times">
                {med.times.map(time => {
                  const log = todayLogs.find(l => l.time === time && l.medication.includes(med.name));
                  const isTaken = log?.status === 'Taken';
                  return (
                    <button
                      key={time}
                      onClick={() => !isTaken && handleTake(med.id, time)}
                      className={`time-slot ${isTaken ? 'taken' : 'pending'}`}
                      disabled={isTaken}
                    >
                      {isTaken ? '✅' : '⏰'} {time}
                      <span>{isTaken ? 'Taken' : 'Take'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;