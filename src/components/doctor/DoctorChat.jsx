import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../shared/Layout';

const DoctorChat = () => {
  const { chats, sendMessage, patients } = useApp();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [message, setMessage] = useState('');

  const userChats = chats.filter(c =>
    (c.sender === user?.id && c.receiver === selectedPatient?.id) ||
    (c.sender === selectedPatient?.id && c.receiver === user?.id)
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && selectedPatient) {
      sendMessage(user.id, selectedPatient.id, message);
      setMessage('');
    }
  };

  return (
    <Layout>
      <div className="chat-container">
        <div className="chat-header">
          <span>👤</span>
          <select value={selectedPatient?.id || ''} onChange={e => setSelectedPatient(patients.find(p => p.id === e.target.value))}>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="chat-messages">
          {userChats.map(chat => (
            <div key={chat.id} className={`chat-bubble ${chat.sender === user?.id ? 'sent' : 'received'}`}>
              <p>{chat.message}</p>
              <span className="chat-time">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="chat-input-area">
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
          <button type="submit">📤</button>
        </form>
      </div>
    </Layout>
  );
};

export default DoctorChat;