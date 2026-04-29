import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../shared/Layout';

const DoctorDashboard = () => {
  const { doctorDashboard, assignedPatients, appointments, appError } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = doctorDashboard?.stats || {
    assignedPatientsCount: assignedPatients.length,
    queuedAppointments: appointments.filter((appointment) => appointment.status === 'queued').length,
    remainingCapacity: 0,
  };

  const availabilityStatus = user?.availabilityStatus || 'available';
  const todayDate = new Date().toISOString().slice(0, 10);
  const appointmentsToday = appointments.filter(
    (appointment) => String(appointment.scheduledFor || appointment.createdAt || '').slice(0, 10) === todayDate,
  ).length;
  const acceptedAppointments = appointments.filter((appointment) => appointment.status === 'accepted').length;
  const queuedAppointments = appointments.filter((appointment) => appointment.status === 'queued').length;
  const recentPatients = assignedPatients.slice(0, 3);

  return (
    <Layout>
      <div className="dashboard dashboard-shell">
        <section className="hero-panel doctor-hero">
          <div className="hero-copy">
            <span className="hero-kicker">Doctor dashboard</span>
            <h1>Welcome back, {user?.fullName}</h1>
            <p className="subtitle">A live view of your patient load, appointment pulse, and care availability without changing a single backend workflow.</p>
            <div className="hero-tags">
              <span className="hero-tag">Appointments today: {appointmentsToday}</span>
              <span className="hero-tag">Queued requests: {queuedAppointments}</span>
            </div>
          </div>

          <div className="hero-highlight availability-card">
            <span className="highlight-label">Availability</span>
            <div className={`status-orb ${availabilityStatus === 'available' ? 'available' : 'booked'}`} />
            <strong>{availabilityStatus === 'available' ? 'Open for appointments' : 'Capacity reached'}</strong>
            <p>{stats.remainingCapacity} open slot{stats.remainingCapacity === 1 ? '' : 's'} remaining in your current capacity.</p>
          </div>
        </section>

        {appError && <div className="alert alert-error">{appError}</div>}

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">Pt</span>
            <div>
              <h3>{stats.assignedPatientsCount}</h3>
              <p>Assigned Patients</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">Q</span>
            <div>
              <h3>{stats.queuedAppointments}</h3>
              <p>In Queue</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">+</span>
            <div>
              <h3>{stats.remainingCapacity}</h3>
              <p>Open Capacity</p>
            </div>
          </div>
        </div>

        <section className="insight-grid">
          <div className="insight-card momentum-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Clinic pulse</span>
                <h3>Your workflow snapshot</h3>
              </div>
            </div>
            <div className="pulse-metrics">
              <div className="pulse-tile">
                <strong>{acceptedAppointments}</strong>
                <span>accepted appointments</span>
              </div>
              <div className="pulse-tile">
                <strong>{appointmentsToday}</strong>
                <span>scheduled activity today</span>
              </div>
              <div className="pulse-tile">
                <strong>{queuedAppointments}</strong>
                <span>patients waiting in queue</span>
              </div>
            </div>
          </div>

          <div className="insight-card focus-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Care focus</span>
                <h3>Patients needing attention</h3>
              </div>
            </div>
            <ul className="focus-list">
              {recentPatients.length ? recentPatients.map((patient) => (
                <li key={patient.id || patient._id}>
                  {patient.fullName} {patient.medicalNotes ? `- ${patient.medicalNotes}` : '- review latest medication and notes.'}
                </li>
              )) : <li>No assigned patients yet. New care relationships will appear here.</li>}
            </ul>
          </div>
        </section>

        <section className="patient-overview-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Patient list</span>
              <h3>Your assigned patients</h3>
            </div>
            <button type="button" className="list-link-btn" onClick={() => navigate('/doctor/patients')}>
              Open full records
            </button>
          </div>
          {assignedPatients.length ? (
            <div className="patient-overview-list">
              {assignedPatients.map((patient) => (
                <button
                  type="button"
                  key={patient.id || patient._id}
                  className="patient-overview-item"
                  onClick={() => navigate('/doctor/patients')}
                >
                  <div>
                    <strong>{patient.fullName}</strong>
                    <p>{patient.email || patient.contact || 'No contact shared yet.'}</p>
                  </div>
                  <span>{patient.medicalNotes ? 'Has notes' : 'No notes'}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="patient-overview-empty">No assigned patients yet. New patient connections will appear here as soon as they are assigned.</p>
          )}
        </section>

        <div className="quick-actions doctor-actions">
          <button onClick={() => navigate('/doctor/patients')} className="action-card">
            <span>Records</span> Patient Records
          </button>
          <button onClick={() => navigate('/doctor/appointments')} className="action-card">
            <span>Queue</span> Appointments
          </button>
          <button onClick={() => navigate('/doctor/chat')} className="action-card">
            <span>Chat</span> Chat with Patients
          </button>
          <button onClick={() => navigate('/doctor/availability')} className="action-card">
            <span>Profile</span> License & Availability
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
