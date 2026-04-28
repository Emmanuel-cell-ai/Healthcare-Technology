import React, { createContext, useContext, useState } from 'react';
import { mockDoctors, mockPatients, mockMedications, mockChats, generateMockLogs } from '../mock/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [patients] = useState(mockPatients);
  const [medications, setMedications] = useState(mockMedications);
  const [logs] = useState(generateMockLogs());
  const [chats, setChats] = useState(mockChats);
  const [appointmentQueue, setAppointmentQueue] = useState([
    { id: 'a1', patientId: 'p1', patientName: 'John Doe', symptoms: 'Headaches', status: 'waiting', timestamp: '10:30 AM' },
    { id: 'a2', patientId: 'p2', patientName: 'Jane Smith', symptoms: 'Body pains', status: 'waiting', timestamp: '11:00 AM' },
  ]);

  const addMedication = (med) => {
    setMedications([...medications, { ...med, id: 'm' + Date.now() }]);
  };

  const sendMessage = (sender, receiver, message) => {
    const newMsg = { id: 'c' + Date.now(), sender, receiver, message, timestamp: new Date().toISOString() };
    setChats([...chats, newMsg]);
  };

  const toggleDoctorAvailability = (doctorId) => {
    setDoctors(doctors.map(d => d.id === doctorId ? { ...d, available: !d.available } : d));
  };

  const addAppointment = (patientId, patientName, symptoms) => {
    const newApt = { id: 'a' + Date.now(), patientId, patientName, symptoms, status: 'waiting', timestamp: new Date().toLocaleTimeString() };
    setAppointmentQueue([...appointmentQueue, newApt]);
  };

  return (
    <AppContext.Provider value={{
      doctors, patients, medications, logs, chats, appointmentQueue,
      addMedication, sendMessage, toggleDoctorAvailability, addAppointment,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);