import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../shared/Layout';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor') || 'd1';
  const { chats, sendMessage, doctors } = useApp();
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const doctor = doctors.find(d => d.id === doctorId);
  const userChats = chats.filter(c => 
    (c.sender === user?.id && c.receiver === doctorId) || 
    (c.sender === doctorId && c.receiver === user?.id)
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(user.id, doctorId, message);
      setMessage('');
    }
  };

  return (
    <Layout>
      <div className="chat-container">
        <div className="chat-header">
          <span>{doctor?.avatar}</span>
          <h3>{doctor?.name}</h3>
          <span className="status-dot active"></span>
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

export default Chat;