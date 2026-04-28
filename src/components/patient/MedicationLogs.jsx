import React from 'react';
import { useApp } from '../../context/AppContext';

const MedicationLogs = () => {
  const { logs } = useApp();

  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  return (
    <div className="logs-container">
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date} className="log-day">
          <h4 className="log-date">{date}</h4>
          <div className="log-entries">
            {dateLogs.map((log, i) => (
              <div key={i} className={`log-entry ${log.status.toLowerCase()}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-med">{log.medication}</span>
                <span className="log-status">{log.status === 'Taken' ? '✅' : '❌'} {log.status}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicationLogs;