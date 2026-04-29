import React from 'react';
import { useApp } from '../../context/AppContext';

const MedicationLogs = ({ logs: propLogs }) => {
  const { logs: contextLogs } = useApp();
  const logs = propLogs || contextLogs;

  const groupedLogs = logs.reduce((accumulator, log) => {
    const date = String(log.takenAt).slice(0, 10);
    if (!accumulator[date]) {
      accumulator[date] = [];
    }
    accumulator[date].push(log);
    return accumulator;
  }, {});

  const dates = Object.keys(groupedLogs).sort((left, right) => new Date(right) - new Date(left));

  if (!dates.length) {
    return (
      <div className="empty-state">
        <p>No medication logs yet.</p>
      </div>
    );
  }

  return (
    <div className="logs-container">
      {dates.map((date) => (
        <div key={date} className="log-day">
          <h4 className="log-date">{date}</h4>
          <div className="log-entries">
            {groupedLogs[date].map((log) => (
              <div key={log.id} className={`log-entry ${log.status.toLowerCase()}`}>
                <span className="log-time">{new Date(log.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="log-med">{log.medicationName}</span>
                <span className="log-status">{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicationLogs;
