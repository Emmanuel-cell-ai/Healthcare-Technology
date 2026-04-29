import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import MedicationLogs from './MedicationLogs';
import MedicationTracker from './MedicationTracker';
import Layout from '../shared/Layout';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const { medications, alerts, logs, isLoading, appError } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const todayAlerts = useMemo(
    () => alerts.filter((alert) => String(alert.scheduledFor).slice(0, 10) === today),
    [alerts, today],
  );

  const adherenceRate = todayAlerts.length
    ? Math.round((todayAlerts.filter((alert) => alert.status === 'completed').length / todayAlerts.length) * 100)
    : 0;

  const skippedToday = todayAlerts.filter((alert) => alert.status === 'skipped').length;
  const completedToday = todayAlerts.filter((alert) => alert.status === 'completed').length;
  const pendingToday = todayAlerts.filter((alert) => alert.status === 'pending').length;
  const activeMedications = medications.filter((medication) => medication.isActive !== false);

  const weeklyProgress = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        label: date.toLocaleDateString([], { weekday: 'short' }),
      };
    });

    return days.map((day) => {
      const dayLogs = logs.filter((log) => String(log.takenAt).slice(0, 10) === day.key);
      const taken = dayLogs.filter((log) => String(log.status).toLowerCase() === 'taken').length;
      const skipped = dayLogs.filter((log) => String(log.status).toLowerCase() === 'skipped').length;
      const total = dayLogs.length;
      const completion = total ? Math.round((taken / total) * 100) : 0;

      return {
        ...day,
        taken,
        skipped,
        total,
        completion,
      };
    });
  }, [logs]);

  const streak = useMemo(() => {
    const byDay = new Map(
      weeklyProgress.map((day) => [
        day.key,
        {
          taken: day.taken,
          skipped: day.skipped,
          total: day.total,
        },
      ]),
    );

    if (todayAlerts.length) {
      byDay.set(today, {
        taken: completedToday,
        skipped: skippedToday,
        total: todayAlerts.length,
      });
    }

    let totalStreak = 0;
    const cursor = new Date(today);

    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      const day = byDay.get(key);

      if (!day || day.total === 0 || day.skipped > 0 || day.taken === 0) {
        break;
      }

      totalStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return totalStreak;
  }, [completedToday, skippedToday, today, todayAlerts.length, weeklyProgress]);

  const nextDose = useMemo(() => {
    const upcoming = todayAlerts
      .filter((alert) => alert.status === 'pending')
      .sort((left, right) => new Date(left.scheduledFor) - new Date(right.scheduledFor))[0];

    if (!upcoming) {
      return 'All set for today';
    }

    return new Date(upcoming.scheduledFor).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [todayAlerts]);

  const motivationMessage = streak >= 5
    ? 'Strong momentum. Your routine is becoming a habit.'
    : streak >= 1
      ? 'Keep the streak going. One timely dose keeps the rhythm alive.'
      : 'Start a fresh streak today with your next medication check-in.';

  return (
    <Layout>
      <div className="dashboard dashboard-shell">
        <section className="hero-panel patient-hero">
          <div className="hero-copy">
            <span className="hero-kicker">Patient dashboard</span>
            <h1>{user?.fullName ? `${user.fullName}, keep your care journey moving` : 'Your healing starts here'}</h1>
            <p className="subtitle">A brighter view of your day, your medication plan, and the progress you are building one dose at a time.</p>
            <div className="hero-tags">
              <span className="hero-tag">Next dose: {nextDose}</span>
              <span className="hero-tag">Pending today: {pendingToday}</span>
            </div>
          </div>

          <div className="hero-highlight streak-card">
            <span className="highlight-label">Consistency streak</span>
            <div className="streak-count">{streak}<span>day{streak === 1 ? '' : 's'}</span></div>
            <p>{motivationMessage}</p>
            <div className="streak-track" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <span key={index} className={`streak-dot ${index < Math.min(streak, 7) ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        </section>

        {appError && <div className="alert alert-error">{appError}</div>}

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">Rx</span>
            <div>
              <h3>{activeMedications.length}</h3>
              <p>Active Medications</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">%</span>
            <div>
              <h3>{adherenceRate}%</h3>
              <p>Today&apos;s Adherence</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">OK</span>
            <div>
              <h3>{completedToday}</h3>
              <p>Doses Completed</p>
            </div>
          </div>
        </div>

        <section className="insight-grid">
          <div className="insight-card momentum-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Weekly momentum</span>
                <h3>How this week is going</h3>
              </div>
              <strong>{weeklyProgress.reduce((sum, day) => sum + day.taken, 0)} doses taken</strong>
            </div>
            <div className="week-bars">
              {weeklyProgress.map((day) => (
                <div key={day.key} className="week-bar-card">
                  <span>{day.label}</span>
                  <div className="week-bar-track">
                    <div className="week-bar-fill" style={{ height: `${Math.max(day.completion, 10)}%` }} />
                  </div>
                  <small>{day.total ? `${day.completion}%` : 'Rest'}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card focus-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Today&apos;s focus</span>
                <h3>Keep your rhythm steady</h3>
              </div>
            </div>
            <ul className="focus-list">
              <li>{pendingToday} doses are still waiting for check-in.</li>
              <li>{skippedToday} doses were skipped today.</li>
              <li>{activeMedications.length ? `${activeMedications[0].name} is part of today’s routine.` : 'Add a medication plan to start tracking.'}</li>
            </ul>
          </div>
        </section>

        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>
            Today&apos;s Meds
          </button>
          <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
            Logs
          </button>
        </div>

        {isLoading ? <div className="empty-state"><p>Loading your care plan...</p></div> : null}
        {!isLoading && activeTab === 'today' ? <MedicationTracker /> : null}
        {!isLoading && activeTab === 'logs' ? <MedicationLogs logs={logs} /> : null}

        <div className="quick-actions patient-actions">
          <button onClick={() => navigate('/patient/doctors')} className="action-card">
            <span>Book</span> Book Appointment
          </button>
          <button onClick={() => navigate('/patient/chat')} className="action-card">
            <span>Chat</span> Chat with Doctor
          </button>
          <button onClick={() => navigate('/patient/medication-setup')} className="action-card">
            <span>Add</span> Add Medication
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
