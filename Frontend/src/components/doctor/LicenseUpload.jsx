import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../shared/Button';
import Layout from '../shared/Layout';

const LicenseUpload = () => {
  const [file, setFile] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { uploadDoctorLicense, updateAvailability, isLoading } = useApp();
  const navigate = useNavigate();

  const currentStatus = availabilityStatus || user?.availabilityStatus || 'available';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      if (file) {
        const uploadResponse = await uploadDoctorLicense(file);
        setNotice(uploadResponse.message);
      }

      const availabilityResponse = await updateAvailability(currentStatus);
      setNotice((previous) => previous || availabilityResponse.message);
      navigate('/doctor/dashboard');
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Doctor Profile Setup</h2>
        {notice && <div className="alert alert-success">{notice}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="file-upload">
            <label>Medical License Document</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setFile(e.target.files[0])} />
            {file && <span className="file-name">{file.name}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Availability</label>
            <select className="input-field" value={currentStatus} onChange={(e) => setAvailabilityStatus(e.target.value)}>
              <option value="available">Available</option>
              <option value="fully_booked">Fully booked</option>
            </select>
          </div>

          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save & Continue'}</Button>
        </form>
      </div>
    </Layout>
  );
};

export default LicenseUpload;
