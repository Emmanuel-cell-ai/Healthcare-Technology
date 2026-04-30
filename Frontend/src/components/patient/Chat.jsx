import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../shared/Layout';

function formatMessageTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const Chat = () => {
  const [searchParams] = useSearchParams();
  const doctorIdFromQuery = searchParams.get('doctor');
  const { appointments, conversations, activeConversation, fetchConversation, sendMessage } = useApp();
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorIdFromQuery || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const doctors = useMemo(() => {
    const byId = new Map();

    appointments.forEach((appointment) => {
      const doctor = appointment.doctor;
      if (doctor) {
        const id = doctor.id || doctor._id;
        byId.set(id, {
          id,
          fullName: doctor.fullName,
          specialization: doctor.specialization,
        });
      }
    });

    conversations.forEach((conversation) => {
      if (conversation.role === 'doctor') {
        byId.set(conversation.id, {
          id: conversation.id,
          fullName: conversation.fullName,
          specialization: '',
        });
      }
    });

    return Array.from(byId.values());
  }, [appointments, conversations]);

  const currentIndex = doctors.findIndex((d) => d.id === selectedDoctorId);

  const handlePreviousDoctor = () => {
    if (currentIndex > 0) {
      setSelectedDoctorId(doctors[currentIndex - 1].id);
    }
  };

  const handleNextDoctor = () => {
    if (currentIndex < doctors.length - 1) {
      setSelectedDoctorId(doctors[currentIndex + 1].id);
    }
  };

  useEffect(() => {
    if (!selectedDoctorId && doctors.length) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [doctors.length]);

  useEffect(() => {
    if (selectedDoctorId) {
      setIsLoading(true);
      setError('');
      fetchConversation(selectedDoctorId)
        .catch((fetchError) => setError(fetchError.message))
        .finally(() => setIsLoading(false));
    }
  }, [selectedDoctorId, fetchConversation]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!message.trim() || !selectedDoctorId) {
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await sendMessage(selectedDoctorId, message);
      setMessage('');
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const doctor = doctors.find((item) => item.id === selectedDoctorId);
  const messages = activeConversation?.messages || [];

  return (
    <Layout>
      <div className="chat-shell">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-head">
            <span className="section-kicker">Care Team</span>
            <h3>Doctors</h3>
          </div>
          <div className="chat-thread-list">
            {doctors.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chat-thread-item ${item.id === selectedDoctorId ? 'active' : ''}`}
                onClick={() => setSelectedDoctorId(item.id)}
              >
                <strong>{item.fullName}</strong>
                <p>{item.specialization || 'Assigned care team'}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-nav-prev">
              <button
                type="button"
                className="chat-nav-btn"
                onClick={handlePreviousDoctor}
                disabled={currentIndex <= 0}
                title="Previous doctor"
              >
                &lt;
              </button>
            </div>
            <div className="chat-participant">
              <div className="chat-avatar">{(doctor?.fullName || 'D').charAt(0).toUpperCase()}</div>
              <div>
                <h3>{doctor?.fullName || 'Doctor Chat'}</h3>
                <p>{doctor?.specialization || 'Assigned care team'}</p>
              </div>
            </div>
            <div className="chat-nav-next">
              <button
                type="button"
                className="chat-nav-btn"
                onClick={handleNextDoctor}
                disabled={currentIndex >= doctors.length - 1}
                title="Next doctor"
              >
                &gt;
              </button>
            </div>
            <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)}>
              {doctors.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="chat-messages">
            {isLoading && !messages.length && (
              <div className="chat-loading">Loading messages...</div>
            )}
            {!isLoading && !messages.length && (
              <div className="chat-empty">No messages yet. Start the conversation with your doctor.</div>
            )}
            {messages.map((chat) => (
              <div
                key={chat.id || chat._id}
                className={`chat-bubble ${(chat.sender?.id || chat.sender?._id) === selectedDoctorId ? 'received' : 'sent'}`}
              >
                <p>{chat.body}</p>
                <span className="chat-time">{formatMessageTime(chat.createdAt)}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a secure message..." />
            <button type="submit" disabled={!message.trim() || !selectedDoctorId}>Send</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
