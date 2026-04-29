import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Layout from '../shared/Layout';

const presets = {
  'Once daily': ['08:00'],
  'Twice daily': ['08:00', '20:00'],
  'Three times daily': ['08:00', '14:00', '20:00'],
};

const MedicationSetup = () => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [times, setTimes] = useState(presets['Once daily']);
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const { createMedication, isLoading } = useApp();
  const navigate = useNavigate();

  const handleFrequencyChange = (nextFrequency) => {
    setFrequency(nextFrequency);
    setTimes(presets[nextFrequency]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await createMedication({
        name,
        dosage,
        instructions,
        scheduleTimes: times,
        startDate,
        reminderChannels: ['in_app'],
      });
      navigate('/patient/dashboard');
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Add Your Medication</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Medication Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Ampiclox" />
          <Input label="Dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 500mg" />

          <div className="input-group">
            <label className="input-label">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Optional instructions"
              className="input-field"
              rows="4"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Frequency</label>
            <div className="frequency-options">
              {Object.keys(presets).map((label) => (
                <button key={label} type="button" className={`freq-btn ${frequency === label ? 'active' : ''}`} onClick={() => handleFrequencyChange(label)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

          <div className="times-display">
            <span>Reminder Times: </span>
            {times.map((time) => <span key={time} className="time-badge">{time}</span>)}
          </div>

          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save & Continue'}</Button>
        </form>
      </div>
    </Layout>
  );
};

export default MedicationSetup;
