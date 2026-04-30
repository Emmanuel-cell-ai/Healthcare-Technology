import React, { useState } from 'react';

/**
 * Records component implements the Master-Detail view for patient history.
 * Styles are derived from .records-container in styles.css.
 */
const Records = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);

  return (
    <div className="records-container">
      {/* Sidebar: Patient List */}
      <aside className="patient-list-panel">
        <h3>Patient Directory</h3>
        <div className="patient-list">
          {patients.map((patient) => (
            <div 
              key={patient.id} 
              className={`patient-item ${selectedPatient?.id === patient.id ? 'active' : ''}`}
              onClick={() => setSelectedPatient(patient)}
            >
              <div>
                <h4>{patient.name}</h4>
                <p>ID: {patient.patientId} • {patient.age}y/o</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Panel: Patient History & Records */}
      <main className="records-panel">
        {selectedPatient ? (
          <>
            <div className="section-heading">
              <h3>Clinical Records: {selectedPatient.name}</h3>
              <span className="user-badge">{selectedPatient.bloodType || 'A+'}</span>
            </div>
            
            <section className="records-section">
              <h4>Medication History</h4>
              {selectedPatient.history?.map((record, index) => (
                <div key={index} className={`record-item ${record.status}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{record.medication}</strong>
                    <span>{record.date}</span>
                  </div>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>Status: {record.status.toUpperCase()}</p>
                </div>
              ))}
            </section>

            <section className="records-section">
              <h4>Provider Notes</h4>
              <p className="subtitle">{selectedPatient.notes || "No recent clinical notes available."}</p>
            </section>
          </>
        ) : (
          <div className="empty-state">Select a patient to view records</div>
        )}
      </main>
    </div>
  );
};

export default Records;