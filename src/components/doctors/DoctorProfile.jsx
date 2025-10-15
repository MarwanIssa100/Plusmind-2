import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Calendar,
  DollarSign,
  MessageCircle,
  CheckCircle
} from 'lucide-react';
import SchedulingModal from './SchedulingModal';

const DoctorProfile = ({ onClose }) => {
  const { selectedDoctor } = useSelector((state) => state.doctors);
  const [showScheduling, setShowScheduling] = useState(false);

  if (!selectedDoctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No doctor selected</p>
      </div>
    );
  }

  const doctor = selectedDoctor;

  const mockReviews = [
    {
      id: 1,
      patient_name: 'Sarah M.',
      rating: 5,
      comment: 'Dr. Johnson helped me through a very difficult period. Her approach is both professional and compassionate.',
      date: '2024-01-15'
    },
    {
      id: 2,
      patient_name: 'Mike D.',
      rating: 5,
      comment: 'Excellent therapist. Really knows how to make you feel comfortable and heard.',
      date: '2024-01-08'
    },
    {
      id: 3,
      patient_name: 'Jennifer L.',
      rating: 4,
      comment: 'Very helpful sessions. I\'ve learned so many valuable coping strategies.',
      date: '2023-12-20'
    }
  ];

  const handleBookAppointment = () => {
    setShowScheduling(true);
  };
  console.log("docotr's data",doctor)

  if (showScheduling) {
    return (
      <SchedulingModal 
        doctor={doctor}
        onClose={() => setShowScheduling(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to therapists</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Doctor Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-6">
            <img
              src={doctor.avatar_url}
              alt={doctor.user_profile?.full_name || doctor.profiles?.full_name || 'Doctor'}
              className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {doctor.user_profile?.full_name || doctor.profiles?.full_name || 'Dr. Unknown'}
              </h1>
              <div className="flex items-center justify-center md:justify-start mb-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-lg font-medium">{doctor.average_rating}</span>
                  <span className="ml-2 text-gray-600">({doctor.total_reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {doctor.location}
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {doctor.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${doctor.hourly_rate}
              </div>
              <div className="text-gray-600 text-sm mb-4">per session</div>
              <button
                onClick={handleBookAppointment}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-8">
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">
              {doctor.bio}
            </p>
          </section>

          {/* Experience and Credentials */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience & Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Experience</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {doctor.years_experience} years
                </p>
                <p className="text-sm text-gray-600">of clinical practice</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Patients Helped</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-600">successful treatments</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="font-medium text-gray-900">Satisfaction</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(doctor.average_rating * 20)}%
                </p>
                <p className="text-sm text-gray-600">patient satisfaction</p>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Current Schedule</h3>
              </div>
              <div className="space-y-2">
                {doctor.availability_slots.map((slot, index) => (
                  <div key={index} className="text-gray-700">
                    {slot}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Sessions typically run for 50 minutes
              </p>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Patient Reviews</h2>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{review.patient_name}</span>
                      <div className="flex items-center ml-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to start your journey?
              </h3>
              <p className="text-gray-700 mb-4">
                Take the first step towards better mental health. Book a session with {doctor.user_profile?.full_name || doctor.profiles?.full_name || 'this therapist'} today.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleBookAppointment}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;