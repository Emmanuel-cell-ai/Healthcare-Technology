# Healthcare Medication Tracker API

Node.js and Express.js backend for a victim-focused medication tracker with OTP-protected signup/login, medication scheduling, dose logging, and reminder alerts.

## Features

- OTP required for signup and login
- JWT-protected API routes
- Victim profile with emergency contact details
- Medication scheduling with multiple daily reminder times
- Dose logging and medication timeline history
- Background reminder engine that creates in-app alerts and marks missed doses

## Setup

1. Copy `.env.example` to `.env`
2. Set `MONGO_URI` and `JWT_SECRET`
3. Install dependencies with `npm install`
4. Start the API with `npm run dev`

## Main Endpoints

- `POST /api/auth/signup/request-otp`
- `POST /api/auth/signup/verify-otp`
- `POST /api/auth/login/request-otp`
- `POST /api/auth/login/verify-otp`
- `GET /api/auth/me`
- `POST /api/medications`
- `GET /api/medications`
- `PATCH /api/medications/:medicationId`
- `POST /api/medications/:medicationId/log-dose`
- `GET /api/medications/:medicationId/timeline`
- `GET /api/alerts`
- `PATCH /api/alerts/:alertId/acknowledge`

## OTP and Alert Delivery

The current implementation logs OTP codes and alerts to the console by default so the system works immediately in development. You can swap in Twilio, email, or push notification providers by extending:

- `src/services/otpService.js`
- `src/services/reminderService.js`
