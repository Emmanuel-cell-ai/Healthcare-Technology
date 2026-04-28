import React from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../shared/Layout';

const AppointmentQueue = () => {
  const { appointmentQueue } = useApp();

  return (
    <Layout>
      <div className="form-container">
        <h2>Appointment Queue (FIFO)</h2>
        {appointmentQueue.length === 0 ? (
          <div className="empty-state"><span>📭</span><p>No appointments in queue</p></div>
        ) : (
          <div className="queue-list">
            {appointmentQueue.map((apt, index) => (
              <div key={apt.id} className={`queue-item ${index === 0 ? 'next' : ''}`}>
                <div className="queue-position">#{index + 1}</div>
                <div className="queue-info">
                  <h4>{apt.patientName}</h4>
                  <p>Symptoms: {apt.symptoms}</p>
                  <span className="queue-time">{apt.timestamp}</span>
                </div>
                <span className={`status-badge ${apt.status}`}>{apt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentQueue;