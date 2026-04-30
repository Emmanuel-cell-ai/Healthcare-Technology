import React from 'react';

/**
 * Dashboard component implemented based on the styles defined in styles.css.
 * This component supports both Patient and Doctor views via the user.role property.
 */
const Dashboard = ({ user, metrics, medications }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-shell">
        {/* Hero Section */}
        <section className={`hero-panel ${user.role}-hero`}>
          <div className="hero-copy">
            <span className="hero-kicker">Status Overview</span>
            <h1>Welcome back, {user.name}</h1>
            <p className="subtitle">Your health journey is looking great today. You have {user.pendingTasks} tasks to complete.</p>
            <div className="hero-tags">
              {user.tags?.map((tag, index) => (
                <span key={index} className="hero-tag">{tag}</span>
              ))}
            </div>
          </div>
          
          <div className="hero-highlight">
            <span className="highlight-label">Active Streak</span>
            <div className="streak-count">{user.streak} <span>Days</span></div>
            <div className="streak-track">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`streak-dot ${i < user.streak ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Insights Grid */}
        <div className="insight-grid">
          {user.role === 'patient' ? (
            <>
              {/* Metrics Card */}
              <div className="insight-card">
                <div className="section-heading">
                  <span className="section-kicker">Real-time</span>
                  <h3>Pulse Metrics</h3>
                </div>
                <div className="pulse-metrics">
                  {metrics?.map((metric, index) => (
                    <div className="pulse-tile" key={index}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Areas Card */}
              <div className="insight-card">
                <div className="section-heading">
                  <h3>Focus Areas</h3>
                </div>
                <ul className="focus-list">
                  {medications?.filter(m => m.slots.some(s => s.status === 'pending')).slice(0, 2).map((med, i) => (
                    <li key={i}>💊 {med.name} - {med.dosage}</li>
                  ))}
                  <li>💧 Update hydration log</li>
                  <li>📝 Review latest doctor notes</li>
                </ul>
              </div>
            </>
          ) : (
            /* Doctor's View: Patient Overview */
            <div className="insight-card" style={{ gridColumn: 'span 2' }}>
              <div className="section-heading">
                <h3>Active Patient Consultations</h3>
                <button className="list-link-btn">View All</button>
              </div>
              <div className="patient-overview-list">
                {user.recentPatients?.map((patient) => (
                  <div key={patient.id} className="patient-overview-item">
                    <div>
                      <strong>{patient.name}</strong>
                      <p>Last seen: {patient.lastVisit}</p>
                    </div>
                    <span>{patient.status}</span>
                  </div>
                ))}
                {!user.recentPatients?.length && (
                  <p className="patient-overview-empty">No active patients assigned for today.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;