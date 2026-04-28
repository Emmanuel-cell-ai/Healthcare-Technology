import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../shared/Layout';

const DoctorDashboard = () => {
  const { doctors, patients, appointmentQueue } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const doctor = doctors.find(d => d.id === user?.id) || doctors[0];
  const assignedPatients = patients.filter(p => p.doctorId === doctor.id);
  const waitingAppointments = appointmentQueue.filter(a => a.status === 'waiting');

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome, {doctor?.name}</h1>
          <span className={`status-pill ${doctor?.available ? 'available' : 'booked'}`}>
            {doctor?.available ? '🟢 Available' : '🔴 Fully Booked'}
          </span>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <h3>{assignedPatients.length}</h3>
              <p>Assigned Patients</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div>
              <h3>{waitingAppointments.length}</h3>
              <p>In Queue</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <button onClick={() => navigate('/doctor/patients')} className="action-card">
            <span>📂</span> Patient Records
          </button>
          <button onClick={() => navigate('/doctor/appointments')} className="action-card">
            <span>📅</span> Appointments (FIFO)
          </button>
          <button onClick={() => navigate('/doctor/chat')} className="action-card">
            <span>💬</span> Chat with Patients
          </button>
          <button onClick={() => navigate('/doctor/availability')} className="action-card">
            <span>🔄</span> Toggle Availability
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;