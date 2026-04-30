import React from 'react';

const MedicationTracker = ({ medications, onMarkTaken }) => {
  return (
    <div className="med-tracker">
      <div className="section-heading">
        <h3>Medication Schedule</h3>
        <span className="section-kicker">Today</span>
      </div>
      
      <div className="med-list">
        {medications.map((med) => (
          <div key={med.id} className="med-card">
            <div className="med-info">
              <h4>{med.name}</h4>
              <p>{med.dosage} • {med.frequency}</p>
              <div className="med-start">Started: {med.startDate}</div>
            </div>
            
            <div className="med-times">
              {med.slots.map((slot, idx) => (
                <button
                  key={idx}
                  disabled={slot.status === 'taken'}
                  className={`time-slot ${slot.status}`}
                  onClick={() => onMarkTaken(med.id, slot.time)}
                >
                  {slot.time}
                  <span>{slot.status}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {medications.length === 0 && (
          <div className="empty-state">
            <span>💊</span>
            <p>No medications scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;