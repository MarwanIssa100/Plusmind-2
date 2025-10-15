import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  X, 
  CheckCircle, 
  DollarSign,
  User,
  ArrowLeft,
  Video
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { bookAppointment } from '../../store/slices/doctorsSlice';
import { dbService } from '../../services/supabase';

const SchedulingModal = ({ doctor, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState('video');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState('datetime'); // 'datetime' or 'confirmation'
 console.log(doctor)
  // Generate next 7 days for scheduling
  const weekStart = startOfWeek(new Date());
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Mock available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setStep('confirmation');
    }
  };

  const handleBookAppointment = () => {
    const appointmentData = {
      patient_id: user.id,
      therapist_id: doctor.user_id || doctor.id,
      appointment_date: selectedDate.toISOString(),
      appointment_time: selectedTime,
      type: appointmentType,
      notes: notes,
    };

    const saveAppointment = async () => {
      try {
        const { data, error } = await dbService.createAppointment(appointmentData);
        if (error) throw error;
        
        dispatch(bookAppointment(data));
        onClose();
      } catch (error) {
        console.error('Error booking appointment:', error);
      }
    };

    saveAppointment();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {step === 'confirmation' && (
                <button
                  onClick={() => setStep('datetime')}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {step === 'datetime' ? 'Schedule Appointment' : 'Confirm Appointment'}
                </h2>
                <p className="text-gray-600">with {doctor.user_profile?.full_name || 'Unknown Therapist'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'datetime' && (
            <>
              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Select Date
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {availableDates.map((date) => {
                    const isSelected = selectedDate && 
                      format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    const isPast = date < new Date().setHours(0, 0, 0, 0);
                    
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => !isPast && handleDateSelect(date)}
                        disabled={isPast}
                        className={`p-3 rounded-lg text-center transition-colors ${
                          isPast
                            ? 'text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {format(date, 'EEE')}
                        </div>
                        <div className="text-lg font-bold">
                          {format(date, 'd')}
                        </div>
                        <div className="text-xs">
                          {format(date, 'MMM')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Select Time
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-3 rounded-lg text-center transition-colors ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointment Type */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Appointment Type
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      value="video"
                      checked={appointmentType === 'video'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="flex items-center font-medium text-gray-900">
                        <Video className="h-4 w-4 mr-2 text-blue-600" />
                        Video Call (Recommended)
                      </div>
                      <div className="text-sm text-gray-600">
                        HD video session with screen sharing and recording capabilities
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      value="phone"
                      checked={appointmentType === 'phone'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Phone Call</div>
                      <div className="text-sm text-gray-600">
                        Audio-only session via phone
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notes (Optional)
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything you'd like the therapist to know before your session?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Continue to Confirmation
              </button>
            </>
          )}

          {step === 'confirmation' && (
            <>
              {/* Appointment Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Appointment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-900">{doctor.user_profile?.full_name || 'Unknown Therapist'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-900">{selectedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">Type:</span>
                    <span className="text-gray-900 capitalize">
                      {appointmentType} Session
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-900">
                      {formatCurrency(doctor.hourly_rate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Please join the session 5 minutes early</li>
                  <li>• Cancellations must be made at least 24 hours in advance</li>
                  <li>• You will receive a confirmation email with session details</li>
                  <li>• Payment will be processed after the session</li>
                </ul>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleBookAppointment}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Confirm Appointment</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulingModal;