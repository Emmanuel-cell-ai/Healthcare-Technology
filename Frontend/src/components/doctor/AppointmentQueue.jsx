import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../shared/Layout';

const AppointmentQueue = () => {
  const [error, setError] = useState('');
  const { appointments, updateAppointmentStatus, isLoading, appError } = useApp();

  const sortedAppointments = [...appointments].sort((left, right) => left.queueNumber - right.queueNumber);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      setError('');
      await updateAppointmentStatus(appointmentId, status);
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Appointment Queue (FIFO)</h2>
        {(error || appError) && <div className="alert alert-error">{error || appError}</div>}
        {!sortedAppointments.length ? (
          <div className="empty-state"><p>No appointments in queue</p></div>
        ) : (
          <div className="queue-list">
            {sortedAppointments.map((appointment, index) => {
              const appointmentId = appointment.id || appointment._id;
              return (
                <div key={appointmentId} className={`queue-item ${index === 0 ? 'next' : ''}`}>
                  <div className="queue-position">#{appointment.queueNumber}</div>
                  <div className="queue-info">
                    <h4>{appointment.patient?.fullName}</h4>
                    <p>{appointment.notes || 'No notes provided'}</p>
                    <span className="queue-time">{new Date(appointment.assignedAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
                    <div className="frequency-options">
                      <button type="button" className="freq-btn" disabled={isLoading} onClick={() => handleStatusChange(appointmentId, 'accepted')}>Accept</button>
                      <button type="button" className="freq-btn" disabled={isLoading} onClick={() => handleStatusChange(appointmentId, 'completed')}>Complete</button>
                      <button type="button" className="freq-btn" disabled={isLoading} onClick={() => handleStatusChange(appointmentId, 'cancelled')}>Cancel</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentQueue;
