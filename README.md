# Healthcare Medication Tracker API

A comprehensive Node.js and Express.js backend for a medication tracking system that helps patients manage their medications, allows doctors to monitor patients, and enables communication between healthcare providers and patients.

## What This Project Does

This application helps people remember to take their medications on time. Patients can track their medications, receive reminders, and log when they take their doses. Doctors can prescribe medications, manage appointments, and communicate with their patients.

## Features

### For Patients
- Secure signup and login with one-time password (OTP) verification
- Add and manage all your medications in one place
- Set up multiple daily reminder times for each medication
- Log each dose you take and track your medication history
- Receive alerts when it's time to take your medication
- Book appointments with doctors
- Chat directly with your healthcare provider

### For Doctors
- Secure signup and login with OTP verification
- Upload your medical license for verification
- View and manage your assigned patients
- Prescribe medications to patients
- Accept and manage appointment requests
- Chat with your patients
- Track patient medication adherence

### Security Features
- OTP required for signup and login
- JWT-protected API routes
- Passwords are securely hashed
- Contact verification through OTP

## Quick Start

1. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Set `MONGO_URI` (your MongoDB connection string)
   - Set `JWT_SECRET` (a secure random string for token signing)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

The API will start on the port specified in your .env file (default: 5000).

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Main Express application
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── controllers/        # Request handlers
│   │   ├── alertController.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── doctorController.js
│   │   ├── medicationController.js
│   │   └── patientController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js
│   │   └── upload.js       # File uploads
│   ├── models/             # Database schemas
│   │   ├── Appointment.js
│   │   ├── ChatMessage.js
│   │   ├── DoctorPatientAssignment.js
│   │   ├── DoseLog.js
│   │   ├── Medication.js
│   │   ├── MedicationAlert.js
│   │   ├── OtpCode.js
│   │   └── User.js
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   │   ├── emailService.js
│   │   ├── otpService.js
│   │   ├── reminderService.js
│   │   └── tokenService.js
│   └── utils/              # Helper functions
├── uploads/                # Uploaded files
│   ├── licenses/           # Doctor licenses
│   └── reports/            # Medical reports
└── package.json
```

## Main API Endpoints

### Authentication
- `POST /api/auth/signup/request-otp` - Request OTP for signup
- `POST /api/auth/signup/verify-otp` - Verify OTP and create account
- `POST /api/auth/login/request-otp` - Request OTP for login
- `POST /api/auth/login/verify-otp` - Verify OTP and log in
- `GET /api/auth/me` - Get current user info

### Medications
- `POST /api/medications` - Add a new medication
- `GET /api/medications` - Get all your medications
- `PATCH /api/medications/:medicationId` - Update a medication
- `DELETE /api/medications/:medicationId` - Delete a medication
- `POST /api/medications/:medicationId/log-dose` - Log when you take a dose
- `GET /api/medications/:medicationId/timeline` - Get dose history

### Alerts
- `GET /api/alerts` - Get all your medication alerts
- `PATCH /api/alerts/:alertId/acknowledge` - Mark alert as acknowledged

### Appointments
- `POST /api/doctor/appointments` - Create an appointment request
- `GET /api/doctor/appointments` - Get appointments
- `PATCH /api/doctor/appointments/:id` - Update appointment status

### Chat
- `POST /api/chat/send` - Send a message
- `GET /api/chat/messages/:userId` - Get conversation with a user

### Doctor Features
- `GET /api/doctor/patients` - Get assigned patients
- `POST /api/doctor/prescribe` - Prescribe medication to a patient
- `GET /api/doctor/profile` - Get doctor profile
- `PATCH /api/doctor/profile` - Update doctor profile

## Database Schema

The application uses MongoDB to store:

1. **Users** - Patients and doctors with their profiles
2. **Medications** - All prescribed medications with schedules
3. **Dose Logs** - History of when medications were taken
4. **Medication Alerts** - Reminders for medication times
5. **Appointments** - Doctor-patient appointment scheduling
6. **Chat Messages** - Conversations between doctors and patients
7. **OTP Codes** - Temporary verification codes
8. **Doctor-Patient Assignments** - Links between doctors and patients

For detailed schema information, see [SCHEMA.txt](SCHEMA.txt).

## Extending Notifications

The current implementation logs OTP codes and alerts to the console for development convenience. To add real notifications:

- **For OTP delivery:** Modify `src/services/otpService.js` to integrate with Twilio, email, or SMS
- **For medication reminders:** Modify `src/services/reminderService.js` to add push notifications, SMS, or email

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT tokens |
| NODE_ENV | Environment (development/production) |

## Related Projects

This backend works with the React frontend found in the `Frontend/` directory.
