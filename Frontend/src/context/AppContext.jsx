import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { get, patch, patchForm, post, postForm } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

function getId(item) {
  return item?.id || item?._id || '';
}

function mapConversationParticipant(conversation) {
  return {
    id: getId(conversation.participant),
    fullName: conversation.participant?.fullName || 'Unknown',
    role: conversation.participant?.role,
    lastMessage: conversation.lastMessage,
  };
}

function mapDoseLogs(medications, timelines) {
  const medicationMap = new Map(medications.map((medication) => [getId(medication), medication]));
  const logs = [];

  timelines.forEach((timeline) => {
    timeline.doses.forEach((dose) => {
      const medication = medicationMap.get(getId(dose.medication)) || timeline.medication;
      logs.push({
        id: getId(dose),
        medicationId: getId(medication),
        medicationName: medication?.name || 'Medication',
        takenAt: dose.takenAt,
        status: 'Taken',
        notes: dose.notes || '',
        sideEffects: dose.sideEffects || '',
      });
    });

    timeline.alerts
      .filter((alert) => alert.status === 'skipped')
      .forEach((alert) => {
        const medication = medicationMap.get(getId(alert.medication)) || timeline.medication;
        logs.push({
          id: getId(alert),
          medicationId: getId(medication),
          medicationName: medication?.name || 'Medication',
          takenAt: alert.scheduledFor,
          status: 'Skipped',
          notes: alert.message || '',
          sideEffects: '',
        });
      });
  });

  return logs.sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt));
}

export const AppProvider = ({ children }) => {
  const { token, user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [appError, setAppError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [medications, setMedications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [doctorDashboard, setDoctorDashboard] = useState(null);
  const [patientRecords, setPatientRecords] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);

  const resetState = () => {
    setDoctors([]);
    setMedications([]);
    setAlerts([]);
    setLogs([]);
    setAppointments([]);
    setConversations([]);
    setAssignedPatients([]);
    setDoctorDashboard(null);
    setPatientRecords(null);
    setActiveConversation(null);
    setAppError('');
  };

  const refreshConversations = async (currentToken = token) => {
    const response = await get('/chat/conversations', currentToken);
    const nextConversations = response.conversations.map(mapConversationParticipant);
    setConversations(nextConversations);
    return nextConversations;
  };

  const refreshPatientData = async (currentToken = token) => {
    const [medicationsResponse, alertsResponse, doctorsResponse, appointmentsResponse] = await Promise.all([
      get('/medications', currentToken),
      get('/alerts', currentToken),
      get('/patients/doctors', currentToken),
      get('/patients/appointments', currentToken),
    ]);

    setMedications(medicationsResponse.medications);
    setAlerts(alertsResponse.alerts);
    setDoctors(doctorsResponse.doctors);
    setAppointments(appointmentsResponse.appointments);

    if (medicationsResponse.medications.length) {
      const timelines = await Promise.all(
        medicationsResponse.medications.map((medication) =>
          get(`/medications/${getId(medication)}/timeline`, currentToken),
        ),
      );
      setLogs(mapDoseLogs(medicationsResponse.medications, timelines));
    } else {
      setLogs([]);
    }

    await refreshConversations(currentToken);
  };

  const refreshDoctorData = async (currentToken = token) => {
    const [dashboardResponse, patientsResponse, appointmentsResponse] = await Promise.all([
      get('/doctors/dashboard', currentToken),
      get('/doctors/patients', currentToken),
      get('/doctors/appointments', currentToken),
    ]);

    setDoctorDashboard(dashboardResponse);
    setAssignedPatients(patientsResponse.patients);
    setAppointments(appointmentsResponse.appointments);
    await refreshConversations(currentToken);
  };

  const refreshAppData = async (currentToken = token, currentUser = user) => {
    if (!currentToken || !currentUser) {
      resetState();
      return;
    }

    setIsLoading(true);
    setAppError('');

    try {
      if (currentUser.role === 'patient') {
        await refreshPatientData(currentToken);
      } else if (currentUser.role === 'doctor') {
        await refreshDoctorData(currentToken);
      }
    } catch (error) {
      setAppError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user) {
      resetState();
      return;
    }

    refreshAppData().catch(() => {});
  }, [token, user]);

  const createMedication = async (payload) => {
    const response = await post('/medications', payload, token);
    await refreshPatientData();
    return response.medication;
  };

  const takeAlertDose = async (alertId) => {
    const response = await patch(`/alerts/${alertId}/take`, {}, token);
    await refreshPatientData();
    return response;
  };

  const skipAlertDose = async (alertId) => {
    const response = await patch(`/alerts/${alertId}/skip`, {}, token);
    await refreshPatientData();
    return response;
  };

  const logDose = async (medicationId, payload = {}) => {
    const response = await post(`/medications/${medicationId}/log-dose`, payload, token);
    await refreshPatientData();
    return response;
  };

  const requestAppointment = async (doctorId, notes = '') => {
    const response = await post('/patients/appointments', { doctorId, notes }, token);
    await refreshPatientData();
    return response;
  };

  const updateAvailability = async (availabilityStatus) => {
    const response = await patch('/doctors/availability', { availabilityStatus }, token);
    updateUser(response.user);
    await refreshDoctorData();
    return response;
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    const response = await patch(`/doctors/appointments/${appointmentId}`, { status }, token);
    await refreshDoctorData();
    return response;
  };

  const fetchPatientRecords = async (patientId) => {
    const response = await get(`/doctors/patients/${patientId}/records`, token);
    setPatientRecords(response);
    return response;
  };

  const fetchConversation = async (participantId) => {
    const response = await get(`/chat/${participantId}/messages`, token);
    setActiveConversation(response);
    return response;
  };

  const sendMessage = async (participantId, body) => {
    const response = await post(`/chat/${participantId}/messages`, { body }, token);
    await fetchConversation(participantId);
    return response.chatMessage;
  };

  const uploadMedicalReports = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('medicalReports', file);
    });

    const response = await postForm('/patients/reports', formData, token);
    updateUser(response.user);
    await refreshPatientData();
    return response;
  };

  const uploadDoctorLicense = async (file) => {
    const formData = new FormData();
    formData.append('doctorLicense', file);

    const response = await patchForm('/doctors/profile/license', formData, token);
    updateUser(response.user);
    await refreshDoctorData();
    return response;
  };

  const clearAppError = () => setAppError('');

  const value = useMemo(
    () => ({
      isLoading,
      appError,
      doctors,
      medications,
      alerts,
      logs,
      appointments,
      conversations,
      assignedPatients,
      doctorDashboard,
      patientRecords,
      activeConversation,
      clearAppError,
      refreshAppData,
      createMedication,
      takeAlertDose,
      skipAlertDose,
      logDose,
      requestAppointment,
      updateAvailability,
      updateAppointmentStatus,
      fetchPatientRecords,
      fetchConversation,
      sendMessage,
      uploadMedicalReports,
      uploadDoctorLicense,
    }),
    [
      isLoading,
      appError,
      doctors,
      medications,
      alerts,
      logs,
      appointments,
      conversations,
      assignedPatients,
      doctorDashboard,
      patientRecords,
      activeConversation,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
