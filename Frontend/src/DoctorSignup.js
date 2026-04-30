import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    password: '',
    specialization: '',
    maxPatients: 10, // Default value as per backend schema
    otp: '',
  });
  const [doctorLicense, setDoctorLicense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDoctorLicense(e.target.files[0]);
  };

  const handleRequestOTP = async () => {
    if (!formData.email || !formData.contact) {
      setError('Please provide email and contact number to receive an OTP.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          contact: formData.contact 
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setSuccess('OTP sent to your contact! Please check and enter it below.');
      } else {
        setError(result.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate if license is selected
    if (!doctorLicense) {
      setError('Doctor license is required.');
      setLoading(false);
      return;
    }

    if (!formData.otp) {
      setError('Please enter the OTP sent to your contact.');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('role', 'doctor'); // Explicitly set role for backend
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append('doctorLicense', doctorLicense);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup/verify-otp', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Doctor registration successful! Redirecting to login...');
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error or server is unreachable. Please check your connection.');
      console.error('Doctor signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Doctor Registration</h2>
        <p className="auth-subtitle">Join our platform to manage patients and medications.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="fullName" className="input-label">Full Name</label>
            <div className="input-wrapper">
              <input type="text" id="fullName" name="fullName" className="input-field" placeholder="Dr. John Doe" value={formData.fullName} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <div className="input-wrapper">
              <input type="email" id="email" name="email" className="input-field" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="contact" className="input-label">Contact Number</label>
            <div className="input-wrapper">
              <input type="text" id="contact" name="contact" className="input-field" placeholder="+1 (555) 123-4567" value={formData.contact} onChange={handleChange} required />
              <button type="button" className="btn-sm btn-link" onClick={handleRequestOTP} disabled={loading}>
                {otpSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <div className="input-wrapper">
              <input type="password" id="password" name="password" className="input-field" placeholder="********" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="otp" className="input-label">One-Time Password (OTP)</label>
            <div className="input-wrapper">
              <input type="text" id="otp" name="otp" className="input-field" placeholder="123456" value={formData.otp} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="specialization" className="input-label">Specialization</label>
            <div className="input-wrapper">
              <input type="text" id="specialization" name="specialization" className="input-field" placeholder="Cardiology" value={formData.specialization} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="maxPatients" className="input-label">Max Patients (Optional)</label>
            <div className="input-wrapper">
              <input type="number" id="maxPatients" name="maxPatients" className="input-field" value={formData.maxPatients} onChange={handleChange} min="1" />
            </div>
          </div>

          <div className="file-upload">
            <label htmlFor="doctorLicense" className="input-label">Doctor License (PDF/Image)</label>
            <input type="file" id="doctorLicense" name="doctorLicense" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
            {doctorLicense && <span className="file-name">{doctorLicense.name}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Doctor'}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="link">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;