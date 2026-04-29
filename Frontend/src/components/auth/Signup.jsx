import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Logo from '../shared/Logo';

const Signup = () => {
  const { type } = useParams();
  const userType = type || 'patient';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [reportFiles, setReportFiles] = useState([]);
  const [error, setError] = useState('');
  const { signup, isLoading, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    clearError();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!contact.trim()) {
      setError('Contact is required');
      return;
    }

    if (userType === 'doctor' && !licenseFile) {
      setError('Please upload your medical license');
      return;
    }

    if (userType === 'patient' && reportFiles.length === 0) {
      setError('Please upload at least one doctor report');
      return;
    }

    try {
      await signup(
        {
          fullName,
          email,
          contact,
          password,
          specialization,
          medicalNotes,
          doctorLicense: licenseFile,
          medicalReports: reportFiles,
        },
        userType,
      );
      navigate(userType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Logo size="default" />
        </div>
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join as a {userType}</p>

        <div className="user-type-nav">
          <Link to="/signup/patient" className={`type-link ${userType === 'patient' ? 'active' : ''}`}>Patient</Link>
          <Link to="/signup/doctor" className={`type-link ${userType === 'doctor' ? 'active' : ''}`}>Doctor</Link>
        </div>

        {(error || authError) && <div className="alert alert-error">{error || authError}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input label="Contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone or other contact" />

          {userType === 'doctor' && (
            <Input
              label="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. General Practice"
            />
          )}

          {userType === 'patient' && (
            <div className="input-group">
              <label className="input-label">Medical Notes</label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Optional symptoms or notes"
                className="input-field"
                rows="4"
              />
            </div>
          )}

          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />

          {userType === 'doctor' && (
            <div className="file-upload">
              <label>Medical License</label>
              <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setLicenseFile(e.target.files[0])} />
              {licenseFile && <span className="file-name">{licenseFile.name}</span>}
            </div>
          )}

          {userType === 'patient' && (
            <div className="file-upload">
              <label>Doctor&apos;s Report</label>
              <input type="file" accept=".pdf,.jpg,.png" multiple onChange={(e) => setReportFiles(Array.from(e.target.files || []))} />
              {reportFiles.length > 0 && <span className="file-name">{reportFiles.map((file) => file.name).join(', ')}</span>}
            </div>
          )}

          <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Sign Up'}</Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
