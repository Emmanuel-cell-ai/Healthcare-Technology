import React, { useEffect, useState } from 'react';
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

const DoctorChat = () => {
  const { assignedPatients, activeConversation, fetchConversation, sendMessage } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const patientList = assignedPatients
    .map((assignment) => assignment.patient || assignment)
    .filter(Boolean)
    .map((patient) => ({
      id: patient.id || patient._id,
      fullName: patient.fullName || 'Patient',
      email: patient.email || '',
    }))
    .filter((patient) => patient.id);

  useEffect(() => {
    if (!selectedPatientId && patientList.length) {
      const patientId = patientList[0].id;
      setSelectedPatientId(patientId);
      return;
    }

    if (selectedPatientId) {
      fetchConversation(selectedPatientId).catch((fetchError) => setError(fetchError.message));
    }
  }, [patientList, selectedPatientId]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!message.trim() || !selectedPatientId) {
      return;
    }

    try {
      setError('');
      await sendMessage(selectedPatientId, message);
      setMessage('');
    } catch (sendError) {
      setError(sendError.message);
    }
  };
  const selectedPatient = patientList.find((patient) => patient.id === selectedPatientId);
  const messages = activeConversation?.messages || [];

  return (
    <Layout>
      <div className="chat-shell">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-head">
            <span className="section-kicker">Assigned patients</span>
            <h3>Messages</h3>
          </div>
          <div className="chat-thread-list">
            {patientList.map((patient) => (
              <button
                key={patient.id}
                type="button"
                className={`chat-thread-item ${patient.id === selectedPatientId ? 'active' : ''}`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <strong>{patient.fullName}</strong>
                <p>{patient.email || 'Secure patient channel'}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-participant">
              <div className="chat-avatar">{(selectedPatient?.fullName || 'P').charAt(0).toUpperCase()}</div>
              <div>
                <h3>{selectedPatient?.fullName || 'Patient chat'}</h3>
                <p>{selectedPatient?.email || 'Secure patient channel'}</p>
              </div>
            </div>
            <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)}>
              {patientList.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.fullName}</option>
              ))}
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          <div className="chat-messages">
            {!messages.length ? <div className="chat-empty">No messages yet. Start by checking in with your patient.</div> : null}
            {messages.map((chat) => (
              <div
                key={chat.id || chat._id}
                className={`chat-bubble ${(chat.receiver?.id || chat.receiver?._id) === selectedPatientId ? 'sent' : 'received'}`}
              >
                <p>{chat.body}</p>
                <span className="chat-time">{formatMessageTime(chat.createdAt)}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="chat-input-area">
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a patient update..." />
            <button type="submit" disabled={!message.trim() || !selectedPatientId}>Send</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorChat;
