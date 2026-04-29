import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Layout from '../shared/Layout';

const PatientRecords = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [error, setError] = useState('');
  const { assignedPatients, patientRecords, fetchPatientRecords } = useApp();

  const handleSelectPatient = async (patientId) => {
    setSelectedPatientId(patientId);
    try {
      setError('');
      await fetchPatientRecords(patientId);
    } catch (recordError) {
      setError(recordError.message);
    }
  };

  return (
    <Layout>
      <div className="records-container">
        <div className="patient-list-panel">
          <h3>My Patients</h3>
          {assignedPatients.map((assignment) => {
            const patientId = assignment.patient?.id || assignment.patient?._id;
            return (
              <div
                key={patientId}
                className={`patient-item ${selectedPatientId === patientId ? 'active' : ''}`}
                onClick={() => handleSelectPatient(patientId)}
              >
                <div>
                  <h4>{assignment.patient?.fullName}</h4>
                  <p>{assignment.patient?.email}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="records-panel">
          {error && <div className="alert alert-error">{error}</div>}
          {patientRecords ? (
            <>
              <h3>{patientRecords.patient?.fullName} - Medical Records</h3>
              <div className="records-section">
                <h4>Medications</h4>
                {patientRecords.medications.map((medication) => (
                  <div key={medication._id} className="record-item">
                    <strong>{medication.name}</strong> - {medication.dosage} ({medication.scheduleTimes.join(', ')})
                  </div>
                ))}
              </div>
              <div className="records-section">
                <h4>Adherence Logs</h4>
                {patientRecords.doseLogs.slice(0, 10).map((log) => (
                  <div key={log._id} className="record-item">
                    {new Date(log.takenAt).toLocaleString()} - Taken
                  </div>
                ))}
                {patientRecords.alerts.slice(0, 10).map((alert) => (
                  <div key={alert._id} className={`record-item ${alert.status}`}>
                    {new Date(alert.scheduledFor).toLocaleString()} - {alert.status}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Select a patient to view records</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientRecords;
