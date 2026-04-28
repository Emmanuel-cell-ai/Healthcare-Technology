import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../shared/Layout';

const PatientRecords = () => {
  const { patients, logs, medications } = useApp();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const assignedPatients = patients.filter(p => p.doctorId === user?.id);
  const patientLogs = selectedPatient ? logs.filter(l => l.patientId === selectedPatient.id) : [];
  const patientMeds = selectedPatient ? medications.filter(m => m.patientId === selectedPatient.id) : [];

  return (
    <Layout>
      <div className="records-container">
        <div className="patient-list-panel">
          <h3>My Patients</h3>
          {assignedPatients.map(p => (
            <div key={p.id} className={`patient-item ${selectedPatient?.id === p.id ? 'active' : ''}`} onClick={() => setSelectedPatient(p)}>
              <span>👤</span>
              <div>
                <h4>{p.name}</h4>
                <p>{p.email}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="records-panel">
          {selectedPatient ? (
            <>
              <h3>{selectedPatient.name} - Medical Records</h3>
              <div className="records-section">
                <h4>💊 Medications</h4>
                {patientMeds.map(m => (
                  <div key={m.id} className="record-item">
                    <strong>{m.name}</strong> - {m.dosage} ({m.frequency})
                  </div>
                ))}
              </div>
              <div className="records-section">
                <h4>📊 Adherence Logs</h4>
                {patientLogs.slice(-10).map((l, i) => (
                  <div key={i} className={`record-item ${l.status.toLowerCase()}`}>
                    {l.date} {l.time} - {l.medication} - {l.status}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span>👈</span>
              <p>Select a patient to view records</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientRecords;