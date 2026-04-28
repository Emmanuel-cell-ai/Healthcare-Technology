import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../shared/Layout';
import Input from '../shared/Input';
import Button from '../shared/Button';

const MedicationSetup = () => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [times, setTimes] = useState(['08:00']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const { addMedication } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    setTimes(freq === 'Once daily' ? ['08:00'] : freq === 'Twice daily' ? ['08:00', '20:00'] : ['08:00', '14:00', '20:00']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMedication({ name, dosage, frequency, times, startDate, patientId: user.id });
    navigate('/patient/dashboard');
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Add Your Medication</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Medication Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Ampiclox" icon="💊" />
          <Input label="Dosage" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g., 500mg" icon="⚖️" />
          
          <div className="input-group">
            <label className="input-label">Frequency</label>
            <div className="frequency-options">
              {['Once daily', 'Twice daily', 'Three times daily'].map(f => (
                <button key={f} type="button" className={`freq-btn ${frequency === f ? 'active' : ''}`} onClick={() => handleFrequencyChange(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

          <div className="times-display">
            <span>⏰ Reminder Times: </span>
            {times.map(t => <span key={t} className="time-badge">{t}</span>)}
          </div>

          <Button type="submit">Save & Continue</Button>
        </form>
      </div>
    </Layout>
  );
};

export default MedicationSetup;