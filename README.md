# MindCare Connect - Mental Health Platform

A comprehensive mental health platform with integrated video therapy sessions powered by 100ms.

## Features

- 🎥 **HD Video Therapy Sessions** - Professional video calling with 100ms
- 📅 **Smart Appointment Scheduling** - Book and manage therapy sessions
- 👨‍⚕️ **Therapist Directory** - Find and connect with licensed therapists
- 🔒 **Secure & Private** - End-to-end encryption and HIPAA-compliant
- 📱 **Responsive Design** - Works on all devices

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and anon key to `.env`
3. Run the database migrations in the Supabase SQL editor

### 3. 100ms Setup

1. **Create 100ms Account**: Go to [100ms.live](https://100ms.live) and create an account
2. **Get Credentials**: 
   - Go to your 100ms Dashboard
   - Navigate to "Developer" section
   - Copy your Access Key and Secret Key
3. **Create Template**:
   - Go to "Templates" in your 100ms dashboard
   - Create a new template for video calls
   - Configure roles: `host` (for therapists) and `guest` (for patients)
   - Copy the Template ID
4. **Add to Environment**:
   ```
   VITE_HMS_ACCESS_KEY=your_access_key_here
   VITE_HMS_SECRET_KEY=your_secret_key_here
   VITE_HMS_TEMPLATE_ID=your_template_id_here
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

## 100ms Configuration Guide

### Template Setup
1. **Video Settings**: Enable HD video (720p recommended)
2. **Audio Settings**: Enable high-quality audio
3. **Roles Configuration**:
   - **Host Role** (Therapists):
     - Can publish video/audio
     - Can mute others
     - Can end room
   - **Guest Role** (Patients):
     - Can publish video/audio
     - Cannot mute others
     - Cannot end room

### Security Settings
- Enable waiting room (optional)
- Set maximum room duration (60 minutes recommended)
- Enable recording (if required for compliance)

## How Video Sessions Work

1. **Booking**: Patient books appointment with therapist
2. **Room Creation**: HMS room is automatically created when appointment is booked
3. **Joining**: 10 minutes before appointment, "Join Session" button appears
4. **Session**: Full HD video call with professional controls
5. **Ending**: Either party can end the session, duration is tracked

## Key Components

- `VideoSession.jsx` - Main video calling interface
- `AppointmentsList.jsx` - Appointment management
- `SchedulingModal.jsx` - Appointment booking
- `hmsTokenService.js` - 100ms API integration
- `hmsService.js` - Video session management

## Security Features

- Row Level Security (RLS) in Supabase
- Encrypted private notes
- Secure video sessions with 100ms
- Role-based access control
- HIPAA-compliant data handling

## Support

For issues with:
- **100ms Integration**: Check the 100ms documentation
- **Database Issues**: Check Supabase logs
- **General Issues**: Check browser console for errors

## License

MIT License - see LICENSE file for details