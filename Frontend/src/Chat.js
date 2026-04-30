import React, { useState } from 'react';

const Chat = ({ threads, activeUser }) => {
  const [activeThread, setActiveThread] = useState(threads[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="chat-shell">
      {/* Sidebar with Thread List */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar-head">
          <h3>Messages</h3>
        </div>
        <div className="chat-thread-list">
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={`chat-thread-item ${activeThread?.id === thread.id ? 'active' : ''}`}
              onClick={() => setActiveThread(thread)}
            >
              <strong>{thread.participantName}</strong>
              <p>{thread.lastMessage}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Container */}
      <main className="chat-container">
        <header className="chat-header">
          <div className="chat-participant">
            <div className="chat-avatar">{activeThread?.participantName[0]}</div>
            <div>
              <h3>{activeThread?.participantName}</h3>
              <p>{activeThread?.status || 'Online'}</p>
            </div>
          </div>
          {/* Uses the styled select element from styles.css */}
          <select className="recipient-select" value={activeThread?.id} onChange={(e) => {
            const thread = threads.find(t => t.id === e.target.value);
            if (thread) setActiveThread(thread);
          }}>
            <option value="">Start new conversation...</option>
            {threads.map(t => (
              <option key={t.id} value={t.id}>{t.participantName}</option>
            ))}
          </select>
          <div className={`status-dot ${activeThread?.online ? 'active' : ''}`}></div>
        </header>

        <div className="chat-messages">
          {activeThread?.messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-bubble ${msg.senderId === activeUser.id ? 'sent' : 'received'}`}
            >
              <p>{msg.text}</p>
              <span className="chat-time">{msg.time}</span>
            </div>
          ))}
          {!activeThread?.messages.length && (
            <div className="chat-empty">No messages yet. Start a conversation!</div>
          )}
        </div>

        <form className="chat-input-area" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={!message.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chat;