import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Layout from '../shared/Layout';

const DoctorList = () => {
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');
  const { doctors, requestAppointment, isLoading, appError } = useApp();
  const navigate = useNavigate();

  const handleBook = async (doctorId) => {
    setBookingId(doctorId);
    setError('');

    try {
      await requestAppointment(doctorId);
      navigate(`/patient/chat?doctor=${doctorId}`);
    } catch (bookingError) {
      setError(bookingError.message);
    } finally {
      setBookingId('');
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Choose Your Doctor</h2>
        {(error || appError) && <div className="alert alert-error">{error || appError}</div>}
        <div className="doctor-list">
          {doctors.map((doctor) => {
            const doctorId = doctor.id || doctor._id;
            const available = doctor.availabilityStatus === 'available';

            return (
              <div key={doctorId} className={`doctor-card ${!available ? 'fully-booked' : ''}`}>
                <div className="doctor-info">
                  <h4>{doctor.fullName}</h4>
                  <p>{doctor.specialization || 'General care'}</p>
                  <span className={`status-badge ${available ? 'available' : 'booked'}`}>
                    {available ? 'Available' : 'Fully Booked'}
                  </span>
                </div>
                <button
                  disabled={!available || isLoading || bookingId === doctorId}
                  onClick={() => handleBook(doctorId)}
                  className="btn btn-primary btn-sm"
                >
                  {bookingId === doctorId ? 'Booking...' : available ? 'Book' : 'Full'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorList;
