import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ResetSuccess from './components/auth/ResetSuccess';
import PatientDashboard from './components/patient/PatientDashboard';
import MedicationSetup from './components/patient/MedicationSetup';
import DoctorList from './components/patient/DoctorList';
import Chat from './components/patient/Chat';
import UploadReport from './components/patient/UploadReport';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PatientRecords from './components/doctor/PatientRecords';
import AppointmentQueue from './components/doctor/AppointmentQueue';
import DoctorChat from './components/doctor/DoctorChat';
import LicenseUpload from './components/doctor/LicenseUpload';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedType }) => {
  const { user, userType } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedType && userType !== allowedType) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/:type" element={<Signup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />
      
      <Route path="/patient/dashboard" element={<ProtectedRoute allowedType="patient"><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/medication-setup" element={<ProtectedRoute allowedType="patient"><MedicationSetup /></ProtectedRoute>} />
      <Route path="/patient/doctors" element={<ProtectedRoute allowedType="patient"><DoctorList /></ProtectedRoute>} />
      <Route path="/patient/chat" element={<ProtectedRoute allowedType="patient"><Chat /></ProtectedRoute>} />
      <Route path="/patient/upload-report" element={<ProtectedRoute allowedType="patient"><UploadReport /></ProtectedRoute>} />

      <Route path="/doctor/dashboard" element={<ProtectedRoute allowedType="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/patients" element={<ProtectedRoute allowedType="doctor"><PatientRecords /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute allowedType="doctor"><AppointmentQueue /></ProtectedRoute>} />
      <Route path="/doctor/chat" element={<ProtectedRoute allowedType="doctor"><DoctorChat /></ProtectedRoute>} />
      <Route path="/doctor/availability" element={<ProtectedRoute allowedType="doctor"><LicenseUpload /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;