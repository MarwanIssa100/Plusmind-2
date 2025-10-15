import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  User, 
  Camera, 
  Save, 
  Plus, 
  X, 
  Clock, 
  DollarSign,
  Award,
  BookOpen,
  MapPin,
  Upload,
  Loader
} from 'lucide-react';
import { dbService } from '../../services/supabase';

const TherapistProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ day: '', startTime: '', endTime: '' });

  const profileValidation = Yup.object({
    bio: Yup.string()
      .min(50, 'Bio must be at least 50 characters')
      .max(1000, 'Bio must be less than 1000 characters')
      .required('Bio is required'),
    hourly_rate: Yup.number()
      .min(50, 'Rate must be at least $50')
      .max(500, 'Rate must be less than $500')
      .required('Hourly rate is required'),
    years_experience: Yup.number()
      .min(0, 'Experience cannot be negative')
      .max(60, 'Experience seems too high')
      .required('Years of experience is required'),
    location: Yup.string()
      .required('Location is required'),
    avatar_url: Yup.string().url('Must be a valid URL'),
  });

  const specializations = [
    'Anxiety Disorders',
    'Depression',
    'PTSD/Trauma',
    'Bipolar Disorder',
    'Eating Disorders',
    'Addiction',
    'Family Therapy',
    'Couples Therapy',
    'Child Psychology',
    'Cognitive Behavioral Therapy',
    'Dialectical Behavior Therapy',
    'EMDR',
    'Mindfulness-Based Therapy',
    'Other',
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await dbService.getTherapistProfile(user.id);
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      if (data) {
        setProfile(data);
        setAvailabilitySlots(data.availability_slots || []);
      } else {
        // Create initial profile if doesn't exist
        const initialProfile = {
          user_id: user.id,
          bio: '',
          hourly_rate: 150,
          years_experience: 0,
          location: '',
          specializations: [],
          availability_slots: [],
          avatar_url: '',
        };
        setProfile(initialProfile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const profileData = {
        ...values,
        availability_slots: availabilitySlots,
        user_id: user.id,
      };

      let result;
      if (profile.id) {
        result = await dbService.updateTherapistProfile({ ...profileData, id: profile.id });
      } else {
        result = await dbService.createTherapistProfile(profileData);
      }

      if (result.error) throw result.error;
      
      setProfile(result.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAvailabilitySlot = () => {
    if (newSlot.day && newSlot.startTime && newSlot.endTime) {
      const slotString = `${newSlot.day} ${newSlot.startTime}-${newSlot.endTime}`;
      setAvailabilitySlots([...availabilitySlots, slotString]);
      setNewSlot({ day: '', startTime: '', endTime: '' });
    }
  };

  const handleRemoveAvailabilitySlot = (index) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
  };

  const handleSpecializationToggle = (specialization, currentSpecializations, setFieldValue) => {
    const updated = currentSpecializations.includes(specialization)
      ? currentSpecializations.filter(s => s !== specialization)
      : [...currentSpecializations, specialization];
    setFieldValue('specializations', updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Therapist Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your professional profile and availability
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'basic', label: 'Basic Info', icon: User },
              { key: 'availability', label: 'Availability', icon: Clock },
              { key: 'specializations', label: 'Specializations', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <Formik
            initialValues={{
              bio: profile?.bio || '',
              hourly_rate: profile?.hourly_rate || 150,
              years_experience: profile?.years_experience || 0,
              location: profile?.location || '',
              avatar_url: profile?.avatar_url || '',
              specializations: profile?.specializations || [],
            }}
            validationSchema={profileValidation}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Profile Photo
                      </label>
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          {values.avatar_url ? (
                            <img
                              src={values.avatar_url}
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <button
                            type="button"
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <Field
                            type="url"
                            name="avatar_url"
                            placeholder="Enter photo URL (e.g., from Pexels, Unsplash)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <ErrorMessage name="avatar_url" component="div" className="mt-1 text-sm text-red-600" />
                          <p className="mt-1 text-sm text-gray-500">
                            Use a professional headshot. Recommended size: 400x400px
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Bio
                      </label>
                      <Field
                        as="textarea"
                        name="bio"
                        id="bio"
                        rows={6}
                        placeholder="Tell potential patients about your background, approach to therapy, specialties, and what makes you passionate about helping others..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                      <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-600" />
                      <div className="mt-1 text-sm text-gray-500">
                        {values.bio.length}/1000 characters
                      </div>
                    </div>

                    {/* Experience and Rate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            type="number"
                            name="years_experience"
                            id="years_experience"
                            min="0"
                            max="60"
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <ErrorMessage name="years_experience" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
                          Hourly Rate (USD)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            type="number"
                            name="hourly_rate"
                            id="hourly_rate"
                            min="50"
                            max="500"
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <ErrorMessage name="hourly_rate" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="location"
                          id="location"
                          placeholder="e.g., New York, NY"
                          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                )}

                {activeTab === 'specializations' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Select Your Specializations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {specializations.map((specialization) => (
                        <label
                          key={specialization}
                          className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={values.specializations.includes(specialization)}
                            onChange={() => handleSpecializationToggle(specialization, values.specializations, setFieldValue)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-900">{specialization}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      Select all areas where you have training and experience. This helps patients find the right therapist for their needs.
                    </p>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Set Your Availability
                      </h3>
                      
                      {/* Current availability slots */}
                      <div className="space-y-2 mb-6">
                        {availabilitySlots.map((slot, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-900">{slot}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAvailabilitySlot(index)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {availabilitySlots.length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            No availability slots added yet
                          </p>
                        )}
                      </div>

                      {/* Add new slot */}
                      <div className="border border-gray-300 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Add Availability Slot</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <select
                            value={newSlot.day}
                            onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Day</option>
                            {daysOfWeek.map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          <input
                            type="time"
                            value={newSlot.startTime}
                            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="time"
                            value={newSlot.endTime}
                            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddAvailabilitySlot}
                            disabled={!newSlot.day || !newSlot.startTime || !newSlot.endTime}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;