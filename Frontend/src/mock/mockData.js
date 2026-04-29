export const mockDoctors = [
  { id: 'd1', name: 'Dr. Mbarry', specialty: 'General Medicine', available: true, patients: ['p1'], avatar: '👨‍⚕️' },
  { id: 'd2', name: 'Dr. Francis', specialty: 'Cardiology', available: true, patients: [], avatar: '👩‍⚕️' },
  { id: 'd3', name: 'Dr. Sarah Chen', specialty: 'Neurology', available: false, patients: ['p2'], avatar: '👩‍⚕️' },
];

export const mockPatients = [
  { id: 'p1', name: 'John Doe', email: 'john@email.com', doctorId: 'd1', reports: ['report1.pdf'] },
  { id: 'p2', name: 'Jane Smith', email: 'jane@email.com', doctorId: 'd3', reports: [] },
];

export const mockMedications = [
  { id: 'm1', patientId: 'p1', name: 'Ampiclox', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-01-15', times: ['08:00', '20:00'] },
  { id: 'm2', patientId: 'p1', name: 'Vitamin C', dosage: '1000mg', frequency: 'Once daily', startDate: '2024-01-15', times: ['09:00'] },
];

export const generateMockLogs = () => {
  const logs = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    ['08:00', '20:00'].forEach(time => {
      const taken = Math.random() > 0.3;
      logs.push({
        date: dateStr,
        time,
        medication: 'Ampiclox 500mg',
        status: taken ? 'Taken' : 'Skipped',
        takenAt: taken ? `${dateStr}T${time}:00` : null,
      });
    });
  }
  return logs;
};

export const mockChats = [
  { id: 'c1', sender: 'p1', receiver: 'd1', message: 'Hello Doctor, having headaches', timestamp: '2024-01-20T10:30:00' },
  { id: 'c2', sender: 'd1', receiver: 'p1', message: 'How long have you had this?', timestamp: '2024-01-20T10:32:00' },
];