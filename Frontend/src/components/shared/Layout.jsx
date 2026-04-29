import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Logo from './Logo';

const Layout = ({ children }) => {
  const { user, userType, logout } = useAuth();
  const { alerts = [], appointments = [] } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = React.useMemo(() => {
    if (userType === 'doctor') {
      const queuedAppointments = appointments
        .filter((appointment) => String(appointment.status).toLowerCase() === 'queued')
        .slice(0, 5)
        .map((appointment) => ({
          id: appointment.id || appointment._id,
          text: `${appointment.patient?.fullName || 'A patient'} requested an appointment.`,
        }));

      return queuedAppointments;
    }

    const pendingAlerts = alerts
      .filter((alert) => String(alert.status).toLowerCase() === 'pending')
      .slice(0, 5)
      .map((alert) => ({
        id: alert.id || alert._id,
        text: alert.message || `${alert.medication?.name || 'Medication'} is due soon.`,
      }));

    return pendingAlerts;
  }, [alerts, appointments, userType]);

  const notificationCount = notifications.length;

  return (
    <div className="layout">
      <header className="header">
        <div className="header-brand" onClick={() => navigate('/')}>
          <Logo size="small" />
        </div>
        {user && (
          <div className="header-actions">
            <div className="notification-wrap">
              <button
                type="button"
                className="btn-notification"
                onClick={() => setShowNotifications((current) => !current)}
                aria-label="Open notifications"
              >
                <span aria-hidden="true">🔔</span>
                {notificationCount > 0 ? <span className="notification-badge">{notificationCount}</span> : null}
              </button>
              {showNotifications ? (
                <div className="notification-panel">
                  <h4>Notifications</h4>
                  {notifications.length ? (
                    <ul>
                      {notifications.map((notification) => (
                        <li key={notification.id || notification.text}>{notification.text}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No new notifications right now.</p>
                  )}
                </div>
              ) : null}
            </div>
            <span className="user-badge">{userType === 'doctor' ? 'Doctor' : 'Patient'} {user.fullName}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        )}
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
