import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../shared/Layout';
import MedicationTracker from './MedicationTracker';
import MedicationLogs from './MedicationLogs';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const { logs, medications } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const todayMeds = medications.filter(m => m.patientId === user?.id);
  const todayLogs = logs.filter(l => l.date === new Date().toISOString().split('T')[0]);
  const adherenceRate = todayLogs.length > 0 
    ? Math.round((todayLogs.filter(l => l.status === 'Taken').length / todayLogs.length) * 100) 
    : 0;

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Your Healing Starts Here</h1>
          <p className="subtitle">Stay on top of your medication</p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">💊</span>
            <div>
              <h3>{todayMeds.length}</h3>
              <p>Active Medications</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <h3>{adherenceRate}%</h3>
              <p>Today's Adherence</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div>
              <h3>{todayLogs.filter(l => l.status === 'Skipped').length}</h3>
              <p>Skipped Today</p>
            </div>
          </div>
        </div>

        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>📅 Today's Meds</button>
          <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>📊 Logs</button>
        </div>

        {activeTab === 'today' && <MedicationTracker />}
        {activeTab === 'logs' && <MedicationLogs />}

        <div className="quick-actions">
          <button onClick={() => navigate('/patient/doctors')} className="action-card">
            <span>🩺</span> Book Appointment
          </button>
          <button onClick={() => navigate('/patient/chat')} className="action-card">
            <span>💬</span> Chat with Doctor
          </button>
          <button onClick={() => navigate('/patient/medication-setup')} className="action-card">
            <span>➕</span> Add Medication
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;