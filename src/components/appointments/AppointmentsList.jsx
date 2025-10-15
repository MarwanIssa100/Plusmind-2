import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Clock, Video, Phone, User, CheckCircle, XCircle, AlertCircle, Play, CreditCard as Edit3, Loader } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isWithinInterval, addMinutes } from 'date-fns';
import VideoSession from '../video/VideoSession';
import { fetchAppointmentsSuccess } from '../../store/slices/doctorsSlice';
import { dbService } from '../../services/supabase';

const AppointmentsList = () => {
  const dispatch = useDispatch();
  const { user, userType } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.doctors);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'today', 'completed', 'all'
  const [joiningSession, setJoiningSession] = useState(null);

  // Mock appointments for demo
  const mockAppointments = [
    {
      id: 1,
      patient_id: userType === 'patient' ? user.id : 'patient-1',
      therapist_id: userType === 'therapist' ? user.id : 'therapist-1',
      appointment_date: new Date().toISOString(),
      appointment_time: '14:00',
      type: 'video',
      status: 'scheduled',
      notes: 'First session - anxiety management',
      patient: {
        full_name: userType === 'patient' ? user.user_metadata.full_name : 'John Doe'
      },
      therapist: {
        full_name: userType === 'therapist' ? user.user_metadata.full_name : 'Dr. Sarah Johnson'
      }
    },
    {
      id: 2,
      patient_id: userType === 'patient' ? user.id : 'patient-2',
      therapist_id: userType === 'therapist' ? user.id : 'therapist-1',
      appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      appointment_time: '10:00',
      type: 'video',
      status: 'scheduled',
      notes: 'Follow-up session',
      patient: {
        full_name: userType === 'patient' ? user.user_metadata.full_name : 'Jane Smith'
      },
      therapist: {
        full_name: userType === 'therapist' ? user.user_metadata.full_name : 'Dr. Sarah Johnson'
      }
    }
  ];

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await dbService.getAppointments(user.id, userType);
      if (error) throw error;
      
      // Use mock data if no real appointments
      const appointmentData = data && data.length > 0 ? data : mockAppointments;
      dispatch(fetchAppointmentsSuccess(appointmentData));
    } catch (err) {
      console.error('Error loading appointments:', err);
      // Use mock data on error
      dispatch(fetchAppointmentsSuccess(mockAppointments));
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentDateTime = (appointment) => {
    const date = new Date(appointment.appointment_date);
    const [hours, minutes] = appointment.appointment_time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  };

  const canJoinSession = (appointment) => {
    const appointmentTime = getAppointmentDateTime(appointment);
    const now = new Date();
    const joinWindow = {
      start: addMinutes(appointmentTime, -10), // 10 minutes before
      end: addMinutes(appointmentTime, 60)     // 60 minutes after
    };
    
    return appointment.status === 'scheduled' && 
           isWithinInterval(now, joinWindow);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatAppointmentDate = (appointment) => {
    const date = new Date(appointment.appointment_date);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM dd, yyyy');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointment_date);
    
    switch (filter) {
      case 'today':
        return isToday(appointmentDate);
      case 'upcoming':
        return !isPast(appointmentDate) && appointment.status === 'scheduled';
      case 'completed':
        return appointment.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  const handleJoinSession = (appointment) => {
    setJoiningSession(appointment.id);
    setActiveSession(appointment);
  };

  const handleEndSession = () => {
    setJoiningSession(null);
    setActiveSession(null);
    // Optionally update appointment status to completed
    loadAppointments();
  };

  if (activeSession) {
    return (
      <VideoSession 
        appointment={activeSession}
        onEndSession={handleEndSession}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="mt-2 text-gray-600">
          Manage your therapy sessions and join video calls
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'today', label: 'Today' },
            { key: 'completed', label: 'Completed' },
            { key: 'all', label: 'All' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => {
          const appointmentDateTime = getAppointmentDateTime(appointment);
          const canJoin = canJoinSession(appointment);
          
          return (
            <div
              key={appointment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {userType === 'patient' 
                          ? appointment.therapist?.full_name 
                          : appointment.patient?.full_name
                        }
                      </span>
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="capitalize">{appointment.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatAppointmentDate(appointment)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {appointment.type === 'video' ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                      <span className="capitalize">{appointment.type} Session</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {canJoin && (
                    <button
                      onClick={() => handleJoinSession(appointment)}
                      disabled={joiningSession === appointment.id}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {joiningSession === appointment.id ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Join Session</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {appointment.status === 'scheduled' && !canJoin && (
                    <div className="text-sm text-gray-500">
                      {isPast(appointmentDateTime) ? 'Session ended' : 'Join available 10 min before'}
                    </div>
                  )}
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600">
            {filter === 'today' 
              ? "You don't have any appointments today."
              : filter === 'upcoming'
              ? "You don't have any upcoming appointments."
              : "You don't have any appointments yet."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;