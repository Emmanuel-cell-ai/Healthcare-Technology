import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../shared/Input';
import Button from '../shared/Button';

const Signup = () => {
  const { type } = useParams();
  const userType = type || 'patient';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (userType === 'doctor' && !licenseFile) {
      setError('Please upload your medical license');
      return;
    }
    if (userType === 'patient' && !reportFile) {
      setError('Please upload your doctor report');
      return;
    }
    signup({ fullName, email }, userType);
    navigate(userType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
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

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" icon="👤" />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" icon="📧" />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" icon="🔒" />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" icon="🔒" />

          {userType === 'doctor' && (
            <div className="file-upload">
              <label>Medical License</label>
              <input type="file" accept=".pdf,.jpg,.png" onChange={e => setLicenseFile(e.target.files[0])} />
              {licenseFile && <span className="file-name">📄 {licenseFile.name}</span>}
            </div>
          )}

          {userType === 'patient' && (
            <div className="file-upload">
              <label>Doctor's Report</label>
              <input type="file" accept=".pdf,.jpg,.png" onChange={e => setReportFile(e.target.files[0])} />
              {reportFile && <span className="file-name">📄 {reportFile.name}</span>}
            </div>
          )}

          <Button type="submit">Sign Up</Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;