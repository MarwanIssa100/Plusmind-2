import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Star, 
  MapPin, 
  Clock, 
  Filter, 
  Search, 
  Calendar,
  UserCheck,
  Award,
  BookOpen
} from 'lucide-react';
import DoctorProfile from './DoctorProfile';
import { 
  fetchDoctorsStart, 
  fetchDoctorsSuccess, 
  fetchDoctorsFailure, 
  setSelectedDoctor,
  updateFilters 
} from '../../store/slices/doctorsSlice';
import { dbService } from '../../services/supabase';

const DoctorsList = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error, filters } = useSelector((state) => state.doctors);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockDoctors = [
    {
      id: 1,
      user_id: 1,
      profiles: {
        full_name: 'Dr. Sarah Johnson'
      },
      user_profile: {
        full_name: 'Dr. Sarah Johnson',
        email: 'sarah@mindcare.com'
      },
      specializations: ['Anxiety Disorders', 'Depression', 'CBT'],
      bio: 'Dr. Johnson has over 10 years of experience helping patients overcome anxiety and depression. She specializes in Cognitive Behavioral Therapy and has helped hundreds of patients develop effective coping strategies.',
      years_experience: 10,
      hourly_rate: 150,
      average_rating: 4.8,
      total_reviews: 127,
      location: 'New York, NY',
      availability_slots: ['Mon 9:00-17:00', 'Wed 9:00-17:00', 'Fri 9:00-17:00'],
      avatar_url: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      user_id: 2,
      profiles: {
        full_name: 'Dr. Michael Chen'
      },
      user_profile: {
        full_name: 'Dr. Michael Chen',
        email: 'michael@mindcare.com'
      },
      specializations: ['PTSD', 'Trauma Therapy', 'EMDR'],
      bio: 'Dr. Chen specializes in trauma-informed care and PTSD treatment. He uses evidence-based approaches including EMDR and has extensive experience working with veterans and first responders.',
      years_experience: 15,
      hourly_rate: 180,
      average_rating: 4.9,
      total_reviews: 203,
      location: 'Los Angeles, CA',
      availability_slots: ['Tue 10:00-18:00', 'Thu 10:00-18:00', 'Sat 9:00-15:00'],
      avatar_url: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      user_id: 3,
      profiles: {
        full_name: 'Dr. Emily Rodriguez'
      },
      user_profile: {
        full_name: 'Dr. Emily Rodriguez',
        email: 'emily@mindcare.com'
      },
      specializations: ['Family Therapy', 'Couples Therapy', 'Child Psychology'],
      bio: 'Dr. Rodriguez focuses on family dynamics and relationships. She helps families navigate through difficult times and strengthens bonds between family members through evidence-based therapeutic approaches.',
      years_experience: 8,
      hourly_rate: 140,
      average_rating: 4.7,
      total_reviews: 89,
      location: 'Chicago, IL',
      availability_slots: ['Mon 14:00-20:00', 'Wed 14:00-20:00', 'Fri 14:00-20:00'],
      avatar_url: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      user_id: 4,
      profiles: {
        full_name: 'Dr. James Wilson'
      },
      user_profile: {
        full_name: 'Dr. James Wilson',
        email: 'james@mindcare.com'
      },
      specializations: ['Bipolar Disorder', 'Addiction', 'Group Therapy'],
      bio: 'Dr. Wilson has extensive experience in treating mood disorders and addiction. He leads group therapy sessions and believes in the power of community support in the healing process.',
      years_experience: 12,
      hourly_rate: 160,
      average_rating: 4.6,
      total_reviews: 156,
      location: 'Austin, TX',
      availability_slots: ['Tue 9:00-17:00', 'Thu 9:00-17:00'],
      avatar_url: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    dispatch(fetchDoctorsStart());
    try {
      const { data, error } = await dbService.getTherapistProfiles();
      if (error) throw error;
      
      // If no real data, use mock data for demo
      const therapists = data && data.length > 0 ? data : mockDoctors;
      dispatch(fetchDoctorsSuccess(therapists));
    } catch (err) {
      dispatch(fetchDoctorsFailure(err.message));
    }
  };

  const handleSelectDoctor = (doctor) => {
    dispatch(setSelectedDoctor(doctor));
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    dispatch(setSelectedDoctor(null));
  };

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = !searchTerm || 
      doctor.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specializations.some(spec => 
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesSpecialization = !filters.specialization ||
      doctor.specializations.includes(filters.specialization);
    
    const matchesRating = doctor.average_rating >= filters.minRating;
    
    return matchesSearch && matchesSpecialization && matchesRating;
  });

  const allSpecializations = [...new Set(doctors.flatMap(doctor => doctor.specializations))];

  if (showProfile) {
    return <DoctorProfile onClose={handleCloseProfile} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Therapist</h1>
        <p className="mt-2 text-gray-600">
          Connect with licensed mental health professionals who specialize in your needs
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <select
              value={filters.specialization}
              onChange={(e) => dispatch(updateFilters({ specialization: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specializations</option>
              {allSpecializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={filters.minRating}
              onChange={(e) => dispatch(updateFilters({ minRating: parseFloat(e.target.value) }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>All Ratings</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleSelectDoctor(doctor)}
          >
            <div className="p-6">
              {/* Doctor Photo and Basic Info */}
              <div className="flex items-center mb-4">
                <img
                  src={doctor.avatar_url}
                  alt={doctor.user_profile?.full_name || doctor.profiles?.full_name || 'Doctor'}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor.user_profile?.full_name || doctor.profiles?.full_name || 'Dr. Unknown'}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {doctor.location}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {doctor.average_rating} ({doctor.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations.slice(0, 2).map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                  {doctor.specializations.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{doctor.specializations.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bio Preview */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {doctor.bio}
              </p>

              {/* Experience and Rate */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {doctor.years_experience} years experience
                </div>
                <div className="font-semibold text-gray-900">
                  ${doctor.hourly_rate}/hour
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="line-clamp-1">
                  Available: {doctor.availability_slots[0]}
                </span>
              </div>

              {/* Action Button */}
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <UserCheck className="h-4 w-4" />
                <span>View Profile & Book</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <UserCheck className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No therapists found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find more therapists.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;