import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../shared/Layout';

const DoctorList = () => {
  const { doctors } = useApp();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="form-container">
        <h2>Choose Your Doctor</h2>
        <div className="doctor-list">
          {doctors.map(doc => (
            <div key={doc.id} className={`doctor-card ${!doc.available ? 'fully-booked' : ''}`}>
              <span className="doctor-avatar">{doc.avatar}</span>
              <div className="doctor-info">
                <h4>{doc.name}</h4>
                <p>{doc.specialty}</p>
                <span className={`status-badge ${doc.available ? 'available' : 'booked'}`}>
                  {doc.available ? '🟢 Available' : '🔴 Fully Booked'}
                </span>
              </div>
              <button 
                disabled={!doc.available} 
                onClick={() => navigate(`/patient/chat?doctor=${doc.id}`)}
                className="btn btn-primary btn-sm"
              >
                {doc.available ? 'Book' : 'Full'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorList;